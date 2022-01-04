import express from 'express';
import path from 'path';

function initializeExpress() {

    const pathDist = path.join(__dirname + '../../../dist')
    const port = process.env.PORT || 5000
    const app = express()

    app.use(express.static(pathDist))

    app.get('/', (_request, response) => {
        response.sendFile(path.join(pathDist + "/index.html"))
    })

    app.listen(port, () => {
        console.log(`Server is listening on PORT: ${port}...`)
    })
}

export default initializeExpress