const request = require('supertest');
const { app, mongoose } = require('../server'); 
const AboutContent = require('../models/aboutSchema');

//Skip isAdmin check
jest.mock('../middleware/isAdmin', () => (req, res, next) => next());

//Start server
let server;

beforeAll( async () => {
  server = app.listen(0); 
  
  const existing = await AboutContent.findOne();
   if (!existing) {
     await AboutContent.create({
       heading: 'test1',
       text: 'test1'
     });
  } 
});

//close server
afterAll(async () => {
  await mongoose.connection.close();   
  await server.close();                
});

//Test get about
describe('GET /api/content/about', () => {
  it('should return about content', async () => {
    const res = await request(app).get('/api/content/about');
    
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

