const request = require('supertest');
const app = require('../src/app');

describe('GET /', () => {
  it('should return 200 with app info', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('status', 'healthy');
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /health', () => {
  it('should return 200 with ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/items', () => {
  it('should return a list of items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('count');
    expect(res.body.count).toBe(res.body.items.length);
  });

  it('each item should have id, name, and description', async () => {
    const res = await request(app).get('/api/items');
    res.body.items.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('description');
    });
  });
});

describe('POST /api/items', () => {
  it('should create a new item with valid data', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Test Item', description: 'Test description' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Item');
    expect(res.body.description).toBe('Test description');
  });

  it('should return 400 if name is missing', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ description: 'No name provided' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should create item with only name (no description)', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Minimal Item' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Minimal Item');
    expect(res.body.description).toBe('');
  });
});
