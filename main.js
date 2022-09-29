const ParseServer = require('parse-server').ParseServer
const Parse = require("parse/node")
const express = require('express')
require('dotenv').config()

const parseApi = new ParseServer({
    cloud: './cloud.js',
    appId: process.env.PARSE_APP_ID,
    masterKey: process.env.PARSE_MASTER_KEY,
    serverURL: process.env.PARSE_URL,
    filesAdapter: '@parse/s3-files-adapter',
    databaseURI: 'mongodb://localhost/test'
})

Parse.initialize(process.env.PARSE_APP_ID, 
    process.env.PARSE_JAVASCRIPT_KEY, 
    process.env.PARSE_MASTER_KEY
)

const app = express()
app.use(express.json())
app.use('/parse', parseApi)

app.listen(1337, () => {console.log('server running')})