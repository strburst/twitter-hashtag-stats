#!/usr/bin/env node
/**
 * Start listening with the express server.
 */
/* eslint no-console: "off" */

const app = require('./app');
const config = require('../config');
const debug = require('debug')('tss:server');
const http = require('http');

app.set('port', config.server.port);

const server = http.createServer(app);

// Listen on provided port, on all network interfaces
server.listen(config.server.port);

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${config.server.port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${config.server.port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  debug(`Listening on port ${server.address().port}`);
});

