const buffer = []
const MAX = 200
const clients = new Set()

function log(level, message, meta = {}) {
  const entry = { timestamp: new Date().toISOString(), level, message, ...meta }
  const line = JSON.stringify(entry)
  buffer.push(line)
  if (buffer.length > MAX) buffer.shift()
  for (const res of clients) res.write(`data: ${line}\n\n`)
  process.stdout.write(line + '\n')
}

export const logger = {
  info:  (msg, meta) => log('info',  msg, meta),
  warn:  (msg, meta) => log('warn',  msg, meta),
  error: (msg, meta) => log('error', msg, meta),
}

export function addSseClient(res) {
  clients.add(res)
  for (const line of buffer) res.write(`data: ${line}\n\n`)
}

export function removeSseClient(res) {
  clients.delete(res)
}
