/**
 * File for processor plugins to TweetStreamer.
 */
/* eslint class-methods-use-this: off */

const Sequelize = require('sequelize');

/**
 * Store stats on whether certain data (e.g. location) is available in tweets.
 */
class FeatureChecker {

  constructor(db) {
    this.db = db;

    this.coordCount = 0;
    this.hashtagAndPlaceCount = 0;
    this.hashtagCount = 0;
    this.placeCount = 0;
    this.tweetCount = 0;
  }

  sync() {
    // TODO: implement persisting to database
  }

  process(tweet) {
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

/**
 * Group hashtag frequency by country.
 */
class HashtagStats {

  constructor(db) {
    // Definition of the HashtagStats table
    this.HashtagStats = db.define('hashtagstats', {
      country: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      hashtag: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
    });

    this.db = db;
  }

  sync() {
    this.HashtagStats.sync({ force: true });
  }

  drop() {
    this.HashtagStats.drop();
  }

  process(tweet) {
    if (tweet.place) {
      const hashtagList = tweet.entities.hashtags;
      for (let i = 0; i < hashtagList.length; i += 1) {
        console.log(`hashtag: ${hashtagList[i]}`);
        this.insert(tweet.place.country, hashtagList[i].text);
      }
    }
  }

  /*
   * Inserts and/or updates hashtag statistics in HashtagStats
   */
  insert(country, hashtag) {
    this.HashtagStats.find({
      where: {
        country,
        hashtag,
      },
    }).then((stat) => {
      if (stat) {
        stat.increment('count');
      } else {
        const data = {
          country,
          hashtag,
        };
        this.HashtagStats.create(data).then((row) => {
          console.log(`Tweet: ${row}`);
        });
      }
    });
  }

  /**
   * Returns a list of all the trending hashtags and countries.
   */
  get() {
    // TODO: implement this
  }

}

/**
 * Store a raw tweet, without any processing.
 */
class TweetStorer {

  constructor(db) {
    // Definition of the Tweets table
    this.Tweet = db.define('tweets', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      text: {
        type: Sequelize.TEXT,
      },
      // hashtags: {
      //   type: Sequelize.ARRAY(Sequelize.STRING),
      // },
      timestamp: {
        type: Sequelize.DATE,
      },
    });

    this.db = db;
  }

  sync() {
    this.Tweet.sync({ force: true });
  }

  process(tweet) {
    this.insert(tweet);
  }

  insert({ id_str, text, entities, created_at }) {
    const data = {
      id: id_str,
      text,
      // hashtags: entities.hashtags, // TODO: fix errors
      timestamp: new Date(created_at),
    };

    this.Tweet.create(data).then((tweet) => {
      console.log(`Tweet: ${tweet}`);
    });
  }

}

module.exports = {
  FeatureChecker,
  HashtagStats,
  // TweetStorer,
};
