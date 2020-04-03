const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Store = require('./Store');

process.on('uncaughtException', (e) => {
  console.error('Occurs uncaught exception:', e);
});
process.on('unhandledRejection', (e) => {
  console.error('Occurs unhandled rejection:', e);
});

const SECRET = process.env.SECRET;
const PORT = process.env.PORT || 3000;

const app = express();
const store = new Store();

app.use(bodyParser.json());

app.use('/', (req, res, next) => {
  console.log(`Process incoming request: ${req.method} ${req.originalUrl}`);
  const token = req.headers.token;
  try {
    const data = jwt.verify(token, SECRET);
    console.log(`Token successfully parsed: ${JSON.stringify(data)}`);
    next();
  } catch(e) {
    const error = new Error('Wrong access token');
    error.code = 401;
    next(error);
  }
});

app.get('/led', (req, res) => {
  const ledSettings = store.getData();
  return res.json(ledSettings);
});

app.post('/led/enable', async (req, res) => {
  await store.setData({ isEnabled: true });
  console.log('Successfully enabled led.')
  res.status(200);
  res.end();
});

app.post('/led/disable', async (req, res) => {
  await store.setData({ isEnabled: false });
  console.log('Successfully disabled led.')
  res.status(200);
  res.end();
});

app.post('/led/color', async (req, res) => {
  const color = req.body.color;
  await store.setData({ color });
  console.log('Successfully set led color.')
  res.status(200);
  res.end();
});

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.code = 404;
  next(error);
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
