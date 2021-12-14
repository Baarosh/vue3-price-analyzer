const express = require('express')
const axios = require('axios')
const dayjs = require('dayjs')
const { JSDOM } = require('jsdom')
const { initializeApp  } = require('firebase/app');
const { getFirestore, doc, setDoc, writeBatch, collection, addDoc,  getDocs, Timestamp } = require('firebase/firestore');

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

async function fetchSSDs(collectionName, containerClass, priceClass) {
    const batch = writeBatch(db)

    let page = 1
    let numberOfPages = 1

    do {
        const url = `https://www.x-kom.pl/g-5/c/1779-dyski-ssd.html?page=${page}&per_page=60&sort_by=rating_desc`;
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
        numberOfPages = parseInt(dom.window.document.querySelector('.sc-11oikyw-2').textContent.split(' ')[1],10)
        if (numberOfPages > 4) numberOfPages = 4

        for (const c of container) {
            const productId =c.querySelector('a').getAttribute('href').slice(3,9);
            const productName = c.querySelector('h3').getAttribute('title');
            const productPrice = parseFloat(c.querySelector(priceClass).textContent.split(',')[0].replace(/ /, ''))
            const timeStamp = dayjs().format()

            const productRef = doc(db, collectionName, productId)
            const productMeasuresRef = doc(db, `${collectionName}/${productId}/Measures`, timeStamp)

            batch.set(productRef, {
                productId,
                productName,
            })

            batch.set(productMeasuresRef, {
                timeStamp,
                productPrice
            })
            console.log(productId, productName, productPrice, timeStamp)
        }
        page+=1
    } while (page <= numberOfPages)

    console.log(numberOfPages)
    await batch.commit();
}

async function runSSDs(time) {
    const interval = setInterval(async () => {
        console.log('SSDs Interval is starting...')
        await fetchSSDs('SSDs', '.sc-1yu46qn-4', '.sc-6n68ef-3').then(() => console.log('Fetch is completed.')).catch(err=> {
            clearInterval(interval)
            console.log(err)
        })
        console.log('SSDs Interval is ending...')
    },time)
}

// runSSDs(40000)
