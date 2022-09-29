const ParseServer = require('parse-server').ParseServer
const Parse = require("parse/node")
const express = require('express')
const fs = require('fs') 
require('dotenv').config()

const parseApi = new ParseServer({
    appId: process.env.PARSE_APP_ID,
    masterKey: process.env.PARSE_MASTER_KEY,
    serverUrl: process.env.PARSE_URL,
    filesAdapter: '@parse/s3-files-adapter'
})

Parse.initialize(process.env.PARSE_APP_ID, 
    process.env.PARSE_JAVASCRIPT_KEY, 
    process.env.PARSE_MASTER_KEY
)

const readFile = () => new Promise((resolve, reject) => {
    let fileInAText = ''
    fs.createReadStream('Free_Test_Data_2MB_MP3.mp3', {encoding: 'base64'})
    .on('data', (chunk) => {
        fileInAText += chunk
    })
    .on('end', () => {
        resolve(fileInAText)
    })
    .on('error', (error) => reject(error))
})

const app = express()
app.use(express.json())
app.use('/parse', parseApi)
app.get('/saveFile', async (req, res, next) => {
    try {
        const filetext = await readFile()
        const parseFile = new Parse.File('new_audio.mp3', {base64: filetext})
        const savedFile = await parseFile.save({useMasterKey: true})
        return savedFile.url
    } catch (error) {
        return error 
    }
})

app.listen(1337, () => {console.log('server running')})