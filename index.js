const { Client } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

const client = new Client()

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
    console.log(msg)
    msg.reply('Sending test message to +6285155001528')
    client.sendMessage('6285155001528@c.us', 'test')
})

client.initialize()

// send message to specific user number, start the number with country code and end it with "@c.us"
// client.sendMessage('6285155001528@c.us', 'your message here')