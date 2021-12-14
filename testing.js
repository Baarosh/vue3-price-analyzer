const axios = require('axios')
const { JSDOM } = require('jsdom')
const dayjs = require('dayjs')

async function fetchSSDs(containerClass, priceClass, numberOfPages) {
    const document = []

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

        container.forEach(c => {
            const productId = c.querySelector('a').getAttribute('href').slice(3,9);
            const productName = c.querySelector('h3').getAttribute('title');
            const productPrice = parseFloat(c.querySelector(priceClass).textContent)
            const timeStamp = dayjs().format()

            document.push({
                timeStamp,
                productId,
                productName,
                productPrice
            })
        })
    }
}

fetchSSDs('.sc-1yu46qn-4', '.sc-6n68ef-3',1)