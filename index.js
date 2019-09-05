const puppeteer = require('puppeteer');
const fs = require('fs');

const URL = 'http://www.calorizator.ru/analyzer/recipe';
const ingredients = Object.entries(JSON.parse(fs.readFileSync('./ingredients.json')));

(async () => {
    const browser = await puppeteer.launch();
    const result = {};

    await Promise.all(ingredients.map(async (ingredient) => {
        const page = await browser.newPage();
        await page.goto(URL);

        await page.type('textarea.form-textarea', ingredient[1]);

        await Promise.all([
            page.waitForNavigation(),
            page.click('input#edit-button'),
        ]);

        result[ingredient[0]] = await page.$eval('table#ar_tabl', el => el.innerHTML);
    }));

    fs.writeFileSync('./calories.json', JSON.stringify(result, null, 4));

    await browser.close();
})();
