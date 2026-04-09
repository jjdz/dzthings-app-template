import jwt from 'jsonwebtoken'
import { logger } from '../logger.js'

export function requireAuth(req, res, next) {
  const token = req.cookies?.token
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    logger.warn('Invalid token', { err: err.message })
    res.status(401).json({ error: 'Unauthorized' })
  }
}
