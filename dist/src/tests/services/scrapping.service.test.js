"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scrapping_servive_1 = __importDefault(require("../../services/scapping/scrapping.servive"));
const globals_1 = require("@jest/globals");
const scrappingService = new scrapping_servive_1.default();
(0, globals_1.describe)('Test on Scapping Service', () => {
    (0, globals_1.test)('if theatersNames is working', () => {
        const names = scrappingService.theatersNames();
        (0, globals_1.expect)(names.length).toBeGreaterThan(0);
    });
    (0, globals_1.test)('if movies is working', async () => {
        return scrappingService.movies('wologuede').then((movies) => {
            (0, globals_1.expect)(movies.length).toBeGreaterThan(0);
        });
    });
    (0, globals_1.test)('if movies is working for en lang', async () => {
        return scrappingService.movies('wologuede', 'en').then((movies) => {
            (0, globals_1.expect)(movies.length).toBeGreaterThan(0);
        });
    });
    (0, globals_1.test)('if movies is working for en lang', async () => {
        return scrappingService.movies('wologuede', 'en').then((movies) => {
            (0, globals_1.expect)(movies.length).toBeGreaterThan(0);
        });
    });
    (0, globals_1.test)('if movieInfoBySlug is working', async () => {
        return scrappingService.movieInfoBySlug('lexorciste-devotion').then((info) => {
            (0, globals_1.expect)(info).not.toBeNull();
        });
    });
    (0, globals_1.test)('if movieInfoBySlug is working for en lang', async () => {
        return scrappingService.movieInfoBySlug('lexorciste-devotion', 'en').then((info) => {
            (0, globals_1.expect)(info).not.toBeNull();
        });
    });
    (0, globals_1.test)('if movieDiffusionInfos is working', async () => {
        return scrappingService.movieDiffusionInfos('lexorciste-devotion').then((infos) => {
            (0, globals_1.expect)(infos.length).toBeGreaterThan(0);
        });
    });
    (0, globals_1.test)('if movieDiffusionInfos is working for en lang', async () => {
        return scrappingService.movieDiffusionInfos('lexorciste-devotion', 'en').then((infos) => {
            (0, globals_1.expect)(infos.length).toBeGreaterThan(0);
        });
    });
});
