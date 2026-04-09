import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { requireAuth } from '../middleware/requireAuth.js'
import { logger } from '../logger.js'

const router = Router()

router.post('/login', (req, res) => {
  const { username, password } = req.body
  if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASSWORD) {
    logger.warn('Failed login', { username })
    return res.status(401).json({ error: 'Invalid credentials' })
  }
  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' })
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 86400000,
    secure: process.env.NODE_ENV === 'production',
  })
  logger.info('Login', { username })
  res.json({ user: { username } })
})

router.post('/logout', (req, res) => {
  res.clearCookie('token')
  res.json({ ok: true })
})

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { username: req.user.username } })
})

export default router
