const request = require('supertest');
const { app, mongoose } = require('../server'); 
const AboutContent = require('../models/aboutSchema');

//Skip isAdmin check
jest.mock('../middleware/isAdmin', () => (req, res, next) => next());

//Start server
let server;

beforeAll(async () => {
  // 1) Start sever
  server = app.listen(0);
});

//Test get about
describe('GET /api/content/about', () => {
  it('should return about content', async () => {
    const res = await request(app).get('/api/content/about');
    
    console.log('RESPONSE BODY:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
    expect(Array.isArray(res.body)).toBe(true);
  });
});

//Test delete about/skills
describe('DELETE /api/content/about/skills/:id', () => {
    it('should return content not found', async () => {
        const res = await request(app).delete('/api/content/about/skills/invalid-id');

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message');
    });
});

//Test put about content
describe('PUT /api/content/about/', () => {
    it('Content updated', async () => {
        const res = await request(app)
        .put('/api/content/about/')
        .send({
        heading: 'Test Heading',
        text: 'Test Text'
      })
        .set('Content-Type', 'application/json');

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    });
});

//close server
afterAll(async () => {
  await mongoose.connection.close();   
  await server.close();                
});

