import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()
router.use(requireAuth)

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM items ORDER BY created_at DESC').all())
})

router.post('/', (req, res) => {
  const { name } = req.body
  if (!name?.trim()) return res.status(400).json({ error: 'name required' })
  const { lastInsertRowid } = db.prepare('INSERT INTO items (name) VALUES (?)').run(name.trim())
  res.status(201).json(db.prepare('SELECT * FROM items WHERE id = ?').get(lastInsertRowid))
})

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id)
  res.status(204).end()
})

export default router
