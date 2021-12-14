import { get } from 'axios';
import dayjs from 'dayjs';
import { JSDOM } from 'jsdom';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';

async function fetchCPUs(collectionName, containerClass, priceClass) {
    const db = getFirestore()
    const batch = writeBatch(db)

    let page = 1
    let numberOfPages = 1

    do {
        const url = `https://www.x-kom.pl/g-5/c/11-procesory.html?page=${page}&sort_by=rating_desc`;
        const {data: html} = await get(url, {
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
        }
        page+=1
    } while (page <= numberOfPages)

    await batch.commit();
}

async function runCPUs(time) {
    console.log('Starting runCPUs...')
    const interval = setInterval(async () => {
        console.log('CPUs interval has been started...')
        await fetchCPUs('CPUs', '.sc-1yu46qn-4', '.sc-6n68ef-3').then(() => console.log('CPUs fetch is completed.')).catch(err=> {
            clearInterval(interval)
            console.log(err)
        })
        console.log('CPUs interval has been finished...')
    },time)
}

export default runCPUs