import { HTMLElement, parse } from 'node-html-parser';
import puppeteer from 'puppeteer';

(async () => {

    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();



    await page.goto('https://www.canalolympia.com/movies/banel-adama/');

    const htmlRoot = parse(await page.content());

    const sessionsInfos = htmlRoot.querySelector('div.sessions');


    sessionsInfos?.childNodes.forEach((element) => {

        const e = element as HTMLElement;

        if (e.localName === 'div') {

            const theaterName = e.rawAttributes['data-name'];
            //  const 
            const liList = e.querySelectorAll('li');

            const dates: {
                weekDay: string,
                weekNumber: string,
                hours: string[],
            }[] = [];

            liList.forEach((li) => {

                if (li.rawAttributes.class) {

                    const weekNumber = li.rawAttributes['data-day'];
                    const weekDay = li.querySelector('span.week-day')?.innerText!;
                    const dataHours: string[] = [];

                    e.querySelectorAll(`ul[data-day=${weekNumber}] > li`).forEach((e) => {
                        dataHours.push(e.innerText)
                    });

                    dates.push({
                        weekDay: weekDay, weekNumber: weekNumber, hours: dataHours,
                    })
                }
            })

    
            console.log({
                theater: theaterName,
                dates: dates,
            });
            
        }
    })

    await browser.close();

})();