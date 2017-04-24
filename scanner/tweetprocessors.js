/**
 * File for processor plugins to TweetStreamer.
 */
/* eslint class-methods-use-this: "off" */

const Sequelize = require('sequelize');
const config = require('../config');
const debugCreate = require('debug');


/**
 * Store stats on whether certain data (e.g. location) is available in tweets.
 */
class FeatureChecker {

  constructor(db) {
    this.coordCount = 0;
    this.hashtagAndPlaceCount = 0;
    this.hashtagCount = 0;
    this.placeCount = 0;
    this.tweetCount = 0;

    this.db = db;
    this.debug = debugCreate('tss:tp:FeatureChecker');
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
    this.debug(`Of ${this.tweetCount} tweets, ${this.coordCount} have exact coordinates, ` +
      `${this.placeCount} have a place associated, ${this.hashtagCount} have hashtags, and ` +
      `${this.hashtagAndPlaceCount} have both hashtags and a place`);
  }
}

/**
 * Group hashtag frequency by country.
 */
class HashtagStats {

  constructor(db) {
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
    this.debug = debugCreate('tss:tp:HashtagStats');
  }

  sync() {
    this.HashtagStats.sync({ force: config.db.clear });
  }

  drop() {
    this.HashtagStats.drop();
  }

  process(tweet) {
    if (tweet.place) {
      (tweet.entities.hashtags || []).forEach((hashtag) => {
        this.debug(`Found hashtag #${hashtag.text} in ${tweet.place.country_code}`);
        this.insert(tweet.place.country_code, hashtag.text);
      });
    }
  }

  insert(country, hashtag) {
    this.HashtagStats.findOrCreate({
      where: {
        country,
        hashtag,
      },
    }).spread((input, created) => {
      if (!created) {
        input.increment('count');
      }
    });
  }

  /**
   * Returns a list of all the trending hashtags and countries.
   * The list is ordered by country, hashtags with highest count.
   * It is formatted as a list of [country, hashtag, entry].
   */
  get() {
    return this.HashtagStats.findAll({ order: ['country', 'count'] }).then(
      fullList => fullList.map(elem =>
       [elem.dataValues.country, elem.dataValues.hashtag, elem.dataValues.count]).reverse());
  }

}


/**
 * List the most frequently used languages.
 */
class LanguageStats {

  constructor(db) {
    this.LanguageStats = db.define('languagestats', {
      language: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      count: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
    });

    this.db = db;
    this.debug = debugCreate('tss:tp:LanguageStats');
  }

  sync() {
    this.LanguageStats.sync({ force: config.db.clear });
  }

  drop() {
    this.LanguageStats.drop();
  }

  process(tweet) {
    if (tweet.lang) {
      this.insert(tweet.lang);
    }
  }

  insert(language) {
    this.LanguageStats.findOrCreate({
      where: {
        language,
      },
    }).spread((input, created) => {
      if (!created) {
        input.increment('count');
      }
    });
  }

  /**
   * Returns a list of languages in order of use in tweets.
   */
  get() {
    const pTopCounts = this.LanguageStats.findAll({ limit: 20, order: [['count', 'DESC']] });
    const pTotalCount = this.LanguageStats.sum('count');
    return Promise.all([pTopCounts, pTotalCount]).then(
      ([fullList, totalCount]) => fullList.map(elem =>
        [elem.dataValues.language, elem.dataValues.count / totalCount * 100]));
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
    this.debug = debugCreate('tss:tp:TweetStorer');
  }

  sync() {
    this.Tweet.sync({ force: config.db.clear });
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

    this.Tweet.create(data);
  }

}


module.exports = {
  FeatureChecker,
  HashtagStats,
  LanguageStats,
  // TweetStorer,
};
