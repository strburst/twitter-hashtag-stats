/**
 * Wrap twit package to handle tweets in a uniform way.
 */
/* eslint no-console: "off" */

const debug = require('debug')('tss:streamer');
const isFunction = require('lodash.isfunction');
const Twit = require('twit');

/**
 * Class for managing streaming API. Can easily install hooks that are invoked with each tweet
 * received.
 */
class TweetStreamer {

  constructor({ processors, keys, timeout }) {
    this.twitter = new Twit(keys);

    this.processors = Array.isArray(processors) ? processors : [processors];

    this.numTweets = 0;
    this.numMessages = 0;

    this.stream = this.twitter.stream('statuses/sample');

    this.stream.on('tweet', (tweet) => {
      this.numTweets += 1;

      this.processors.forEach((processor) => {
        processor.process(tweet);
      });
    });

    this.stream.on('disconnect', (message) => {
      debug(`Disconnect: ${message}`);
    });

    this.stream.on('reconnect', (request, response, interval) => {
      debug(`Reconnection scheduled in ${interval}ms`);
    });

    this.stream.on('error', (error) => {
      console.error(`Error (code ${error.code}, HTTP ${error.statusCode}): ${error.message}`);
    });

    if (timeout || timeout === 0) {
      setTimeout(() => {
        this.terminate();
      }, timeout);
    }
  }

  stop() {
    this.stream.stop();

    debug(`Processed ${this.numTweets} tweets`);

    this.processors.forEach((processor) => {
      if (isFunction(processor.stop)) {
        processor.stop();
      }
    });
  }

}

module.exports = TweetStreamer;
