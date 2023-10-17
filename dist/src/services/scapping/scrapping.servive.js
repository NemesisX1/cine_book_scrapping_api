"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = require("log4js");
const node_html_parser_1 = require("node-html-parser");
const theaters_json_1 = __importDefault(require("../../../data/theaters.json"));
const puppeteer_1 = __importDefault(require("puppeteer"));
class ScrappingService {
    constructor() {
        this.logger = (0, log4js_1.getLogger)('ScrappingService');
    }
    /**
     * getTheatersNames
     */
    /// TODO: rewrite this one by fetching theaters list directly from  https://www.xml-sitemaps.com/download/www.canalolympia.com-52d54e4ae/sitemap.xml?view=1
    theatersNames() {
        const names = [];
        for (const url of theaters_json_1.default) {
            names.push(url.loc.split('/').filter((e) => e != '').pop());
        }
        return names;
    }
    /**
     * getMoviesInfos
     * lang can be either fr or en
     */
    async movies(theaterName, lang = 'fr') {
        const browser = await puppeteer_1.default.launch({ headless: true });
        const page = await browser.newPage();
        try {
            await page.goto(lang == 'en' ? `${infos.baseUrl}/en/${infos.theatersUrl}/${theaterName}-en` : `${infos.baseUrl}/${infos.theatersUrl}/${theaterName}`);
        }
        catch (error) {
            this.logger.fatal('movies');
            this.logger.fatal(error.message);
            throw Error(error.message);
        }
        const elements = await page.$$('ul[data-date].theater-movies');
        const result = [];
        for (const element of elements) {
            const text = await page.evaluate(el => el.outerHTML, element);
            const root = (0, node_html_parser_1.parse)(text);
            const rawDate = root.querySelector('ul')?.rawAttributes['data-date'];
            root.childNodes.forEach((node) => {
                node.childNodes.forEach((element) => {
                    const e = element;
                    if (e.classNames != 'is-empty') {
                        const eventImg = e.querySelector('a > figure > img')?.rawAttributes.src ?? null;
                        const eventTitle = e.querySelector('a > h2').innerText;
                        const eventHour = e.querySelector('a > span').innerText.split(' ')[0];
                        const eventLanguage = e.querySelector('a > span > div > span').innerText;
                        const eventUrl = e.querySelector('a')?.rawAttributes.href ?? null;
                        result.push({
                            date: rawDate,
                            img: eventImg,
                            title: eventTitle,
                            hour: eventHour,
                            language: eventLanguage,
                            url: eventUrl,
                            slug: eventUrl?.split('/').filter((e) => e != '').pop() ?? null,
                        });
                    }
                });
            });
        }
        await browser.close();
        return result;
    }
    /**
     * getMovieInfoBySlug
     * lang can be either fr or en
     */
    async movieInfoBySlug(slug, lang = 'fr') {
        const browser = await puppeteer_1.default.launch({ headless: true });
        const page = await browser.newPage();
        const cleanSlug = slug.replace('-en', '');
        try {
            await page.goto(lang == 'en' ? `${infos.baseUrl}/en/${infos.moviesUrl}/${cleanSlug}-en` : `${infos.baseUrl}/${infos.moviesUrl}/${cleanSlug}`);
        }
        catch (error) {
            this.logger.fatal('movieInfoBySlug');
            this.logger.fatal(error);
            throw Error(error.message);
        }
        const htmlRoot = (0, node_html_parser_1.parse)(await page.content());
        const title = htmlRoot.querySelector('div.movie-top-container-cover-content > h1')?.textContent;
        const genre = htmlRoot.querySelector('div.movie-top-container-cover-content > p.genres > span')?.textContent.split(':').pop()?.trim();
        const date = htmlRoot.querySelector('div.movie-top-container-cover-content > p > span.date')?.textContent.split(':').pop()?.trim();
        const duration = htmlRoot.querySelector('div.movie-top-container-cover-content > p > span.time')?.textContent.split(':').pop()?.trim();
        const brief = htmlRoot.querySelector('div.movie-top-container-content-wrapper > p')?.textContent;
        const trailerUrl = htmlRoot.querySelector('div.wrapper > div.movie > iframe')?.rawAttributes.src;
        const theaterEvent = {
            title: title,
            genre: genre,
            duration: duration,
            releaseDate: date,
            descriptionBrief: brief,
            trailerLink: trailerUrl,
        };
        await browser.close();
        return theaterEvent;
    }
    /**
     * getMovieDiffusionInfos
     * lang can be either fr or en
    */
    async movieDiffusionInfos(slug, lang = 'fr') {
        const browser = await puppeteer_1.default.launch({ headless: true });
        const page = await browser.newPage();
        const cleanSlug = slug.replace('-en', '');
        try {
            await page.goto(lang == 'en' ? `${infos.baseUrl}/en/${infos.moviesUrl}/${cleanSlug}-en` : `${infos.baseUrl}/${infos.moviesUrl}/${cleanSlug}`);
        }
        catch (error) {
            this.logger.fatal('movieDiffusionInfos');
            this.logger.fatal(error.message);
            throw Error(error.message);
        }
        const htmlRoot = (0, node_html_parser_1.parse)(await page.content());
        const sessionsInfos = htmlRoot.querySelector('div.sessions');
        const diffusionInfos = [];
        sessionsInfos?.childNodes.forEach((element) => {
            const e = element;
            if (e.localName === 'div') {
                const theaterName = e.rawAttributes['data-name'];
                //  const 
                const liList = e.querySelectorAll('li');
                const dates = [];
                liList.forEach((li) => {
                    if (li.rawAttributes.class) {
                        const weekNumber = li.rawAttributes['data-day'];
                        const weekDay = li.querySelector('span.week-day')?.innerText;
                        const dataHours = [];
                        e.querySelectorAll(`ul[data-day=${weekNumber}] > li`).forEach((e) => {
                            dataHours.push(e.innerText);
                        });
                        dates.push({
                            weekDay: weekDay, weekNumber: weekNumber, hours: dataHours,
                        });
                    }
                });
                diffusionInfos.push({
                    theater: theaterName,
                    dates: dates,
                });
            }
        });
        await browser.close();
        return diffusionInfos;
    }
}
exports.default = ScrappingService;
const infos = {
    baseUrl: 'https://www.canalolympia.com',
    theatersUrl: 'theaters',
    moviesUrl: 'movies',
    baseLang: 'fr'
};
