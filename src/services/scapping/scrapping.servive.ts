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

        const htmlRoot = cheerio.load(response.data);

        const moviesList = htmlRoot('section.homepage-affiche > div.wrapper > div.homepage-affiche-list > a.homepage-affiche-list-movie');

        for (const movie of moviesList) {
            const m = htmlRoot(movie);
            const url = m.attr('href');
            const title = m.find('article > h1').text();
            const imageUrl = m.find('article > figure > img').attr('src');

            result.push({
                title: title,
                img: imageUrl || null,
                url: url || null,
                slug: url?.split('/').filter(e => e !== '').pop() || '',
            });
        }

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

                // get country, city and theater slug
                const parts = text.split(' – ');
                const [countryAndCity, theaterSlug] = parts;
                const [country, city] = countryAndCity.split(', ');
                const theaterSlugCleaned = theaterSlug.replace('CanalOlympia ', '');

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
                                    name: theaterSlugCleaned,
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
                                name: theaterSlugCleaned,
                                slug: slugCleaned!
                            }]
                        });
                    } else {
                        // city exists, add theater to it
                        theaters[countryIndex].cities[cityIndex].theaters.push({
                            name: theaterSlugCleaned,
                            slug: slugCleaned!
                        });
                    }
                }
            }
        } catch (error) {

            this.logger.fatal('theater slugs');
            this.logger.fatal((error as Error).message);

            throw Error((error as Error).message);
        }

        return theaters;
    }


    /**
     * getMoviesInfos
     * lang can be either fr or en
     */
    public async theaterMovies(theaterSlug: string, lang: string = 'fr'): Promise<TheaterMovieBriefModel[]> {

        let response: AxiosResponse;

        try {

            response = await axios.get(lang == 'en'
                ? `${infos.baseUrl}/en/${infos.theatersUrl}/${theaterSlug}-en`
                : `${infos.baseUrl}/${infos.theatersUrl}/${theaterSlug}`);

        } catch (error) {

            const e = error as AxiosError;

            this.logger.fatal('movies');
            this.logger.fatal(e.message);

            if (e.response?.status == 404)
                return [];
            else
                throw Error(e.message);
        }

        const htmlRoot = cheerio.load(response.data);

        const elements = htmlRoot('ul[data-date].theater-movies');

        const result: TheaterMovieBriefModel[] = [];

        for (const element of elements) {
            const e = htmlRoot(element);
            const rawDate = e.attr('data-date');

            e.find('li').each((i, e) => {

                const movie = htmlRoot(e);

                const title = movie.find('a > h2').text();
                const hour = movie.find('a > span').text().split(' ')[0];
                const language = movie.find('a > span > div > span').text();
                const url = movie.find('a').attr('href');
                const img = movie.find('a > figure > img').attr('src');

                result.push({
                    date: rawDate,
                    img: img || null,
                    title: title,
                    hour: hour,
                    language: language,
                    url: url || null,
                    slug: url?.split('/').filter((e) => e != '').pop() || '',
                });
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

        const htmlRoot = cheerio.load(response.data);
        const title = htmlRoot('div.movie-top-container-cover-content > h1').text();

        if (!title) return null;

        const genre = htmlRoot('div.movie-top-container-cover-content > p.genres > span').text().split(':').pop()?.trim();
        const date = htmlRoot('div.movie-top-container-cover-content > p > span.date').text().split(':').pop()?.trim();
        const duration = htmlRoot('div.movie-top-container-cover-content > p > span.time').text().split(':').pop()?.trim();
        const brief = htmlRoot('div.synopse-modal > p').text();
        const trailerUrl = htmlRoot('div.wrapper > div.movie > iframe').attr('src');

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
    public async movieDiffusionInfos(slug: string, lang: string = 'fr', theaterSlug?: string): Promise<TheaterDiffusionInfoModel[]> {

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

            if (e.localName === 'div' && (theaterSlug ? e.rawAttributes['data-name'] == theaterSlug : true)) {

                const theaterSlug = e.rawAttributes['data-name'];
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
                    theater: theaterSlug,
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
    public async theaterInfos(theaterSlug: string, lang: string = 'fr'): Promise<TheaterInfosModel> {

        let response: AxiosResponse;

        const cleanedTheaterName = theaterSlug.replace('-en', '');

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

        const htmlRoot = cheerio.load(response.data);

        const name = htmlRoot('div.theater-top-container-cover-content > h1').text();
        const location = htmlRoot('div.theater-top-container-cover-content > a').text();
        const locationUrl = htmlRoot('div.theater-top-container-cover-content > a').attr('href');

        const pricing: {
            people: string,
            price: string,
        }[] = [];

        const pricingList = htmlRoot('section.slider-and-pricing > div.wrapper > div.pricing > ul.prices-table > li');

        for (const element of pricingList) {
            const e = htmlRoot(element);
            pricing.push({
                people: e.find('span.price-name').text().replaceAll('*', ''),
                price: e.find('span.price-value').text(),
            });
        }

        const media: {
            title: string,
            link: string,
        }[] = [];

        const mediaList = htmlRoot('div.theater-top-container-cover-content > div.info-section-rs > a');

        for (const element of mediaList) {
            const e = htmlRoot(element);
            media.push({
                title: e.attr('href')!,
                link: e.find('img').attr('alt')!,
            });
        }

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