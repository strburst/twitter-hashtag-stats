const TweetStreamer = require('./tweetstreamer');
const config = require('./config');
const debug = require('debug')('tss:example');

new TweetStreamer({
  processors: [{ process: (tweet) => { debug(tweet.text); } }],
  secrets: config.secrets,
  timeout: 1000,
});
