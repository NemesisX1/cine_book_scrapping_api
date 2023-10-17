import { HTMLElement, parse } from 'node-html-parser';
import { exit } from 'process';
import puppeteer from 'puppeteer';

const baseUrl = 'https://www.canalolympia.com/';

const theatersUrl = 'theaters/';
const moviesUrl = 'movies/';

//// Scrappin of the theaters page

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.canalolympia.com/theaters/wologuede/');

    const elements = await page.$$('ul[data-date].theater-movies');

    const result: TheaterInfoEventModel[] = [];

    for (const element of elements) {

        const text = await page.evaluate(el => el.outerHTML, element);

        const root = parse((text as string));

        const rawDate = root.querySelector('ul')?.rawAttributes['data-date'] as string;


        root.childNodes.forEach((node) => {

            
            node.childNodes.forEach((element) => {
                const e = element as HTMLElement;
                
                if (e.classNames != 'is-empty') {
                    
                    const eventImg = e.querySelector('a > figure > img')?.rawAttributes.src ?? null;
                    const eventTitle = e.querySelector('a > h2')!.innerText;
                    const eventHour = e.querySelector('a > span')!.innerText.split(' ')[0];
                    const eventLanguage = e.querySelector('a > span > div > span')!.innerText;
                    const eventUrl = e.querySelector('a')?.rawAttributes.href ?? null;

                    result.push({
                        date: rawDate,
                        img: eventImg,
                        title: eventTitle,
                        hour: eventHour,
                        language: eventLanguage,
                        url: eventUrl,
                        slug: eventUrl?.split('/').filter((e) => e != '').pop()! ?? null,
                    })
                }
                    
            })
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
    img: string | null,
    url: string | null,
    slug: string | null,
}