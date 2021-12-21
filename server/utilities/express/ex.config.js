import express from 'express';

function initializeExpress() {
    const path = __dirname + '/dist'
    const port = process.env.PORT || 5000
    const app = express()

    app.use(express.static(path))

    app.get('/', (request, response) => {
        response.sendFile(path + "index.html")
    })

    app.listen(port, () => {
        console.log(`Server is listening on PORT: ${port}...`)
    })
}

export default initializeExpress