#!/usr/bin/env node
/**
 * Start listening with the express server.
 */
/* eslint no-console: "off" */

const app = require('./app');
const debug = require('debug')('tss:server');
const http = require('http');

const port = parseInt(process.env.PORT, 10) || 3000;
app.set('port', port);

const server = http.createServer(app);

// Listen on provided port, on all network interfaces
server.listen(port);

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind, 'requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind, 'is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.on('listening', () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
});

