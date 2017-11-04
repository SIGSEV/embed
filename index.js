const express = require('express')

const server = express()

server.get('/embed', (req, res) => {
  res.send({})
})

const port = 4500

server.listen(port, () => {
  console.log(`[embed] listening on port ${port}`)
})
