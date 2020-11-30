require('dotenv').config();
const cors = require('cors');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');

const app = express();
const httpServer = http.createServer(app);

const HTTP_PORT = process.env.HTTP_PORT;

app.set('trust proxy', true);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', (req, res) => res.status(200).send('1'));

try {
    httpServer.listen(HTTP_PORT, async () => {
        console.log(`Listening on port = ${HTTP_PORT}, ENV = ${process.env.NODE_ENV}`);
    });
} catch (error) {
    httpServer.close();
}
  