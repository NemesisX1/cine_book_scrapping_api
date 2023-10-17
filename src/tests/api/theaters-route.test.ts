import app from '../../app';
import { describe, test, expect } from "@jest/globals";
import request from 'supertest';

describe('Testing theaters routes' ,() => {
    test('if /GET is working', async () => { 

        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
    
    });


    test('if /GET theaters/names is working', async () => { 

        const res = await request(app).get('/theaters/names');

        expect(res.statusCode).toBe(200);
    
    });


    test('if /GET theaters/movies/ is working', async () => { 

        const res = await request(app).get('/theaters/movies/wologuede');

        expect(res.statusCode).toBe(200);
    
    });
    

    test('if /GET theaters/movies/ is working with lang en', async () => { 

        const res = await request(app).get('/theaters/movies/wologuede?lang=en');

        expect(res.statusCode).toBe(200);
    
    });


    test('if /GET theaters/movies/ is working', async () => { 

        const res = await request(app).get('/theaters/movies/wologuede');

        expect(res.statusCode).toBe(200);
    
    });


    test('if /GET theaters/movie-infos/ is working', async () => { 

        const res = await request(app).get('/theaters/movie-infos/banel-adama');

        expect(res.statusCode).toBe(200);
    
    });


    test('if /GET theaters/movie-infos/ is working with lang en', async () => { 

        const res = await request(app).get('/theaters/movie-infos/banel-adama?lang=en');

        expect(res.statusCode).toBe(200);
    
    });
    
})