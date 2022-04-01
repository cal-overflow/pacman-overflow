import app from '@/ExpressApp.js';
import request from 'supertest';

describe('Express App', () => {
  describe('GET "/"', () => {
    let response;

    beforeEach(async () => {
      response = await request(app).get('/');
    });

    it('should return status code 200', () => {      
      expect(response.statusCode).toEqual(200);
    });
  
    it('should return Hello World', () => {
      expect(response.text).toEqual('Hello, World!');
    });
  });
});
