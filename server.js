import express from 'express';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import runSSDs from './webscrapping/SSDs';
import runGPUs from './webscrapping/GPUs';
import runCPUs from './webscrapping/CPUs';
import runRAMs from './webscrapping/RAMs';
import runMOBOs from './webscrapping/MOBOs';
import runCASEs from './webscrapping/CASEs';
import startKeepAlive from './idlingPrevention'

const path = __dirname + '/dist'

const app = express()
app.use(express.static(path))

app.get('/', (request, response) => {
    response.sendFile(path + "index.html")
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server is listening on PORT: ${port}...`)
})

startKeepAlive()

initializeApp(firebaseConfig);

runSSDs(21600000)
runGPUs(21620000)
runCPUs(21640000)
runRAMs(21660000)
runMOBOs(21680000)
runCASEs(21700000)
