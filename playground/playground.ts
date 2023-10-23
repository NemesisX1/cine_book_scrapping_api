import { HTMLElement, parse } from 'node-html-parser';
import puppeteer from 'puppeteer';

(async () => {

    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    
    await page.goto('https://www.canalolympia.com');
   

    const result: {
        title: string,
        imageUrl: string,
        slug: string
    }[] = [];

    const htmlRoot = parse(await page.content());

    const aMovieList = htmlRoot.querySelectorAll('section.homepage-affiche > div.wrapper > div.homepage-affiche-list > a.homepage-affiche-list-movie');
    
    aMovieList.forEach((e) => {
        const url = e.rawAttributes.href;

        console.log(url);
        
        const title = e.querySelector('article > h1')?.textContent!;
        const imageUrl =  e.querySelector('article > figure > img')?.rawAttributes.src ?? null;

        result.push({
            title: title,
            imageUrl: imageUrl!,
            slug: ''
         //   slug: url.split('/').filter((e) => e != '').pop()!,
        })
    })

    await browser.close();

    await browser.close();

})();