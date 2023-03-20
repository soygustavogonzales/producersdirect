require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

let refreshTokens = [];
let tokens = [];
let users = [];

app.post('auth/refresh', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

app.post('/whoami', (req, res) => {
    const token = req.body.token
    if (token == null) return res.sendStatus(401)
    if (!tokens.includes(refreshToken)) return res.sendStatus(403)
    res.send()
});

app.post('auth/login', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const psw = req.body.username
  const user = { name: username, pasword: psw }
  users.push(user)

  const accessToken = generateAccessToken(user)
  tokens.push(accessToken)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d'
  })
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 5*60 })
}

app.listen(4000)