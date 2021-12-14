const express = require('express')
const axios = require('axios')
const dayjs = require('dayjs')
const { JSDOM } = require('jsdom')
const { initializeApp  } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc, getDocs, Timestamp } = require('firebase/firestore');

// const path = __dirname + '/dist'

// const app = express()
// app.use(express.static(path))

// app.get('/', (request, response) => {
//     response.sendFile(path + "index.html")
// })

// const port = process.env.PORT || 5000

// app.listen(port, () => {
//     console.log(`Server is listening on PORT: ${port}...`)
// })

const firebaseConfig = {
    apiKey: "AIzaSyAdS65mP-qB1Qgi0xz83zCqeXj8zTlqJV8",
    authDomain: "vue3-price-analyzer.firebaseapp.com",
    projectId: "vue3-price-analyzer",
    storageBucket: "vue3-price-analyzer.appspot.com",
    messagingSenderId: "804126306004",
    appId: "1:804126306004:web:62ed488d6e7a29d2451541"
  };

initializeApp(firebaseConfig);
const db = getFirestore()

async function fetchSSDs(collectionName, containerClass, priceClass, numberOfPages) {

    for(let i = 1; i <= numberOfPages ; i+=1) {
        const url = `https://www.x-kom.pl/g-5/c/1779-dyski-ssd.html?page=${numberOfPages}&per_page=90&sort_by=rating_desc`;
        const {data: html} = await axios.get(url, {
            headers: {
                'accept': 'application/json, text/plain, */*',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
                'origin': 'https://www.x-kom.pl',
                'referer': 'https://www.x-kom.pl/'
            }
        });
        const dom = new JSDOM(html);

        const container = dom.window.document.querySelectorAll(containerClass);

        for (const c of container) {
            const productId =c.querySelector('a').getAttribute('href').slice(3,9);
            const productName = c.querySelector('h3').getAttribute('title');
            const productPrice = parseFloat(c.querySelector(priceClass).textContent)
            const timeStamp = dayjs().format()

            const productRef = doc(db, collectionName, productId)
            const productMeasuresRef = doc(db, `${collectionName}/${productId}/Measures`, timeStamp)

            await setDoc(productRef, {
                productId,
                productName,
            })

            await setDoc(productMeasuresRef, {
                timeStamp,
                productPrice
            })
        }
    }
}

async function runInterval() {
    const interval = setInterval(async () => {
        console.log('start interval func')
        await fetchSSDs('SSDs', '.sc-1yu46qn-4', '.sc-6n68ef-3',1).then(() => console.log('Done successfully')).catch(err=> clearInterval(interval))
        console.log('end interval func')
    },20000)
}

runInterval()