const fs = require('fs') 
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

Parse.Cloud.define('saveFile', async (request) => {
    const filetext = await readFile()
    const parseFile = new Parse.File('new_audio.mp3', {base64: filetext})
    //const parseFile = new Parse.File('audios/new_audio.mp3', {base64: filetext}) 
    // returns an error 
    //const parseFile = new Parse.File('/audios/new_audio.mp3', {base64: filetext}) 
    // ignores the path set 
    //parseFile.addMetadata('Delimiter', '/audios/')
    //parseFile.addMetadata('path', '/audios/')
    return parseFile.save({useMasterKey: true})
})