const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const express = require('express')

const app = express()
const port = 3000
const client = new Client({
    authStrategy: new LocalAuth()
})

app.use(express.json())

app.post('/send', (req, res) => {
    const phoneNumber = req.body.phoneNumber
    if (!phoneNumber) {
        return res.send('phoneNumber required')
    }
    const message = req.body.message ?? 'Default Message!'

    const whatsapp = client.sendMessage(`${phoneNumber}@c.us`, message)

    res.send(whatsapp)
})

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr)
    qrcode.generate(qr, {
        small: true
    })
})

client.on('ready', () => {
    console.log('Client is ready')
})

client.on('message', (msg) => {
    if (msg.body == '!ping') {
        msg.reply('pong')
    }
})

client.initialize()
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// send message to specific user number, start the number with country code and end it with "@c.us"
// client.sendMessage('6285155001528@c.us', 'your message here')