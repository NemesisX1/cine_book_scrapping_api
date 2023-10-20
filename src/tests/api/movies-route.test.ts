import app from '../../app';
import { describe, test, expect } from "@jest/globals";
import request from 'supertest';


describe('Testing movies routes', () => {

    const reqApp = request(app);
    test('if /GET theaters/movies/ is working', async () => {

        const res = await reqApp.get('/movies/wologuede');

        expect(res.statusCode).toBe(200);

    });


    test('if /GET theaters/movies/ is working with lang en', async () => {

        const res = await reqApp.get('/movies/wologuede?lang=en');

        expect(res.statusCode).toBe(200);

    });


    test('if /GET theaters/movies/ with bad theater name is not working', async () => {

        const res = await reqApp.get('/movies/123');
        
        expect(res.statusCode).not.toBe(200);

    });


    test('if /GET theaters/movies/ with bad lang is not working', async () => {

        const res = await reqApp.get('/movies/wologuede?lang=zk');

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
});