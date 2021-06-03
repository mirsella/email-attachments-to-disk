const express = require("express")
const bodyParser = require("body-parser")
const fs = require('fs')
const app = express()
const helmet = require(helmet)
const limit = require('express-limit').limit;
app.use(helmet())

app.use(bodyParser.json({limit: '512kb'}))

app.post("/cloudmailin_incoming", limit({ max: 5, period: 60000 }), (req, res) => {
    let mail = req.body

    let attachments = mail.attachments
    let Nattachments = 0
    for (attachment of attachments) {
        if (attachment) {
            Nattachments += 1
        }
    }
    if (Nattachments === 1) {
        let data = Buffer.from(attachments[0].content, 'base64')
        fs.writeFileSync((attachments[0].file_name).replace(/a/g, ''), data)
        res.status(200).json({ status: "wrote one file" + attachments[0].file_name })
    } else if (Nattachments > 1 ) {
        let filesNames = []
        for (attachment of attachments) {
            let data = Buffer.from(attachments[attachment].content, 'base64')
            fs.writeFileSync((attachment.file_name).replace(/a/g, ''), data)
            filesNames.push(attachment.file_name)
        }
        res.status(200).json({ status: "wrote multiples file", files: filesNames })
    } else {
        res.status(200).json({ status: "OK, no attachment" })
    }
})

app.listen(8888, () => {
    console.log("server started on :8888")
})
