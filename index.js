const express = require('express')
const request = require('request')
const httpProxy = require('http-proxy')
const cheerio = require('cheerio')

const server = express()

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const getJSON = path =>
  new Promise((resolve, reject) =>
    request(
      `https://raw.githubusercontent.com/SIGSEV/embed/master${path.replace(/\/$/, '')}/embed.json`,
      (err, resp) => {
        if (err || resp.statusCode > 399) {
          return reject(err)
        }

        resolve(JSON.parse(resp.body))
      },
    ),
  )

server.get('/oembed', async (req, res) => {
  if (!req.query.url) {
    return res.status(400).end()
  }

  const path = req.query.url.replace('https://embed.balthazar.dev', '')

  try {
    const json = await getJSON(path)
    res.json(json)
  } catch (e) {
    res.status(400).send({ message: e ? e.message : 'error' })
  }
})

const proxy = httpProxy.createProxyServer()

const proxyUrl = (req, res, url) => {
  const match = url.match(/(https?:\/\/[^\/]*)(.*)/)

  const target = match[1]
  req.url = match[2]

  return proxy.web(req, res, {
    changeOrigin: true,
    target,
  })
}

server.get('*', async (req, res) => {
  try {
    const json = await getJSON(req.path)
    const target = cheerio('iframe', json.html).attr('src')
    proxyUrl(req, res, target)
  } catch (e) {
    res.status(400).send({ message: e ? e.message : 'error' })
  }
})

const port = 4500

server.listen(port, () => {
  console.log(`[embed] listening on port ${port}`)
})
