import app from '../../app';
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



    test('if /GET theaters/infos/ is working', async () => {

        const res = await reqApp.get('/theaters/infos/wologuede');


        expect(res.statusCode).toBe(200);

    });


    test('if /GET theaters/infos/ with bad theater slug is not working', async () => {

        const res = await reqApp.get('/theaters/infos/123');

        expect(res.statusCode).not.toBe(200);

    });


    test('if /GET theaters/infos/ with bad lang is not working', async () => {

        const res = await reqApp.get('/theaters/infos/wologuede?lang=zk');

        expect(res.statusCode).not.toBe(200);

    });


    test('if /GET theaters/infos/ is working with lang en', async () => {

        const res = await reqApp.get('/theaters/infos/wologuede?lang=en');

        expect(res.statusCode).toBe(200);

    });

    test('if /GET theaters/escap-game is working ', async () => {

        const res = await reqApp.get('/theaters/escape-game');

        expect(res.statusCode).toBe(200);
    })

})

