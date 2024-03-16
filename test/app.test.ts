const app = require('../src/app').default;
const request = require('supertest');

describe('GET /notes', () => {

    it('should return unauthorized without token', async () => {
        const response = await request(app).get('/notes');
        expect(response.status).toBe(401);
    });

    it('should return unauthorized with invalid token', async () => {
        const response = await request(app)
            .get('/notes')
            .set('Authorization', 'invalid_token');
        expect(response.status).toBe(401);
    });
});
