import initializeExpress from './server/utilities/express/ex.config'
import initializeNoIdle from './server/noidle'
import { initalizeFirebaseConnection, uploadToFirebase } from './server/utilities/firebase/fb.functions'
import { initalizeMySQLConnection, uploadToMySQL } from './server/utilities/mysql/ms.functions'
import { get } from 'axios'
import { JSDOM } from 'jsdom'
import dayjs from 'dayjs'

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
            const timeStamp = dayjs().format("YYYY-MM-DD hh:mm:ss")

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

            console.log(productId, productName, productPrice, timeStamp, currentPage)
        }
        currentPage+=1

        } while (currentPage <= numberOfPages)

    return results
}

async function runService(name, FBName, MSName, MSconnection, url, time) {
    console.log(`${name}-> Service started.`)

    const timeout = setTimeout(async () => {
        console.log(`${name}-> Starting interval...`)

        try {
            const data = await runFetching(url)
            console.log(`${name}-> Fetch OK`)

            // try {
            //     await uploadToFirebase(FBName, data)
            //     console.log(`${name}-> FB Upload OK`)
            // }
            // catch(e) {
            //     console.log(e)
            // }
            try {
                await uploadToMySQL(MSName, data, MSconnection)
                console.log(`${name}-> MS Upload OK`)
            }
            catch(e) {
                console.log(e)
            }
        }
        catch(e) {
            console.log(e)
        }
        finally {
            console.log(`${name}-> Finishing interval...`)
        }
    }, time - intervalTime)

    const interval = setInterval(async () => {
        console.log(`${name}-> Starting interval...`)

        try {
            const data = await runFetching(url)
            console.log(`${name}-> Fetch OK`)
            // try {
            //     await uploadToFirebase(FBName, data)
            //     console.log(`${name}-> FB Upload OK`)
            // }
            // catch(e) {
            //     console.log(e)
            // }
            try {
                await uploadToMySQL(MSName, data, MSconnection)
                console.log(`${name}-> MS Upload OK`)
            }
            catch(e) {
                console.log(e)
            }
        }
        catch(e) {
            console.log(e)
        }
        finally {
            console.log(`${name}-> Finishing interval...`)
        }
    }, time)
}

initializeExpress()
initializeNoIdle()

// initalizeFirebaseConnection()
const MSconnection = initalizeMySQLConnection()

const ssdURL = 'https://www.x-kom.pl/g-5/c/1779-dyski-ssd.html?page=XXXXXX&per_page=90&sort_by=rating_desc'
const gpuURL = 'https://www.x-kom.pl/g-5/c/345-karty-graficzne.html?page=XXXXXX&per_page=90&sort_by=rating_desc'
const cpuURL = 'https://www.x-kom.pl/g-5/c/11-procesory.html?page=XXXXXX&per_page=90&sort_by=rating_desc'
const moboURL = 'https://www.x-kom.pl/g-5/c/14-plyty-glowne.html?page=XXXXXX&per_page=90&sort_by=rating_desc'
const caseURL = 'https://www.x-kom.pl/g-5/c/388-obudowy-komputerowe.html?page=XXXXXX&per_page=90&sort_by=rating_desc'
const ramURL = 'https://www.x-kom.pl/g-5/c/28-pamieci-ram.html?page=XXXXXX&per_page=90&sort_by=rating_desc'
const psURL = 'https://www.x-kom.pl/g-5/c/158-zasilacze-do-komputera.html?page=XXXXXX&per_page=90&sort_by=rating_desc'
const cpufanURL = 'https://www.x-kom.pl/g-5/c/105-chlodzenia-procesorow.html?page=XXXXXX&per_page=90&sort_by=rating_desc'
const fanURL = 'https://www.x-kom.pl/g-5/c/1632-wentylatory-do-komputera.html?page=XXXXXX&per_page=90&sort_by=rating_desc'
const monitorURL = 'https://www.x-kom.pl/g-6/c/15-monitory.html?page=XXXXXX&per_page=90&sort_by=rating_desc'
const mouseURL = 'https://www.x-kom.pl/g-6/c/31-myszki.html?page=XXXXXX&per_page=90&sort_by=rating_desc'
const keyboardURL = 'https://www.x-kom.pl/g-6/c/32-klawiatury.html?page=XXXXXX&per_page=90&sort_by=rating_desc'

const intervalTime = 1 * 1000 * 60 * 60 * 1
const gap = 15 * 1000
const timeWatch = 1 * 1000 * 60 * 10
let watchCounter = 1

runService('SSDs', 'SSDs', 'ssd', MSconnection, ssdURL, intervalTime)
runService('GPUs', 'GPUs', 'gpu', MSconnection, gpuURL, intervalTime + gap)
runService('CPUs', 'CPUs', 'cpu', MSconnection, cpuURL, intervalTime + gap * 2)
runService('MOBOs', 'MOBOs', 'mobo', MSconnection, moboURL, intervalTime + gap * 3)
runService('CASEs', 'CASEs', 'case', MSconnection, caseURL, intervalTime + gap * 4)
runService('RAMs', 'RAMs', 'ram', MSconnection, ramURL, intervalTime + gap * 5)
runService('PSs', 'PSs', 'ps', MSconnection, psURL, intervalTime + gap * 6)
runService('CPUFANs', 'CPUFANs', 'cpufan', MSconnection, cpufanURL, intervalTime + gap * 7)
runService('FANs', 'FANs', 'fan', MSconnection, fanURL, intervalTime + gap * 8)
runService('MONITORs', 'MONITORs', 'monitor', MSconnection, monitorURL, intervalTime + gap * 9)
runService('MOUSEs', 'MOUSEs', 'mouse', MSconnection, mouseURL, intervalTime + gap * 10)
runService('KEYBOARDs', 'KEYBOARDs', 'keyboard', MSconnection, keyboardURL, intervalTime + gap * 11)

const watcher = setInterval(() => {
    console.log(`Estimated time left to next interval: ${intervalTime-(timeWatch * watchCounter)}`)
    watchCounter += 1
    if (watchCounter > 6) watchCounter = 1
}, timeWatch)