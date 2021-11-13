const https = require('https')

function parseAccessKey (accessKey) {
  let scheme = null
  let rest = null
  let auth = null
  let username = null
  let password = null
  let baseUrl = null
  ;[scheme, rest] = accessKey.split('//')
  ;[auth, rest] = rest.split('@')
  ;[username, password] = auth.split(':')
  baseUrl = `${scheme}//${rest}`
  return {
    baseUrl: baseUrl,
    username: username,
    password: password
  }
}

async function getAccessKey (base64Token) {
  const token = Buffer.from(base64Token, 'base64').toString()
  const options = {
    method: 'POST',
    port: 443,
    headers: { 'Content-Length': 0 }
  }
  return new Promise((resolve, reject) => {
    const req = https.request(new URL(token), options, (res) => {
      res.on('data', (d) => {
        resolve(d.toString())
      })
    })
    req.on('error', (e) => {
      reject(e)
    })
    req.end()
  })
}

async function getTransactions (accessKey, startDate, endDate) {
  const now = new Date()
  startDate = startDate || new Date(now.getFullYear(), now.getMonth(), 1)
  endDate = endDate || new Date(now.getFullYear(), now.getMonth() + 1, 1)
  console.log(`${startDate.toISOString().split('T')[0]} - ${endDate.toISOString().split('T')[0]}`)
  return await getAccounts(accessKey, startDate, endDate)
}

function normalizeDate (date) {
  return (date.valueOf() - date.getTimezoneOffset() * 60 * 1000) / 1000
}

async function getAccounts (accessKey, startDate, endDate) {
  const sfin = parseAccessKey(accessKey)
  const options = {
    headers: {
      Authorization: `Basic ${Buffer.from(`${sfin.username}:${sfin.password}`).toString('base64')}`
    }
  }
  const params = []
  let queryString = ''
  if (startDate) {
    params.push(`start-date=${normalizeDate(startDate)}`)
  }
  if (endDate) {
    params.push(`end-date=${normalizeDate(endDate)}`)
  }
  if (params.length > 0) {
    queryString += '?' + params.join('&')
  }
  return new Promise((resolve, reject) => {
    const req = https.request(new URL(`${sfin.baseUrl}/accounts${queryString}`), options, (res) => {
      let data = ''
      res.on('data', (d) => {
        data += d
      })
      res.on('end', () => {
        resolve(JSON.parse(data))
      })
    })
    req.on('error', (e) => {
      reject(e)
    })
    req.end()
  })
}

module.exports = { parseAccessKey, getAccessKey, getAccounts, getTransactions }
