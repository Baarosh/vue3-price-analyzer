import { get } from 'axios'
import { JSDOM } from 'jsdom'
import dayjs from 'dayjs'
import { initalizeMySQLConnection, uploadToMySQL } from './mysql/ms.functions'

async function runFetching(sourceUrl) {
    const results = []
    let currentPage = 1
    let numberOfPages = 0

    do {
        const url = sourceUrl.replace('XXXXXX', currentPage);

        const {data: html} = await get(url, {
            headers: {
                'accept': 'application/json, text/plain, */*',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
                'origin': 'https://www.x-kom.pl',
                'referer': 'https://www.x-kom.pl/'
            }
        });
        const dom = new JSDOM(html);

        if (numberOfPages === 0) numberOfPages = parseInt(dom.window.document.querySelector('.sc-11oikyw-2').textContent.split(' ')[1],10)

        const container = dom.window.document.querySelectorAll('.sc-1yu46qn-4');

        for (const c of container) {

            const productId = parseInt(c.querySelector('a').getAttribute('href').slice(3,9));
            const productName = c.querySelector('h3').getAttribute('title');
            let productPrice = null
            const timeStamp = dayjs().format("YYYY-MM-DD HH:mm:ss")

            try {
            productPrice = parseFloat(c.querySelector('.sc-6n68ef-3').textContent.split(',')[0].replace(/ /, ''))
            } catch(e) {
                console.log(e)
                productPrice = 0
                console.log('Error for line', productId, productName, productPrice, timeStamp, currentPage)
            }

            results.push([
                productId,
                productName,
                productPrice,
                timeStamp
            ])
        }
        currentPage+=1

        } while (currentPage <= numberOfPages)

    return results
}

async function runService(name, url, intervalTime, gapTime) {
    console.log(`${name} -> Service started.`)

    const timeout = setTimeout(async () => {

        const interval = setInterval(async () => {
            console.log(`${name} -> Interval started.`)

            console.log(`${name} -> Fetch started.`)
            const data = await runFetching(url)
            console.log(`${name} -> Fetch finished.`)

            console.log(`${name} -> Upload started.`)
            let connection = initalizeMySQLConnection()
            await uploadToMySQL(name, data, connection)
            connection.end()
            console.log(`${name} -> Upload finished.`)

            console.log(`${name} -> Interval finished.`)
        }, intervalTime)

        {
        console.log(`${name} -> Interval started.`)

        console.log(`${name} -> Fetch started.`)
        const data = await runFetching(url)
        console.log(`${name} -> Fetch finished.`)

        console.log(`${name} -> Upload started.`)
        let connection = initalizeMySQLConnection()
        await uploadToMySQL(name, data, connection)
        connection.end()
        console.log(`${name} -> Upload finished.`)

        console.log(`${name} -> Interval finished.`)
        }
    }, gapTime)
}

export default runService