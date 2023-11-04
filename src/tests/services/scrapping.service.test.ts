import ScrappingService from '../../services/scapping/scrapping.servive';
import { describe, expect, test } from '@jest/globals';

const scrappingService = new ScrappingService();

describe('Test on Scapping Service', () => {

    let testingMovieSlug: string;

    test('if theatersNames is working', async () => {

        const names = await scrappingService.theatersNames();

        expect(names.length).toBeGreaterThan(0);
        
        const name = names[0];
        expect(name.country).toBeDefined();
        expect(name.cities.length).toBeGreaterThan(0);

    });


    test('if theaterMovies is working', async () => {

        return scrappingService.theaterMovies('wologuede').then((movies) => {

            expect(movies.length).toBeGreaterThan(0);
            
        });

    });


    test('if theaterMovies is working for en lang', async () => {

        return scrappingService.theaterMovies('wologuede', 'en').then((movies) => {

            testingMovieSlug = movies[0].slug;

            expect(movies.length).toBeGreaterThan(0);

        });

    });



    test('if movieInfoBySlug is working', async () => {

        return scrappingService.movieInfoBySlug(testingMovieSlug).then((info) => {

            expect(info).not.toBeNull();

        });

    });



    test('if movieInfoBySlug is working for en lang', async () => {

        return scrappingService.movieInfoBySlug(testingMovieSlug, 'en').then((info) => {

            expect(info).not.toBeNull();

        });

    });

    test('if movieInfoBySlug is not working with bad slug', async () => {

        return scrappingService.movieInfoBySlug('zkk').then((info) => {
                        
            expect(info).toBeNull();

        });

    });


    test('if movieInfoBySlug is and getting the brief information without the \'read more\'', async () => {

        return scrappingService.movieInfoBySlug(testingMovieSlug).then((info) => {

            expect(info!.descriptionBrief).not.toBeNull();

            const hasReadMore = info!.descriptionBrief.includes('Lire la suite');

            expect(hasReadMore).not.toBe(true);

        });

    });


    test('if movieDiffusionInfos is working', async () => {

        return scrappingService.movieDiffusionInfos(testingMovieSlug).then((infos) => {

            expect(infos.length).toBeGreaterThan(0);

        });

    });


    test('if movieDiffusionInfos is working with theater', async () => {

        return scrappingService.movieDiffusionInfos(testingMovieSlug, 'fr', 'wologuede').then((infos) => {

            expect(infos.length).toBe(1);

        });

    });


    test('if movieDiffusionInfos is not working with bad theater', async () => {

        return scrappingService.movieDiffusionInfos(testingMovieSlug, 'fr', 'zkk').then((infos) => {

            expect(infos.length).toBe(0);
        });

    });


    test('if movieDiffusionInfos is working for en lang', async () => {

        return scrappingService.movieDiffusionInfos(testingMovieSlug, 'en').then((infos) => {

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


    test('if theaterInfos is working with lang en', async () => {

        return scrappingService.theaterInfos('wologuede', 'en').then((infos) => {

            expect(infos).not.toBeNull();
            expect(infos.name).toBeDefined();
            expect(infos.location).toBeDefined();
            expect(infos.locationUrl).toBeDefined();
            expect(infos.pricing.length).toBeGreaterThan(0);
            expect(infos.media.length).toBeGreaterThan(0);

        });

    });

    test('if availableMovies is working', async () => {

        return scrappingService.availableMovies().then((movies) => {

            expect(movies.length).toBeGreaterThan(0);

            const movie = movies[0];
            
            expect(movie.title).not.toBeNull();
            expect(movie.slug).toBeDefined();
            expect(movie.img).toBeDefined();
            
        });

    });


    test('if availableMovies is working with lang en', async () => {

        return scrappingService.availableMovies('en').then((movies) => {

            expect(movies.length).toBeGreaterThan(0);

            const movie = movies[0];   

            expect(movie.title).not.toBeNull();
            expect(movie.img).toBeDefined();
            expect(movie.slug).toBeDefined();
            
        });

    });

    //excape game test 
    test("if availableMovie with escape game is wroking ", ()=> {
        const escapegame = scrappingService.AllEscapeGames
    })
})
