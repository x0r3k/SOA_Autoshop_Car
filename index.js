require('dotenv').config();
const cors = require('cors');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const carRouter = require('./src/api/routers/car.router');
const adminCarRouter = require('./src/api/routers/admin.car.router');
const { formErrorObject, errorHandling, MAIN_ERROR_CODES } = require('./src/services/errorHandling');
const app = express();
const httpServer = http.createServer(app);

const HTTP_PORT = process.env.HTTP_PORT;

app.set('trust proxy', true);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/car', carRouter);
// app.use('/api/admin/car', adminCarRouter);

app.use('*', (req, res, next) => {
    return next(createError(formErrorObject(MAIN_ERROR_CODES.NOT_FOUND)));
});

app.use(errorHandling);

try {
    httpServer.listen(HTTP_PORT, async () => {
        console.log(`Listening on port = ${HTTP_PORT}, ENV = ${process.env.NODE_ENV}`);
    });
} catch (error) {
    httpServer.close();
}
  