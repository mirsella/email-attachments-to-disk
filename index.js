// 1a19a8146c6e99409c66@cloudmailin.net
const express = require("express")
const bodyParser = require("body-parser")
const fs = require('fs')
const app = express()

app.use(bodyParser.json({limit: '512kb'}))

app.post("/cloudmailin_incoming", (req, res) => {
  let mail = req.body
  console.log(mail)

  let attachments = mail.attachments
  if (attachments.length === 1) {
    let data = Buffer.from(attachments[0].content, 'base64')
    fs.writeFileSync(attachments[0].file_name, data)
    res.status(200).json({ status: "wrote one file" + attachments[0].file_name })
  } else if (attachments.length > 1 ) {
    for (attachment of attachments) {
      let data = Buffer.from(attachments[attachment].content, 'base64')
      fs.writeFileSync(attachment.file_name, data)
      res.status(200).json({ status: "wrote multiples file" + attachments[0].file_name })
    }
  } else {
    res.status(200).json({ status: "OK, no attachment" })
  }
})

app.listen(8888, () => {
  console.log("server started on :8888")
})
