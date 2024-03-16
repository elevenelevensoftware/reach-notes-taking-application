const app = require('../src/app').default;
const request = require('supertest');

describe('API routes for notes', () => {

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

    test('POST /notes should create a new note', async () => {

        const response = await request(app)
            .post('/notes')
            .set('Authorization', 'an_arbitrary_static_token')
            .send({ title: 'Test Note', content: 'Test Content' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title', 'Test Note');
        expect(response.body).toHaveProperty('content', 'Test Content');
        expect(response.body).toHaveProperty('createdAt');
    });

    test('GET /notes should retrieve all notes with simplified format', async () => {

        const response = await request(app)
            .get('/notes')
            .set('Authorization', 'an_arbitrary_static_token');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test('GET /notes/:id should retrieve a note by id', async () => {

        const createNoteResponse = await request(app)
            .post('/notes')
            .set('Authorization', 'an_arbitrary_static_token')
            .send({ title: 'Test Note', content: 'Test Content' });

        const noteId = createNoteResponse.body.id;
        const response = await request(app)
            .get(`/notes/${noteId}`)
            .set('Authorization', 'an_arbitrary_static_token');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', noteId);
        expect(response.body).toHaveProperty('title', 'Test Note');
        expect(response.body).toHaveProperty('content', 'Test Content');
        expect(response.body).toHaveProperty('createdAt');
    });

    test('GET /notes/:id should return 404 if note does not exist', async () => {

        const response = await request(app)
            .get('/notes/999')
            .set('Authorization', 'an_arbitrary_static_token');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Note not found');
    });
});
