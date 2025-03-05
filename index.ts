import express, { Request, Response } from 'express'
import cors from 'cors'
import { corsOptions } from './cors'
import dotenv from 'dotenv'
import chat from './src/routes/chat'
import sqlite3 from 'sqlite3'

dotenv.config()

function main() {
  const app = express()
  const port = 3333

  app.use(cors(corsOptions))
  app.use(express.json())
  const db = new sqlite3.Database('./notes.db', (err) => {
    if (err) {
      console.error('Erro ao conectar com o Banco de Dados', err)
    } else {
      console.log('Conectado ao Banco de Dados SQLITE')
    }
  })

  db.run(
    `CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      details TEXT,
      category TEXT
    )`
  )

  interface Note {
    id: number
    title: string
    details: string
    category: string
  }

  app.get('/notes', (req: Request, res: Response) => {
    db.all('SELECT * FROM notes', [], (err, rows: Note[]) => {
      if (err) {
        res.status(500).json({ error: err.message })
      } else {
        res.json({ notes: rows })
      }
    })
  })

  app.delete('/notes/:id', (req: Request, res: Response) => {
    const { id } = req.params

    db.run('DELETE FROM notes WHERE id = ?', [id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao remover nota'})
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Nota não encontrada'})
      }
      res.json({ message: 'Nota removida com sucesso!'})
    })
  })

  app.post('/notes', (req: Request, res: Response) => {
    const { title, details, category }: Note = req.body;
    const sql = `INSERT INTO notes (title, details, category) VALUES (?, ?, ?)`;
    db.run(sql, [title, details, category], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID, title, details, category });
      }
    });
  });

  app.use('/api', chat)
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

main()
