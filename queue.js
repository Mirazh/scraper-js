const puppeteer = require('puppeteer');
const fs = require('fs');

const URL = 'http://www.calorizator.ru/analyzer/recipe';
const ingredients = Object.entries(JSON.parse(fs.readFileSync('./ingredients.json')));
const result = {};

function* getCalories(page) {
    let count = 0;

    while (count < ingredients.length) {
        yield (async () => {
            console.log('count', count);

            await page.type('textarea.form-textarea', ingredients[count][1]);

            await Promise.all([
                page.waitForNavigation(),
                page.click('input#edit-button'),
            ]);

            await page.$eval('textarea.form-textarea', el => el.value = '');
            await page.waitFor(300);

            result[ingredients[count][0]] = await page.$eval('table#ar_tabl', el => el.innerHTML);

            count++;
        })()
    }
}

(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(URL);

        for await (let asd of getCalories(page)) {}

        await browser.close();
    } finally {
        fs.writeFileSync('./calories.json', JSON.stringify(result, null, 4));
    }
})();
