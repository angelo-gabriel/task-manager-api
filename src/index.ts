import { Request, Response } from 'express'
import cors from 'cors'
import { corsOptions } from './cors'
import dotenv from 'dotenv'
import chat from './routes/chat'
import { PrismaClient } from '@prisma/client'

const express = require('express')

dotenv.config()

const prisma = new PrismaClient()

interface Note {
  title: string
  details: string
  category: string
}

function main() {
  const app = express()
  const port = 8080

  app.use(cors(corsOptions))
  app.use(express.json())

  app.get('/notes', async (req: Request, res: Response) => {
    try {
      const notes = await prisma.notes.findMany()
      console.log(notes)
      return res.status(200).json({ notes })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar notas' })
    }
  })

  app.delete('/notes/:id', async (req: Request, res: Response) => {
    const { id } = req.params
    try {
      await prisma.notes.delete({
        where: { id: Number(id) },
      })
      return res.status(200).json({ message: 'Nota deletada com sucesso' })
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar' })
    }
  })

  app.post('/notes', async (req: Request, res: Response) => {
    const { title, details, category }: Note = req.body

    try {
      const newNote = await prisma.notes.create({
        data: { title, details, category },
      })
      return res.status(201).json(newNote)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar nota' })
    }
  })

  app.use('/api', chat)
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

main()
