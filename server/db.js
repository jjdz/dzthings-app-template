import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs'
import { logger } from './logger.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Relative DB_PATH is resolved from the project root (one level up from server/)
const rawPath = process.env.DB_PATH || './data/db.sqlite'
const dbPath = rawPath.startsWith('/') ? rawPath : resolve(__dirname, '..', rawPath)

const dir = dirname(dbPath)
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

export const db = new Database(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    created_at  TEXT    DEFAULT CURRENT_TIMESTAMP
  )
`)

logger.info('Database ready', { path: dbPath })

export function closeDb() {
  db.close()
  logger.info('Database closed')
}
