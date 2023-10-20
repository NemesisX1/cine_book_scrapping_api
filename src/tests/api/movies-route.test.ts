import TheaterEventBriefModel from '@/models/theater-event-brief.model';
import app from '../../app';
import request from 'supertest';


describe('Testing movies routes', () => {

    const reqApp = request(app);

    let testingMovieSlug: string;

    test('if /GET /movies/ is working', async () => {

        const res = await reqApp.get('/movies/wologuede');

        testingMovieSlug = (res.body as TheaterEventBriefModel[])[0].slug;

        expect(res.statusCode).toBe(200);


    });


    test('if /GET /movies/ is working with lang en', async () => {

        const res = await reqApp.get('/movies/wologuede?lang=en');

        expect(res.statusCode).toBe(200);

    });


    test('if /GET /movies/ with bad theater name is not working', async () => {

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


    test('if /GET movies/infos/ is working with lang en', async () => {

        const res = await reqApp.get(`/movies/infos/${testingMovieSlug}?lang=en`);

        expect(res.statusCode).toBe(200);

    });

    
    test('if /GET /movies/diffusion-infos/ is working', async () => {

        const res = await reqApp.get(`/movies/diffusion-infos/${testingMovieSlug}`);

        expect(res.statusCode).toBe(200);

    });


     test('if /GET /movies/diffusion-infos/ is working with theater name', async () => {

        const res = await reqApp.get(`/movies/diffusion-infos/${testingMovieSlug}?theater=wologuede`);

        console.log(res.body);
        
        expect(res.statusCode).toBe(200);

    });


    test('if /GET movies/diffusion-infos/ is working with lang en', async () => {

        const res = await reqApp.get(`/movies/diffusion-infos/${testingMovieSlug}?lang=en`);

        expect(res.statusCode).toBe(200);

    });
});