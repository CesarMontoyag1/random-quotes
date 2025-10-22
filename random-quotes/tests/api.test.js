// tests/api.test.js
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { createApp } = require('../src/app');

const DATA_FILE = path.join(__dirname, '..', 'data', 'quotes.json');

beforeEach(() => {
  const seed = [
    { id: 1, text: 'Hello', author: 'A' },
    { id: 2, text: 'World', author: 'B' }
  ];
  fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2), 'utf8');
});

const app = createApp();

test('GET /quotes returns list', async () => {
  const res = await request(app).get('/quotes');
  expect(res.statusCode).toBe(200);
  expect(res.body.count).toBe(2);
});

test('GET /quotes/random returns served_by', async () => {
  const res = await request(app).get('/quotes/random');
  expect(res.statusCode).toBe(200);
  expect(res.body.served_by).toBeDefined();
});

test('GET /quotes/:id 404 invalid', async () => {
  const res = await request(app).get('/quotes/999');
  expect(res.statusCode).toBe(404);
});

test('POST /quotes validates and persists', async () => {
  const bad = await request(app).post('/quotes').send({ text: ' ' });
  expect(bad.statusCode).toBe(400);

  const ok = await request(app).post('/quotes').send({ text: 'New quote', author: 'C' });
  expect(ok.statusCode).toBe(201);
  const file = JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
  expect(file.some(q => q.text === 'New quote')).toBe(true);
});
