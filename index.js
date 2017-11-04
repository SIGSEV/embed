const express = require('express')
const request = require('request')

const server = express()

server.get('/', (req, res) => {
  if (!req.query.url) {
    return res.status(400).end()
  }

  const path = req.query.url
    .replace(/\/$/, '')
    .split('/')
    .slice(-2)
    .join('/')

  request(
    `https://raw.githubusercontent.com/SIGSEV/embed/gh-pages/${path}/embed.json`,
    (err, resp) => {
      if (err || resp.statusCode > 399) {
        return res.status(400).end()
      }

      res.json(JSON.parse(resp.body))
    },
  )
})

const port = 4500

server.listen(port, () => {
  console.log(`[embed] listening on port ${port}`)
})
