const BASE = import.meta.env.VITE_API_URL || ''

let onUnauthorized = null
export function setUnauthorizedHandler(fn) { onUnauthorized = fn }

async function request(method, path, body) {
  const opts = { method, credentials: 'include', headers: {} }
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json'
    opts.body = JSON.stringify(body)
  }

  const res = await fetch(BASE + path, opts)

  if (res.status === 401) {
    if (onUnauthorized) onUnauthorized()
    throw { status: 401, message: 'Unauthorized' }
  }

  if (!res.ok) {
    let message = res.statusText
    try { const d = await res.json(); message = d.error || d.message || message } catch {}
    throw { status: res.status, message }
  }

  if (res.status === 204) return null
  return res.json()
}

export const get  = (path)        => request('GET',    path)
export const post = (path, body)  => request('POST',   path, body)
export const del  = (path)        => request('DELETE', path)
