import ScrappingService from '../../services/scapping/scrapping.servive';
import { describe, expect, test } from '@jest/globals';

const scrappingService = new ScrappingService();

describe('Test on Scapping Service', () => {

    test('if theatersNames is working', () => {

        const names = scrappingService.theatersNames();

        expect(names.length).toBeGreaterThan(0);

    });


    test('if movies is working', async () => {

        return scrappingService.movies('wologuede').then((movies) => {

            expect(movies.length).toBeGreaterThan(0);
        });

    });


    test('if movies is working for en lang', async () => {

        return scrappingService.movies('wologuede', 'en').then((movies) => {

            expect(movies.length).toBeGreaterThan(0);

        });

    });



    test('if movieInfoBySlug is working', async () => {

        return scrappingService.movieInfoBySlug('lexorciste-devotion').then((info) => {

            expect(info).not.toBeNull();

        });

    });


    test('if movieInfoBySlug is working', async () => {

        return scrappingService.movieInfoBySlug('banel-adama').then((info) => {

            expect(info).not.toBeNull();

        });

    });


    test('if movieInfoBySlug is working for en lang', async () => {

        return scrappingService.movieInfoBySlug('lexorciste-devotion', 'en').then((info) => {

            expect(info).not.toBeNull();

        });

    });


    test('if movieInfoBySlug is and getting the brief information without the \'read more\'', async () => {

        return scrappingService.movieInfoBySlug('lexorciste-devotion').then((info) => {

            expect(info.descriptionBrief).not.toBeNull();

            const hasReadMore = info.descriptionBrief.includes('Lire la suite');

            expect(hasReadMore).not.toBe(true);

        });

    });


    test('if movieDiffusionInfos is working', async () => {

        return scrappingService.movieDiffusionInfos('lexorciste-devotion').then((infos) => {

            expect(infos.length).toBeGreaterThan(0);

        });

    });


    test('if movieDiffusionInfos is working with theater', async () => {

        return scrappingService.movieDiffusionInfos('lexorciste-devotion', 'fr', 'wologuede').then((infos) => {
        
            expect(infos.length).toBeGreaterThan(0);

        });

    });


    test('if movieDiffusionInfos is working for en lang', async () => {

        return scrappingService.movieDiffusionInfos('lexorciste-devotion', 'en').then((infos) => {

            expect(infos.length).toBeGreaterThan(0);

        });

    });



    test('if theaterInfos is working', async () => {

        return scrappingService.theaterInfos('wologuede').then((infos) => {
    
            expect(infos).not.toBeNull();
            expect(infos.name).toBeDefined();
            expect(infos.location).toBeDefined();
            expect(infos.locationUrl).toBeDefined();
            expect(infos.pricing.length).toBeGreaterThan(0);
            expect(infos.media.length).toBeGreaterThan(0);
            
        });

    });
})