const puppeteer = require('puppeteer');
const fs = require('fs');

const URL = 'http://www.calorizator.ru/analyzer/recipe';
const result = [];
const example = '200 г твердого сыра, 200 г колбасы, двести гр. маринованных огурцов, два зубчика чеснока, 1/3 ч.л. петрушки, четверть чайной ложки укропа, 150 г майонеза.';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL);
    await page.type('textarea.form-textarea', example);
    await Promise.all([
        page.waitForNavigation(),
        page.click('input#edit-button'),
    ]);

    const common = await page.$eval('td#ar_k0', el => el.textContent);

    result.push({
        common,
    });

    fs.writeFileSync('./data.json', JSON.stringify(result, null, 4));

    await browser.close();
})();
