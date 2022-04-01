import app from '@/backend/ExpressApp.js';
import request from 'supertest';
import fs from 'fs';

describe('Express App', () => {
  describe('GET "/"', () => {
    let response;

    beforeEach(async () => {

      response = await request(app).get('/');
    });

    it('should return status code 200', () => {      
      expect(response.statusCode).toEqual(200);
    });

    it('should return frontend/index.html', () => {
      expect(response.text).toEqual(fs.readFileSync('./src/frontend/index.html', 'utf8'));
    });
  });
});
