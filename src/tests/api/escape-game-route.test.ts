import app from '../../app';
import request from 'supertest';

describe('Testing escape-games routes', () => {

    const reqApp = request(app);

    test('if /GET /escape-games is working ', async () => {

        const res = await reqApp.get('/escape-games');

        expect(res.statusCode).toBe(200);
    })


    test('if /GET /escape-games is working with lang en', async () => {

        const res = await reqApp.get('/escape-games?lang=en');

        expect(res.statusCode).toBe(200);
    })


    test('if /GET /escape-games is not working with bad lang', async () => {

        const res = await reqApp.get('/escape-games?lang=zk');

        expect(res.statusCode).not.toBe(200);
    })

})

