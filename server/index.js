import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') })

import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { logger } from './logger.js'
import { closeDb } from './db.js'
import authRoutes from './routes/auth.js'
import healthRoutes from './routes/health.js'
import logsRoutes from './routes/logs.js'
import itemsRoutes from './routes/items.js'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || false, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',   authRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/logs',   logsRoutes)
app.use('/api/items',  itemsRoutes)

if (process.env.NODE_ENV === 'production') {
  const pub = resolve(dirname(fileURLToPath(import.meta.url)), 'public')
  app.use(express.static(pub))
  app.get('*', (req, res) => res.sendFile(resolve(pub, 'index.html')))
}

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => logger.info(`Server on :${PORT}`))

function shutdown() {
  logger.info('Shutting down')
  server.close(() => { closeDb(); process.exit(0) })
}

process.on('SIGTERM', shutdown)
process.on('SIGINT',  shutdown)
