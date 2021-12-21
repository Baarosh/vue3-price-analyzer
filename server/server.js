import initializeExpress from './utilities/express/ex.config'
import initializeNoIdle from './noidle'
import { initalizeFirebaseConnection, uploadToFirebase } from './utilities/firebase/fb.functions'
import { initalizeMySQLConnection, uploadToMySQL } from './utilities/mysql/ms.functions'
import { get } from 'axios'
import { JSDOM } from 'JSDOM'
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
            const timeStamp = dayjs().format()

            try {
            productPrice = parseFloat(c.querySelector('.sc-6n68ef-3').textContent.split(',')[0].replace(/ /, ''))
            } catch(e) {
                console.log(e)
                productPrice = 0
                console.log(productId, productName, productPrice, timeStamp, currentPage)
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

            try {
                // await uploadToFirebase(FBName, data)
                // console.log(`${name}-> FB Upload OK`)
            }
            catch(e) {
                console.log(e)
            }
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
    }, time - (1 * 1000 * 60 * 60 * 3))

    const interval = setInterval(async () => {
        console.log(`${name}-> Starting interval...`)

        try {
            const data = await runFetching(url)
            console.log(`${name}-> Fetch OK`)
            try {
                // await uploadToFirebase(FBName, data)
                // console.log(`${name}-> FB Upload OK`)
            }
            catch(e) {
                console.log(e)
            }
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

    const watcher = setInterval(() => console.log('watching...'), 1000*30)
}

initializeExpress()
initializeNoIdle()

initalizeFirebaseConnection()
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

runService('SSDs', 'SSDs', 'ssd', MSconnection, ssdURL, 1 * 1000 * 60 * 60 * 3)
runService('GPUs', 'GPUs', 'gpu', MSconnection, gpuURL, 1 * 1000 * 60 * 60 * 3)
runService('CPUs', 'CPUs', 'cpu', MSconnection, cpuURL, 1 * 1000 * 61 * 60 * 3)
runService('MOBOs', 'MOBOs', 'mobo', MSconnection, moboURL, 1 * 1000 * 61 * 60 * 3)
runService('CASEs', 'CASEs', 'case', MSconnection, caseURL, 1 * 1000 * 62 * 60 * 3)
runService('RAMs', 'RAMs', 'ram', MSconnection, ramURL, 1 * 1000 * 62 * 60 * 3)
runService('PSs', 'PSs', 'ps', MSconnection, psURL, 1 * 1000 * 63 * 60 * 3)
runService('CPUFANs', 'CPUFANs', 'cpufan', MSconnection, cpufanURL, 1 * 1000 * 63 * 60 * 3)
runService('FANs', 'FANs', 'fan', MSconnection, fanURL, 1 * 1000 * 64 * 60 * 3)
runService('MONITORs', 'MONITORs', 'monitor', MSconnection, monitorURL, 1 * 1000 * 64 * 60 * 3)
runService('MOUSEs', 'MOUSEs', 'mouse', MSconnection, mouseURL, 1 * 1000 * 65 * 60 * 3)
runService('KEYBOARDs', 'KEYBOARDs', 'keyboard', MSconnection, keyboardURL, 1 * 1000 * 65 * 60 * 3)
