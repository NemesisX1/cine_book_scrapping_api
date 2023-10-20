import app from '../../app';
import request from 'supertest';

describe('Testing base routes', () => {

    const reqApp = request(app);
    
    test('if /GET is working', async () => {

        const res = await reqApp.get('/');
        
        expect(res.statusCode).toBe(200);

    });


})

