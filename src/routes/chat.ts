import ollama from 'ollama'
import { Router } from 'express'

const router = Router()

type RequestBody = {
  message: string
}

router.get('/chat', (req, res) => {
  res.send('GET message')
})

router.post('/chat', async (req, res) => {
  const body: RequestBody = req.body

  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')

  const response = await ollama.chat({
    model: 'gemma:2b',
    messages: [{role: 'user', content: body.message}],
    stream: true,
    // keep_alive: 1
  })

  for await (const part of response) {
    res.write(part.message.content)
  }

  res.end()
})

export default router