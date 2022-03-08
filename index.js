// express server for serving static files
require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT
const path = require('path')
//app.get('/', (req, res) => {
//  res.send('Hello World!')
//})
app.use('/', express.static(path.join(__dirname, 'dist/client')))
app.listen(port, () => {
  console.log(`Client running on port ${port}`)
})