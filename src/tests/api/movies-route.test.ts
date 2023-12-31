import TheaterMovieBriefModel from '@/models/theater-movie-brief.model';
import app from '../../app';
import request from 'supertest';


describe('Testing movies routes', () => {

    const reqApp = request(app);

    let testingMovieSlug: string;

    test('if /GET /movies is working', async () => {

        const res = await reqApp.get('/movies');

        expect(res.statusCode).toBe(200);
        expect((res.body as []).length).toBeGreaterThan(0);

    });

    test('if /GET /movies is working with lang en', async () => {

        const res = await reqApp.get('/movies?lang=en');

        expect(res.statusCode).toBe(200);
        expect((res.body as []).length).toBeGreaterThan(0);

    });


    test('if /GET /movies is not  working with bad lang', async () => {

        const res = await reqApp.get('/movies?lang=zk');

        expect(res.statusCode).not.toBe(200);

    });


    test('if /GET /movies/ is working', async () => {

        const res = await reqApp.get('/movies/wologuede');

        testingMovieSlug = (res.body as TheaterMovieBriefModel[])[0].slug;

        expect(res.statusCode).toBe(200);

    });


    test('if /GET /movies/ is working with lang en', async () => {

        const res = await reqApp.get('/movies/wologuede?lang=en');

        expect(res.statusCode).toBe(200);

    });


    test('if /GET /movies/ with bad theater slug is not working', async () => {

        const res = await reqApp.get('/movies/123');
        
        expect(res.statusCode).not.toBe(200);

    });


    test('if /GET /movies/ with bad lang is not working', async () => {

        const res = await reqApp.get('/movies/wologuede?lang=zk');

        expect(res.statusCode).not.toBe(200);

    });


    test('if /GET /movies/infos/ is working', async () => {

        const res = await reqApp.get(`/movies/infos/${testingMovieSlug}`);

        expect(res.statusCode).toBe(200);

    });


    test('if /GET /movies/infos/ is working with lang en', async () => {

        const res = await reqApp.get(`/movies/infos/${testingMovieSlug}?lang=en`);

        expect(res.statusCode).toBe(200);

    });

    
    test('if /GET /movies/diffusion-infos/ is working', async () => {

        const res = await reqApp.get(`/movies/diffusion-infos/${testingMovieSlug}`);

        expect(res.statusCode).toBe(200);

    });


     test('if /GET /movies/diffusion-infos/ is working with theater slug', async () => {

        const res = await reqApp.get(`/movies/diffusion-infos/${testingMovieSlug}?theaterSlug=wologuede`);

      expect(res.statusCode).toBe(200);

    });



    test('if /GET /movies/diffusion-infos/ is not working with bad theater slug', async () => {

        const res = await reqApp.get(`/movies/diffusion-infos/${testingMovieSlug}?theaterSlug=zki`);

        expect(res.statusCode).not.toBe(200);

    });


    test('if /GET /movies/diffusion-infos/ is working with lang en', async () => {

        const res = await reqApp.get(`/movies/diffusion-infos/${testingMovieSlug}?lang=en`);

        expect(res.statusCode).toBe(200);

    });
});