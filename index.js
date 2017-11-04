const express = require('express')
const request = require('request')

const server = express()

server.get('/oembed', (req, res) => {

  const url = 'https://sigsev.github.io/embed/fcc/evolution/'
  console.log(req.params.url)
  // request(`https://raw.githubusercontent.com/SIGSEV/embed/gh-pages/fcc/evolution/embed.json`)
  res.send({})
})

const port = 4500

server.listen(port, () => {
  console.log(`[embed] listening on port ${port}`)
})
