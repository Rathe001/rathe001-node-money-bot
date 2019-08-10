import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import helmet from 'helmet';
import api from './api/api';

const port = 8080;
const app = express();
const server = http.Server(app);

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
  next();
});

//pre-flight requests
app.options('*', function(req, res) {
  res.send(200);
});

api(app);

server.listen(port, err => {
  if (err) {
    throw err;
  }
  /* eslint-disable no-console */
  console.log(`API running on http://localhost:${port}`);
});

module.exports = server;
