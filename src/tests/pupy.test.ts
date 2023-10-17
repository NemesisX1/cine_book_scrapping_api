import { parse } from 'node-html-parser';
import puppeteer from 'puppeteer';

const baseUrl = 'https://www.canalolympia.com/';

const theatersUrl = 'theaters/';
const moviesUrl = 'movies/';

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.canalolympia.com/theaters/wologuede/');

    const elements = await page.$$('ul[data-date]');

    const result: TheaterInfoEventModel[] = [];


    for (const element of elements) {

        const text = await page.evaluate(el => el.outerHTML, element);

        const root = parse((text as string));

        const rawDate = root.querySelector('ul')?.rawAttributes['data-date'] as string;

        root.childNodes.forEach((e) => {
            
            if (e.parentNode.classNames != 'is-empty') {
                const eventImg = e.parentNode.querySelector('li > a > figure > img')!.rawAttributes.src;
                const eventTitle = e.parentNode.querySelector('li > a > h2')!.innerText;
                const eventHour = e.parentNode.querySelector('li > a > span')!.innerText.split(' ')[0];
                const eventLanguage = e.parentNode.querySelector('li > a > span > div > span')!.innerText;
                const eventUrl = e.parentNode.querySelector('li > a')!.rawAttributes.href;

                result.push({
                    date: rawDate,
                    img: eventImg,
                    title: eventTitle,
                    hour: eventHour,
                    language: eventLanguage,
                    url: eventUrl,
                    slug: eventUrl.split('/').filter((e) => e != '').pop()!,
                })
            }

        });
    }

    console.log(result);
    await browser.close();

})();

interface TheaterInfoEventModel {
    date: string,
    hour: string,
    language: string,
    title: string,
    img: string,
    url: string,
    slug: string,
}