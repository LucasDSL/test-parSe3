const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const REGION = "sa-east-1"; 
const s3Client = new S3Client({ 
    region: REGION,  
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY, 
        secretAccessKey: process.env.S3_SECRET_KEY,
    }});
const fs = require('fs') 

const readFile = () => new Promise((resolve, reject) => {
    let fileInAText = ''
    fs.createReadStream('Free_Test_Data_2MB_MP3.mp3', {encoding: 'utf-8'})
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
    //const parseFile = new Parse.File('new_audio.mp3', {base64: filetext})
    const parseFile = new Parse.File('audios/new_audio.mp3', {base64: filetext}) 
    // returns an error 
    //const parseFile = new Parse.File('/audios/new_audio.mp3', {base64: filetext}) 
    // ignores the path set 
    //parseFile.addMetadata('Delimiter', '/audios/')
    //parseFile.addMetadata('path', '/audios/')
    return parseFile.save({useMasterKey: true})
})

Parse.Cloud.define('saveFileUsingAWSSdk', async (request) => {
    const filetext = await readFile()
    
    const fileName = `parse_testing/audios/${Date.now()}-fileName`
    let uploadParams = {
        Key: fileName, 
        Bucket: 'testing-subfolders-s3',
        Body: filetext
    }
    const command = new PutObjectCommand(uploadParams)
    return s3Client.send(command)
})

Parse.Cloud.define('getFileUsingAWSSDK', async (request) => { 
    try {
        const streamToString = (stream) => 
        new Promise((resolve, reject) => {
            const chunks = [];
            stream.on("data", (chunk) => chunks.push(chunk));
            stream.on("error", reject);
            stream.on("end", () => resolve(Buffer.concat(chunks).toString('utf-8')));  
        })

        const filePath = 'parse_testing/audios/1665062172235-fileName'
        let getParams = {
            Key: filePath, 
            Bucket: 'testing-subfolders-s3'
        }
        const command = new GetObjectCommand(getParams)
        const data = await s3Client.send(command)
        const bodyContent = await streamToString(data.Body)
        console.log(bodyContent)
        return bodyContent
    } catch(error) {
        console.log('Error: ', error)
    }
})