#!/usr/bin/env node
/* eslint no-console: off */

const TweetStreamer = require('./tweetstreamer');
const config = require('./config');
const debug = require('debug')('tss:example');
const db = require('./db');

/**
 * Store stats on whether tweets have location data and hashtags.
 */
class CheckFeatures {

  constructor() {
    this.coordCount = 0;
    this.hashtagAndPlaceCount = 0;
    this.hashtagCount = 0;
    this.placeCount = 0;
    this.tweetCount = 0;
  }

  process(tweet) {
    if (tweet.place) {
      const hashtagList = tweet.entities.hashtags;
      for (let i = 0; i < hashtagList.length; i += 1) {
        console.log(`hashtag: ${hashtagList[i]}`);
        db.insertHashtagStats(tweet.place.country, hashtagList[i].text);
      }
    }
    if (tweet.coordinates) {
      this.coordCount += 1;
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

  stop() {
    console.log(`Of ${this.tweetCount} tweets, ${this.coordCount} have exact coordinates, ` +
      `${this.placeCount} have a place associated, ${this.hashtagCount} have hashtags, and ` +
      `${this.hashtagAndPlaceCount} have both hashtags and a place`);
  }
}

const stream = new TweetStreamer({
  processors: [new CheckFeatures()],
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
