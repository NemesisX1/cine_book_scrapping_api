import app from '../../app';
import { describe, test, expect } from "@jest/globals";
import request from 'supertest';

describe('Testing theaters routes', () => {

    const reqApp = request(app);
    
    test('if /GET is working', async () => {

        const res = await reqApp.get('/');

        
        expect(res.statusCode).toBe(200);

    });


    test('if /GET theaters/names is working', async () => {

        const res = await reqApp.get('/theaters/names');

        expect(res.statusCode).toBe(200);

    });


    test('if /GET theaters/movies/ is working', async () => {

        const res = await reqApp.get('/theaters/movies/wologuede');

        expect(res.statusCode).toBe(200);

    });


    test('if /GET theaters/movies/ is working with lang en', async () => {

        const res = await reqApp.get('/theaters/movies/wologuede?lang=en');

        expect(res.statusCode).toBe(200);

    });


    test('if /GET theaters/movies/ with bad theater name is not working', async () => {

        const res = await reqApp.get('/theaters/movies/123');
        
        expect(res.statusCode).not.toBe(200);

    });


    test('if /GET theaters/movies/ with bad lang is not working', async () => {

        const res = await reqApp.get('/theaters/movies/wologuede?lang=zk');

        expect(res.statusCode).not.toBe(200);

    });


    test('if /GET theaters/movie-infos/ is working', async () => {

        const res = await reqApp.get('/theaters/movie-infos/banel-adama');

        expect(res.statusCode).toBe(200);

    });


    test('if /GET theaters/movie-infos/ is working with lang en', async () => {

        const res = await reqApp.get('/theaters/movie-infos/banel-adama?lang=en');

        expect(res.statusCode).toBe(200);

    });


    test('if /GET theaters/infos/ is working', async () => {

        const res = await reqApp.get('/theaters/infos/wologuede');

        console.log(res.body);
        
        expect(res.statusCode).toBe(200);

    });


    test('if /GET theaters/infos/ with bad theater name is not working', async () => {

        const res = await reqApp.get('/theaters/infos/123');

        console.log(res.body);
        
        expect(res.statusCode).not.toBe(200);

    });


    test('if /GET theaters/infos/ is working with lang en', async () => {

        const res = await reqApp.get('/theaters/infos/wologuede?lang=en');

        console.log(res.body);

        expect(res.statusCode).toBe(200);

    });

})

