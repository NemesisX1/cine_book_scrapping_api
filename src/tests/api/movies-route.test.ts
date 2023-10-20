import app from '../../app';
import { describe, test, expect } from "@jest/globals";
import request from 'supertest';


describe('Testing movies routes', () => {

    const reqApp = request(app);
    test('if /GET /movies/ is working', async () => {

        const res = await reqApp.get('/movies/wologuede');

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

        const res = await reqApp.get('/movies/infos/banel-adama');

        expect(res.statusCode).toBe(200);

    });


    test('if /GET movies/infos/ is working with lang en', async () => {

        const res = await reqApp.get('/movies/infos/banel-adama?lang=en');

        expect(res.statusCode).toBe(200);

    });

    test('if /GET /movies/diffusion-infos/ is working', async () => {

        const res = await reqApp.get('/movies/diffusion-infos/banel-adama');

        expect(res.statusCode).toBe(200);

    });


    test('if /GET movies/diffusion-infos/ is working with lang en', async () => {

        const res = await reqApp.get('/movies/diffusion-infos/banel-adama?lang=en');

        expect(res.statusCode).toBe(200);

    });
});