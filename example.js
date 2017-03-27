#!/usr/bin/env node
/* eslint no-console: off */

const TweetStreamer = require('./tweetstreamer');
const config = require('./config');
const debug = require('debug')('tss:example');

/**
 * Store stats on whether tweets have location data and hashtags.
 */
class CheckFeatures {

  constructor() {
    this.geoCount = 0;
    this.hashtagAndPlaceCount = 0;
    this.hashtagCount = 0;
    this.placeCount = 0;
    this.tweetCount = 0;
  }

  process(tweet) {
    if (tweet.geo) {
      this.placeCount += 1;
    }
    if (tweet.entities.hashtags && tweet.entities.hashtags.length > 0 && tweet.place) {
      this.hashtagAndPlaceCount += 1;
    }
    if (tweet.entities.hashtags && tweet.entities.hashtags.length > 0) {
      this.hashtagCount += 1;
    }
    if (tweet.place) {
      this.placeCount += 1;
    }

    this.tweetCount += 1;
  }

  terminate() {
    console.log(`Of ${this.tweetCount} tweets, ${this.geoCount} have exact coordinates, ` +
      `${this.placeCount} have a place associated, ${this.hashtagCount} have hashtags, and ` +
      `${this.hashtagAndPlaceCount} have both hashtags and a place`);
  }
}

const stream = new TweetStreamer({
  processors: [new CheckFeatures()],
  secrets: config.secrets,
});

function end() {
  debug('Received SIGINT or SIGTERM; stopping');
  stream.terminate();
}

process.on('SIGINT', end);
process.on('SIGTERM', end);

console.log('Press ^C to stop scanning tweets');
