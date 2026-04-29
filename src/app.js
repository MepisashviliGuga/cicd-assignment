const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from CI/CD Assignment App! Pipeline is working!',
    version: process.env.APP_VERSION || '1.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/items', (req, res) => {
  const items = [
    { id: 1, name: 'Item One', description: 'First demo item' },
    { id: 2, name: 'Item Two', description: 'Second demo item' },
    { id: 3, name: 'Item Three', description: 'Third demo item' },
  ];
  res.json({ items, count: items.length });
});

app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newItem = { id: Date.now(), name, description: description || '' };
  res.status(201).json(newItem);
});

module.exports = app;
