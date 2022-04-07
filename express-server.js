const { BrowserWindow } = require('electron')
const express = require('express')
const app = express()

app.use(express.json())

app.post('/czml', (request, response) => {
    const [win] = BrowserWindow.getAllWindows()
    if (!win) return
    win.webContents.send('czml', request.body)
    response.json({ status: 'ok' })
})

app.use('/', express.static('./dist'))

app.listen(3001, () => console.log(`express server running on port 3001`))