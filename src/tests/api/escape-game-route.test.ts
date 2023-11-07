import app from '../../app';
import request from 'supertest';

describe('Testing escape-games routes', () => {

    const reqApp = request(app);

    test('if /GET /escape-games is working ', async () => {

        const res = await reqApp.get('/escape-games');

        expect(res.statusCode).toBe(200);
    })

})

