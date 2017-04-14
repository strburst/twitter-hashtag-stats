#!/usr/bin/env node
/* eslint no-console: "off" */

const TweetStreamer = require('./tweetstreamer');
const config = require('../config');
const db = require('../db');
const debug = require('debug')('tss:example');
const tweetprocessors = require('./tweetprocessors');

const processors = Object.keys(tweetprocessors).map(k => new tweetprocessors[k](db));
processors.forEach((processor) => {
  processor.sync();
});

const stream = new TweetStreamer({
  processors,
  keys: config.keys,
});

function end() {
  debug('Received SIGINT or SIGTERM; stopping');
  stream.stop();
  process.exit(0);
}

process.on('SIGINT', end);
process.on('SIGTERM', end);

console.log('Press ^C to stop scanning tweets');
