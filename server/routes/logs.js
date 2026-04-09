import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { addSseClient, removeSseClient } from '../logger.js'

const router = Router()

router.get('/stream', requireAuth, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()
  addSseClient(res)
  req.on('close', () => removeSseClient(res))
})

export default router
