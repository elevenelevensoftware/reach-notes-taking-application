// Here we're importing the app object from a file located at ../src/app.
// The .default property is used because the app is exported as a default export from the file.
// This syntax is commonly used when working with ES6 modules in Node.js.
const app = require('../src/app').default;
// It provides a fluent and easy-to-use API for testing HTTP endpoints.
const request = require('supertest');

describe('API routes for notes', () => {

    // use of 'it' here for readability
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

    // use of 'test' here for readability
    test('GET /notes should retrieve all notes with simplified format', async () => {

        const response = await request(app)
            .get('/notes')
            .set('Authorization', getAuthorizationHeader());

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    test('POST /notes should create a new note', async () => {

        const response = await request(app)
            .post('/notes')
            .set('Authorization', getAuthorizationHeader())
            .send({title: 'Test Note', content: 'Test Content'});

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('title', 'Test Note');
        expect(response.body).toHaveProperty('content', 'Test Content');
        expect(response.body).toHaveProperty('createdAt');
    });

    test('GET /notes/:id should retrieve a note by id', async () => {

        const createNoteResponse = await request(app)
            .post('/notes')
            .set('Authorization', getAuthorizationHeader())
            .send({title: 'Test Note', content: 'Test Content'});

        const noteId = createNoteResponse.body.id;
        const response = await request(app)
            .get(`/notes/${noteId}`)
            .set('Authorization', getAuthorizationHeader());

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', noteId);
        expect(response.body).toHaveProperty('title', 'Test Note');
        expect(response.body).toHaveProperty('content', 'Test Content');
        expect(response.body).toHaveProperty('createdAt');
    });

    test('GET /notes/:id should return 404 if note does not exist', async () => {

        const response = await request(app)
            .get('/notes/999')
            .set('Authorization', getAuthorizationHeader());

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Note not found');
    });

    function getAuthorizationHeader() {
        return 'an_arbitrary_static_token';
    }
});
