'use strict';

const path = require('path');
const http = require('http');
const auth = require('./utils/auth');
const express = require('express');

const oas3Tools = require('oas3-tools');
const serverPort = 8080;

//const databaseUrl = 'mongodb://127.0.0.1/petsitter_db';
const databaseUrl = process.env.DB_URL || 'mongodb://petsitter-db/petsitter_db';
const mongoose = require('mongoose');

// swaggerRouter configuration
const options = {
    controllers: path.join(__dirname, './controllers')
};

const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
expressAppConfig.addValidator();
const app = expressAppConfig.getApp();

app.use(auth.basicUserAuth);
app.use(express.static(path.join(__dirname, './build')));
app.get(/\/app\/?.*/, (req, res, next) => {
  res.sendFile(path.join(__dirname, './build/index.html'))
})

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const server = http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});

const SIGNALS = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGTERM: 15
}

Object.keys(SIGNALS).forEach((signal) => {
  process.on(signal, () => {
    console.log(`Recieved signal(${signal}), shutting down server...`)
    const code = SIGNALS[signal]
    server.close(() => {
      console.log(`Server stopped by ${signal} with value ${code}`)
      process.exit(128 + code)
    })
  })
})
