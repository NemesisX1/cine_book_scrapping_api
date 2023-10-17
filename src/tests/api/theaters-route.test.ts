import app from '../../app';
import { describe, test, expect } from "@jest/globals";
import request from 'supertest';

describe('Testing theaters routes' ,() => {
    test('if /GET is working', async () => { 

        const res = await request(app).get('/');

        expect(res.statusCode).toBe(200);
    
    });
    
})