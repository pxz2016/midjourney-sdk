require('dotenv').config()
const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const { HttpsProxyAgent } = require('https-proxy-agent')
const server = express()
const router = express.Router()

const createProxy = (path, target, options = {}) => [
  path,
  createProxyMiddleware({
    ...options,
    target,
    changeOrigin: true,
    pathRewrite: { [`^/proxy${path}`]: '' },
    agent: new HttpsProxyAgent(process.env.HTTP_PROXY)
  })
]

// proxy image
router.use(...createProxy('/discordapp', 'https://cdn.discordapp.com'))
// proxy discord api
router.use(...createProxy('/discord', 'https://discord.com'))
// proxy disocrd websokcet
router.use(
  ...createProxy('/discordWs', 'wss://gateway.discord.gg', {
    ws: true,
    headers: { Host: 'gateway.discord.gg', Origin: 'https://discord.com' }
  })
)

server.use('/proxy', router)

server.listen(process.env.PORT, () => {
  console.log(`http proxy service run on http://localhost:${process.env.PORT}`)
})
