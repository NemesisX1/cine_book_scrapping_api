import { getLogger } from "log4js";
import BaseService from "../abstracts/base.service";
import { HTMLElement, parse } from 'node-html-parser';
import theatersUrls from '../../../data/theaters.json'
import puppeteer from 'puppeteer';
import TheaterMovieModel from "../../models/theater-movie.model";
import TheaterMovieBriefModel from "../../models/theater-movie-brief.model";
import TheaterDiffusionInfoModel from "../../models/theater-movie-diffusion-info.model";
import TheaterInfosModel from "../../models/theater-info.model";

export default class ScrappingService implements BaseService {

    private logger = getLogger('ScrappingService');


    /**
     * getTheatersNames
     */
    // TODO: rewrite this one by fetching theaters list directly from  https://www.xml-sitemaps.com/download/www.canalolympia.com-52d54e4ae/sitemap.xml?view=1
    public theatersNames(): {name: string}[] {
        const names: {name: string}[] = [];

        for (const url of theatersUrls) {
            names.push({
                name: url.loc.split('/').filter((e) => e != '').pop()!,
            });
        }

        return names;

    }


    /**
     * getMoviesInfos
     * lang can be either fr or en
     */
    public async movies(theaterName: string, lang: string = 'fr'): Promise<TheaterMovieBriefModel[]> {

        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
        const page = await browser.newPage();

        try {

            await page.goto(
                lang == 'en'
                    ? `${infos.baseUrl}/en/${infos.theatersUrl}/${theaterName}-en`
                    : `${infos.baseUrl}/${infos.theatersUrl}/${theaterName}`);

        } catch (error) {

            this.logger.fatal('movies');
            this.logger.fatal((error as Error).message);

            throw Error((error as Error).message);

        }

        const elements = await page.$$('ul[data-date].theater-movies');

        const result: TheaterMovieBriefModel[] = [];


        /// TODO: reduce complexity by using in a more efficient way the html parser and its querySelector
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
    public async movieInfoBySlug(slug: string, lang: string = 'fr'): Promise<TheaterMovieModel | null> {

        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
        const page = await browser.newPage();

        const cleanSlug = slug.replace('-en', '');

        try {

            await page.goto(lang == 'en'
                ? `${infos.baseUrl}/en/${infos.moviesUrl}/${cleanSlug}-en`
                : `${infos.baseUrl}/${infos.moviesUrl}/${cleanSlug}`);

        } catch (error) {

            this.logger.fatal('movieInfoBySlug');
            this.logger.fatal(error);

            throw Error((error as Error).message);

        }


        const htmlRoot = parse(await page.content());

        const title = htmlRoot.querySelector('div.movie-top-container-cover-content > h1')?.textContent;

        if (!title) return null;

        const genre = htmlRoot.querySelector('div.movie-top-container-cover-content > p.genres > span')?.textContent.split(':').pop()?.trim();
        const date = htmlRoot.querySelector('div.movie-top-container-cover-content > p > span.date')?.textContent.split(':').pop()?.trim();
        const duration = htmlRoot.querySelector('div.movie-top-container-cover-content > p > span.time')?.textContent.split(':').pop()?.trim();

        const brief = htmlRoot.querySelector('div.synopse-modal > p')?.textContent;
        const trailerUrl = htmlRoot.querySelector('div.wrapper > div.movie > iframe')?.rawAttributes.src;

    
        const TheaterMovie: TheaterMovieModel = {
            title: title!,
            genre: genre!,
            duration: duration!,
            releaseDate: date!,
            descriptionBrief: brief!,
            trailerLink: trailerUrl!,
        };

        await browser.close();

        return TheaterMovie;
    }


    /**
     * getMovieDiffusionInfos
     * lang can be either fr or en
    */
    public async movieDiffusionInfos(slug: string, lang: string = 'fr', theaterName?: string): Promise<TheaterDiffusionInfoModel[]> {

        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
        const page = await browser.newPage();

        const cleanSlug = slug.replace('-en', '');

        try {

            await page.goto(lang == 'en'
                ? `${infos.baseUrl}/en/${infos.moviesUrl}/${cleanSlug}-en`
                : `${infos.baseUrl}/${infos.moviesUrl}/${cleanSlug}`);

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

            if (e.localName === 'div' && (theaterName ? e.rawAttributes['data-name'] == theaterName : true)) {

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


    /**
     * theaterInfos
     * lang can be either fr or en
     */
    public async theaterInfos(theaterName: string, lang: string = 'fr'): Promise<TheaterInfosModel> {

        const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
        const page = await browser.newPage();

        const cleanedTheaterName = theaterName.replace('-en', '');

        try {

            await page.goto(lang == 'en'
                ? `${infos.baseUrl}/en/${infos.theatersUrl}/${cleanedTheaterName}-en`
                : `${infos.baseUrl}/${infos.theatersUrl}/${cleanedTheaterName}`);

        } catch (error) {

            this.logger.fatal('theaterInfos');
            this.logger.fatal(error);

            throw Error((error as Error).message);

        }


        const htmlRoot = parse(await page.content());

        const name = htmlRoot.querySelector('div.theater-top-container-cover-content > h1')?.textContent;
        const location = htmlRoot.querySelector('div.theater-top-container-cover-content > a')?.textContent;
        const locationUrl = htmlRoot.querySelector('div.theater-top-container-cover-content > a')?.rawAttributes.href;

        const pricingLi = htmlRoot.querySelectorAll('section.slider-and-pricing > div.wrapper > div.pricing > ul.prices-table > li');
        const pricing: {
            people: string,
            price: string,
        }[] = [];

        pricingLi.forEach((e) => {
            pricing.push({
                people: e.querySelector('span.price-name')?.textContent?.replaceAll('*', '')!,
                price: e.querySelector('span.price-value')?.textContent!
            });
        });

        const mediaLi = htmlRoot.querySelectorAll('div.theater-top-container-cover-content > div.info-section-rs > a');
        const media: {
            title: string,
            link: string,
        }[] = [];
 

        mediaLi.forEach((e) => {
            media.push({
                title: e.rawAttributes.href,
                link: e.querySelector('img')?.rawAttributes.alt!
            });
        });


        const theaterInfos: TheaterInfosModel = {
            name: name!,
            lang: lang,
            location: location!,
            locationUrl: locationUrl!,
            pricing: pricing,
            media: media,
        };

        await browser.close();

        return theaterInfos;
    }


}


const infos = {
    baseUrl: 'https://www.canalolympia.com',
    theatersUrl: 'theaters',
    moviesUrl: 'movies',
    baseLang: 'fr'
}