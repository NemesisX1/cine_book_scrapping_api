import { getLogger } from "log4js";
import BaseService from "../abstracts/base.service";
import { HTMLElement, parse } from 'node-html-parser';
import theatersUrls from '../../../data/theaters.json'
import puppeteer from 'puppeteer';
import TheaterEventModel from "@/models/theater-event.model";
import TheaterEventBriefModel from "@/models/theater-event-brief.model";
import TheaterDiffusionInfoModel from "@/models/theater-diffusion-info.model";

export default class ScrappingService implements BaseService {

    private logger = getLogger('ScrappingService');


    /**
     * getTheatersNames
     */
    /// TODO: rewrite this one by fetching theaters list directly from  https://www.xml-sitemaps.com/download/www.canalolympia.com-52d54e4ae/sitemap.xml?view=1
    public theatersNames(): string[] {
        const names: string[] = [];

        for (const url of theatersUrls) {
            names.push(url.loc.split('/').filter((e) => e != '').pop()!);
        }

        return names;

    }


    /**
     * getMoviesInfos
     * lang can be either fr or en
     */
    public async movies(theaterName: string, lang: string = 'fr'): Promise<TheaterEventBriefModel[]> {

        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {

            await page.goto(lang == 'en' ? `${infos.baseUrl}/en/${infos.theatersUrl}/${theaterName}-en` : `${infos.baseUrl}/${infos.theatersUrl}/${theaterName}`);

        } catch (error) {

            this.logger.fatal('movies');
            this.logger.fatal((error as Error).message);

            throw Error((error as Error).message);

        }

        const elements = await page.$$('ul[data-date].theater-movies');

        const result: TheaterEventBriefModel[] = [];

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

        await browser.close();

        return result;
    }


    /**
     * getMovieInfoBySlug
     * lang can be either fr or en
     */
    public async movieInfoBySlug(slug: string, lang: string = 'fr'): Promise<TheaterEventModel> {

        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        const cleanSlug = slug.replace('-en', '');

        try {

            await page.goto(lang == 'en' ? `${infos.baseUrl}/en/${infos.moviesUrl}/${cleanSlug}-en` : `${infos.baseUrl}/${infos.moviesUrl}/${cleanSlug}`);

        } catch (error) {

            this.logger.fatal('movieInfoBySlug');
            this.logger.fatal(error);

            throw Error((error as Error).message);

        }


        const htmlRoot = parse(await page.content());

        const title = htmlRoot.querySelector('div.movie-top-container-cover-content > h1')?.textContent;
        const genre = htmlRoot.querySelector('div.movie-top-container-cover-content > p.genres > span')?.textContent.split(':').pop()?.trim();
        const date = htmlRoot.querySelector('div.movie-top-container-cover-content > p > span.date')?.textContent.split(':').pop()?.trim();
        const duration = htmlRoot.querySelector('div.movie-top-container-cover-content > p > span.time')?.textContent.split(':').pop()?.trim();

        /// TODO: find a way to get the remaining text
        const brief = htmlRoot.querySelector('div.movie-top-container-content-wrapper > p')?.textContent;
        const trailerUrl = htmlRoot.querySelector('div.wrapper > div.movie > iframe')?.rawAttributes.src;

        const theaterEvent: TheaterEventModel = {
            title: title!,
            genre: genre!,
            duration: duration!,
            releaseDate: date!,
            descriptionBrief: brief!,
            trailerLink: trailerUrl!,
        };

        await browser.close();

        return theaterEvent;
    }


    /**
     * getMovieDiffusionInfos
     * lang can be either fr or en
    */
    public async movieDiffusionInfos(slug: string, lang: string = 'fr'): Promise<TheaterDiffusionInfoModel[]> {

        const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        const page = await browser.newPage();

        const cleanSlug = slug.replace('-en', '');

        try {

            await page.goto(lang == 'en' ? `${infos.baseUrl}/en/${infos.moviesUrl}/${cleanSlug}-en` : `${infos.baseUrl}/${infos.moviesUrl}/${cleanSlug}`);

        } catch (error) {

            this.logger.fatal('movieDiffusionInfos');
            this.logger.fatal((error as Error).message);

            throw Error((error as Error).message);
        }

        const htmlRoot = parse(await page.content());

        const sessionsInfos = htmlRoot.querySelector('div.sessions');

        const diffusionInfos: TheaterDiffusionInfoModel[] = [];

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

                diffusionInfos.push({
                    theater: theaterName,
                    dates: dates,
                })
            }
        })

        await browser.close();

        return diffusionInfos;
    }

}


const infos = {
    baseUrl: 'https://www.canalolympia.com',
    theatersUrl: 'theaters',
    moviesUrl: 'movies',
    baseLang: 'fr'
}