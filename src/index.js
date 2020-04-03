const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Store = require('./Store');

const SECRET = process.env.SECRET;
const PORT = process.env.PORT || 3000;

const app = express();
const store = new Store();

app.use(bodyParser.json());

app.use('/', (req, res, next) => {
  console.log(`Process incoming request: ${req.originalUrl}`);
  const token = req.headers.token;
  try {
    jwt.verify(token, SECRET);
  } catch(e) {
    const error = new Error('Wrong access token');
    error.code = 401;
    next(error);
  }
});

app.get('/led', async (req, res) => {
  const ledSettings = store.getData();
  return res.json(ledSettings);
});

app.post('/led/enable', async (req, res) => {
  await store.setData({ isEnabled: true });
  res.status(200);
  res.end();
});

app.post('/led/disable', async (req, res) => {
  await store.setData({ isEnabled: false });
  res.status(200);
  res.end();
});

app.post('/led/color', async (req, res) => {
  const color = req.body.color;
  await store.setData({ color });
  res.status(200);
  res.end();
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.code || 500);
  res.end();
});

(async () => {
  await store.load();
  app.listen(PORT, () => {
    console.info(`Listening incoming requests on ${PORT} port...`);
  });
})();
