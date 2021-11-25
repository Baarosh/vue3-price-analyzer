const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 5000

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, '/public/index.html'))
})

app.listen(port, () => {
    console.log(`Server is listening...PORT: ${port}`)
})
