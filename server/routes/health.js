import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    version: process.env.npm_package_version,
    uptime: process.uptime(),
  })
})

export default router
