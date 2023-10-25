import { getLogger } from "log4js";
import BaseService from "../abstracts/base.service";
import { HTMLElement, parse } from 'node-html-parser';
import puppeteer from 'puppeteer';
import TheaterMovieModel from "../../models/theater-movie.model";
import TheaterMovieBriefModel from "../../models/theater-movie-brief.model";
import TheaterDiffusionInfoModel from "../../models/theater-movie-diffusion-info.model";
import TheaterInfosModel from "../../models/theater-info.model";
import TheaterNameModel from "@/models/theater-name.model";
import axios, { AxiosError, AxiosResponse } from "axios";
import * as cheerio from 'cheerio';

export default class ScrappingService implements BaseService {

    private logger = getLogger('ScrappingService');


    /**
     * availableMovies
     * lang can be either fr or en
     */
    public async availableMovies(lang: string = 'fr'): Promise<TheaterMovieBriefModel[]> {

        let response: AxiosResponse;

        try {

            response = await axios.get(lang == 'en' ? `${infos.baseUrl}/en` : `${infos.baseUrl}`);

        } catch (error) {

            const e = error as AxiosError;

            this.logger.fatal('availableMovies');
            this.logger.fatal(e.message);

            if (e.response?.status == 404)
                return [];
            else
                throw Error(e.message);
        }

        const result: TheaterMovieBriefModel[] = [];

        const htmlRoot = parse(response.data);

        const aMovieList = htmlRoot.querySelectorAll('section.homepage-affiche > div.wrapper > div.homepage-affiche-list > a.homepage-affiche-list-movie');

        aMovieList.forEach((e) => {
            if (e.rawAttributes.href) {
                const url = e.rawAttributes.href;

                const title = e.querySelector('article > h1')?.textContent!;
                const imageUrl = e.querySelector('article > figure > img')?.rawAttributes.src ?? null;

                result.push({
                    title: title,
                    img: imageUrl!,
                    url: url,
                    slug: url.split('/').filter(e => e != '').pop()!,
                })
            }
        })


        return result;
    }

    /**
     * getTheatersNames
     */
    // TODO: rewrite this one by fetching theaters list directly from  https://www.xml-sitemaps.com/download/www.canalolympia.com-52d54e4ae/sitemap.xml?view=1
    public async theatersNames(): Promise<TheaterNameModel[]> {
        const theaters: TheaterNameModel[] = [];
        let response: AxiosResponse;

        try {

            response = await axios.get(infos.baseUrl);

        } catch (error) {

            const e = error as AxiosError;

            this.logger.fatal('theatersNames');
            this.logger.fatal(e);

            throw Error(e.message);
        }

        try {

            const htmlRoot = cheerio.load(response.data);

            // Get all anchor tags inside li elements with the specified class
            const elements = htmlRoot('li.menu-item.menu-item-type-custom > a');

            for (const element of elements) {
                const text = htmlRoot(element).text();

                // if the text is empty or does not contain 'CanalOlympia' then skip
                if (!text || !text.includes('CanalOlympia')) continue;

                // get country, city and theater name
                const parts = text.split(' – ');
                const [countryAndCity, theaterName] = parts;
                const [country, city] = countryAndCity.split(', ');
                const theaterNameCleaned = theaterName.replace('CanalOlympia ', '');

                // get the slug from the href attribute
                const slug = htmlRoot(element).attr('href')?.split('/').filter((e) => e != '').pop();
                const slugCleaned = slug?.includes('activites') ? slug.replace('activites-', '') : slug;

                const countryIndex = theaters.findIndex((e) => e.country == country);

                if (countryIndex == -1) {
                    // country does not exist, add it
                    theaters.push({
                        country: country,
                        cities: [{
                            name: city,
                            'theaters': [
                                {
                                    name: theaterNameCleaned,
                                    slug: slugCleaned!
                                }
                            ]
                        }]
                    });
                } else {
                    // country exists, check if city exists
                    const cityIndex = theaters[countryIndex].cities.findIndex((e) => e.name == city);

                    if (cityIndex == -1) {
                        // city does not exist, add it
                        theaters[countryIndex].cities.push({
                            name: city,
                            theaters: [{
                                name: theaterNameCleaned,
                                slug: slugCleaned!
                            }]
                        });
                    } else {
                        // city exists, add theater to it
                        theaters[countryIndex].cities[cityIndex].theaters.push({
                            name: theaterNameCleaned,
                            slug: slugCleaned!
                        });
                    }
                }
            }
        } catch (error) {

            this.logger.fatal('theater names');
            this.logger.fatal((error as Error).message);

            throw Error((error as Error).message);
        }

        return theaters;
    }


    /**
     * getMoviesInfos
     * lang can be either fr or en
     */
    public async theaterMovies(theaterName: string, lang: string = 'fr'): Promise<TheaterMovieBriefModel[]> {

        let response: AxiosResponse;

        try {

            response = await axios.get(lang == 'en'
                ? `${infos.baseUrl}/en/${infos.theatersUrl}/${theaterName}-en`
                : `${infos.baseUrl}/${infos.theatersUrl}/${theaterName}`);

        } catch (error) {

            const e = error as AxiosError;

            this.logger.fatal('movies');
            this.logger.fatal(e.message);

            if (e.response?.status == 404)
                return [];
            else
                throw Error(e.message);
        }

        const htmlRoot = parse(response.data);

        const elements = htmlRoot.querySelectorAll('ul[data-date].theater-movies');

        const result: TheaterMovieBriefModel[] = [];


        /// TODO: reduce complexity by using in a more efficient way the html parser and its querySelector
        for (const element of elements) {

            const root = parse(element.outerHTML);

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

        return result;
    }


    /**
     * getMovieInfoBySlug
     * lang can be either fr or en
     */
    public async movieInfoBySlug(slug: string, lang: string = 'fr'): Promise<TheaterMovieModel | null> {

        let response: AxiosResponse;

        const cleanSlug = slug.replace('-en', '');

        try {

            response = await axios.get(lang == 'en'
                ? `${infos.baseUrl}/en/${infos.moviesUrl}/${cleanSlug}-en`
                : `${infos.baseUrl}/${infos.moviesUrl}/${cleanSlug}`);

        } catch (error) {

            const e = error as AxiosError;

            this.logger.fatal('movieInfoBySlug');
            this.logger.fatal(e.message);

            if (e.response?.status == 404)
                return null;
            else
                throw Error(e.message);

        }

        const htmlRoot = parse(response.data);

        const title = htmlRoot.querySelector('div.movie-top-container-cover-content > h1')?.textContent;

        if (!title) return null;

        const genre = htmlRoot.querySelector('div.movie-top-container-cover-content > p.genres > span')?.textContent.split(':').pop()?.trim();
        const date = htmlRoot.querySelector('div.movie-top-container-cover-content > p > span.date')?.textContent.split(':').pop()?.trim();
        const duration = htmlRoot.querySelector('div.movie-top-container-cover-content > p > span.time')?.textContent.split(':').pop()?.trim();
        const brief = htmlRoot.querySelector('div.synopse-modal > p')?.textContent;
        const trailerUrl = htmlRoot.querySelector('div.wrapper > div.movie > iframe')?.rawAttributes.src;

        const TheaterMovie: TheaterMovieModel = {
            title: title,
            genre: genre!,
            duration: duration!,
            releaseDate: date!,
            descriptionBrief: brief!,
            trailerLink: trailerUrl!,
        };

        return TheaterMovie;
    }


    /**
     * getMovieDiffusionInfos
     * lang can be either fr or en
    */
    public async movieDiffusionInfos(slug: string, lang: string = 'fr', theaterName?: string): Promise<TheaterDiffusionInfoModel[]> {

        let response: AxiosResponse;

        const cleanSlug = slug.replace('-en', '');

        try {

            response = await axios.get(lang == 'en'
                ? `${infos.baseUrl}/en/${infos.moviesUrl}/${cleanSlug}-en`
                : `${infos.baseUrl}/${infos.moviesUrl}/${cleanSlug}`);


        } catch (error) {

            const e = error as AxiosError;

            this.logger.fatal('movieDiffusionInfos');
            this.logger.fatal(e.message);

            if (e.response?.status == 404)
                return [];
            else
                throw Error(e.message);
        }

        const htmlRoot = parse(response.data);

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
        });

        return diffusionInfos;
    }


    /**
     * theaterInfos
     * lang can be either fr or en
     */
    public async theaterInfos(theaterName: string, lang: string = 'fr'): Promise<TheaterInfosModel> {

        let response: AxiosResponse;

        const cleanedTheaterName = theaterName.replace('-en', '');

        try {

            response = await axios.get(lang == 'en'
                ? `${infos.baseUrl}/en/${infos.theatersUrl}/${cleanedTheaterName}-en`
                : `${infos.baseUrl}/${infos.theatersUrl}/${cleanedTheaterName}`)


        } catch (error) {

            const e = error as AxiosError;

            this.logger.fatal('theaterInfos');
            this.logger.fatal(error);

            throw Error(e.message);

        }


        const htmlRoot = parse(response.data);

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

        return theaterInfos;
    }


}


const infos = {
    baseUrl: 'https://www.canalolympia.com',
    theatersUrl: 'theaters',
    moviesUrl: 'movies',
    baseLang: 'fr'
}