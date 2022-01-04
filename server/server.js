import initializeExpress from './express/ex.config'
import initializeNoIdle from './noidle'
import runService from './utilities'
import dayjs from 'dayjs'

initializeExpress()
initializeNoIdle()

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
const gapTime = 30 * 1000

const watchTime = 1 * 1000 * 60 * 20
let watchCounter = 1

runService('ssd', ssdURL, intervalTime, 0)
runService('gpu', gpuURL, intervalTime, gapTime)
runService('cpu', cpuURL, intervalTime, gapTime * 2)
runService('mobo', moboURL, intervalTime, gapTime * 3)
runService('case', caseURL, intervalTime, gapTime * 4)
runService('ram', ramURL, intervalTime, gapTime * 5)
runService('ps', psURL, intervalTime, gapTime * 6)
runService('cpufan', cpufanURL, intervalTime, gapTime * 7)
runService('fan', fanURL, intervalTime, gapTime * 8)
runService('monitor', monitorURL, intervalTime, gapTime * 9)
runService('mouse', mouseURL, intervalTime, gapTime * 10)
runService('keyboard', keyboardURL, intervalTime, gapTime * 11)

const watcher = setInterval(() => {
    const date1 = dayjs(intervalTime)
    const date2 = dayjs(intervalTime-(intervalTime-(watchTime * watchCounter)))
    const diff = date1.subtract(date2)
    console.log(`Estimated time left to next interval: ${diff.format('mm')} minutes, ${diff.format('ss')} seconds.`)
    watchCounter += 1
    if (watchCounter > 3) watchCounter = 1
}, watchTime)