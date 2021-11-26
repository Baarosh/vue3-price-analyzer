const express = require('express')
const moment = require('moment')
const { initializeApp  } = require('firebase/app');
const { getFirestore, collection, getDocs} = require('firebase/firestore');

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

const firebaseConfig = {
    apiKey: "AIzaSyAdS65mP-qB1Qgi0xz83zCqeXj8zTlqJV8",
    authDomain: "vue3-price-analyzer.firebaseapp.com",
    projectId: "vue3-price-analyzer",
    storageBucket: "vue3-price-analyzer.appspot.com",
    messagingSenderId: "804126306004",
    appId: "1:804126306004:web:62ed488d6e7a29d2451541"
  };

initializeApp(firebaseConfig);
const database = getFirestore()

const dbSSDs = collection(database, 'SSDs')

getDocs(dbSSDs).then((snapshot) => {
    let books = []
    snapshot.docs.forEach(doc => books.push({docId: doc.id, ...doc.data()}))
    console.log(books)
}).catch(err => {
    console.log(err)
})