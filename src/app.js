// src/app.js
const express = require('express');
const morgan = require('morgan'); // opcional, instala si no lo tienes
const promClient = require('prom-client'); // opcional, instala si no lo tienes
const os = require('os');

const { getAll, getById, getRandom, addQuote } = require('./quotes');

function createApp() {
  const app = express();

  app.use(express.json());
  // logging middleware 
  try { app.use(morgan('combined')); } catch (e) { /* morgan no instalado */ }

  // Prometheus metrics 
  try { promClient.collectDefaultMetrics(); } catch (e) { /* prom-client no instalado */ }

  app.get('/', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Welcome to the Random Quotes API',
      endpoints: {
        random: '/quotes/random',
        all: '/quotes',
        byId: '/quotes/:id',
        post: '/quotes (POST)',
        metrics: '/metrics (if prom-client installed)'
      }
    });
  });

  app.get('/quotes', (req, res) => {
    const data = getAll();
    res.json({ count: data.length, data });
  });

  app.get('/quotes/random', (req, res) => {
    const q = getRandom();
    if (!q) return res.status(404).json({ error: 'No quotes available' });
    res.json({ ...q, served_by: os.hostname() });
  });

  app.get('/quotes/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
    const q = getById(id);
    if (!q) return res.status(404).json({ error: `Quote with id ${id} not found` });
    res.json(q);
  });

  // POST - añade nueva frase y la persiste en data/quotes.json
  app.post('/quotes', (req, res) => {
    try {
      const newQ = addQuote(req.body);
      return res.status(201).json(newQ);
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({ error: err.message || 'Internal error' });
    }
  });

  // metrics endpoint si prom-client está instalado
  try {
    app.get('/metrics', async (req, res) => {
      res.set('Content-Type', promClient.register.contentType);
      res.end(await promClient.register.metrics());
    });
  } catch (e) { /* no prom-client */ }

  return app;
}

module.exports = { createApp };
