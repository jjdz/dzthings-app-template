import dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env') })

import express from 'express'
import { db } from './db.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/api/items', (req, res) => {
  res.json(db.prepare('SELECT * FROM items ORDER BY created_at DESC').all())
})

app.post('/api/items', (req, res) => {
  const { name } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'name required' })
  const { lastInsertRowid } = db.prepare('INSERT INTO items (name) VALUES (?)').run(name.trim())
  res.status(201).json(db.prepare('SELECT * FROM items WHERE id = ?').get(lastInsertRowid))
})

app.delete('/api/items/:id', (req, res) => {
  db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

if (process.env.NODE_ENV === 'production') {
  const dist = resolve(__dirname, '../client/dist')
  app.use(express.static(dist))
  app.get('*', (req, res) => res.sendFile(resolve(dist, 'index.html')))
}

app.listen(PORT, () => console.log(`server: http://localhost:${PORT}`))
