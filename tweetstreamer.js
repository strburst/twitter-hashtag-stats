/**
 * Background job to process tweets continually.
 */
/* eslint no-console: off */

const { MessageTypes } = require('./util');
const debug = require('debug')('tss:streamer');
const Twitter = require('twitter');

/**
 * Class for managing streaming API. Can easily install hooks that are invoked with each tweet
 * received.
 */
class TweetStreamer {

  constructor({ processors, secrets, timeout }) {
    this.client = new Twitter(secrets);

    this.numTweets = 0;
    this.numMessages = 0;

    this.stream = this.client.stream('statuses/sample?stall_warnings=true');

    this.stream.on('data', (message) => {
      const messageType = MessageTypes.detect(message);

      this.numMessages += 1;
      switch (messageType) {

        case MessageTypes.TWEET:
          this.numTweets += 1;

          processors.forEach((processor) => {
            processor.process(message);
          });
          break;

        case MessageTypes.DISCONNECT:
          debug(`Disconnect message: code ${message.disconnect.code}, reason ` +
            `${message.disconnect.reason}`);
          break;

        case MessageTypes.STALL_WARNING:
          debug(`Stall warning: code ${message.warning.code}, message ${message.warning.message}, `
            + `% ${message.warning.percent_full}`);
          break;

        case MessageTypes.UNEXPECTED:
          break;

        default:
          console.error(`Unexpected message type ${message}`);

      }
    });

    this.stream.on('error', (error) => {
      console.error(error);
    });

    this.stream.on('end', () => {
      debug(`Processed ${this.numTweets} tweets and ${this.numMessages - this.numTweets} ` +
        'messages');
    });

    if (timeout || timeout === 0) {
      setTimeout(() => {
        this.stream.destroy();
      }, timeout);
    }
  }

}

module.exports = TweetStreamer;
