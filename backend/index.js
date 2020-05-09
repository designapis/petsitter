'use strict';

var path = require('path');
var http = require('http');
var auth = require('./utils/auth');

var oas3Tools = require('oas3-tools');
var serverPort = 8080;

//const databaseUrl = 'mongodb://127.0.0.1/petsitter_db';
const databaseUrl = 'mongodb://petsitter-db/petsitter_db';
const mongoose = require('mongoose');

// swaggerRouter configuration
var options = {
    controllers: path.join(__dirname, './controllers')
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
expressAppConfig.addValidator();
var app = expressAppConfig.getApp();
app.use(auth.basicUserAuth);

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
