const { Client, LocalAuth } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const express = require('express')
const jwt = require('jsonwebtoken')
const QRCode = require('qrcode')
require('dotenv').config()

const app = express()
const port = 3000
const client = new Client({
    authStrategy: new LocalAuth()
})

const jwtVerify = (req, res, next) => {
    const bearerToken = req.headers['authorization']
    if (typeof bearerToken == 'undefined') {
        // console.log('bearerToken undefined')
        return res.send('JWT required').status(401)
    }
    try {
        const splittingToken = bearerToken.split('Bearer ')
        const token = splittingToken[1]
        if (!token) {
            return res.send('JWT Invalid').status(401)
        }
        // console.log(token)
        jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        // console.log(error)
        return res.send('JWT Invalid').status(401)
    }

    next()
}

app.use(express.json())
app.use('/send', jwtVerify)

let whatsappQrCode = null
app.get('/login', (req, res) => {
    let qr = null
    QRCode.toDataURL(whatsappQrCode, (err, url) => {
        qr = url
    })
    res.send({
        message: 'qr',
        qr: whatsappQrCode
    })
})

app.post('/send', (req, res) => {
    const phoneNumber = req.body.phoneNumber
    if (!phoneNumber) {
        return res.send('phoneNumber required')
    }
    const message = req.body.message ?? 'Default Message!'

    const whatsapp = client.sendMessage(`${phoneNumber}@c.us`, message)

    res.send('Success')
})

client.on('qr', (qr) => {
    whatsappQrCode = qr
    // console.log('QR RECEIVED', whatsappQrCode)
    qrcode.generate(qr, {
        small: true
    })
})

// client.on('authenticated', () => {
//     whatsappQrCode = null
// })

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