#!/usr/bin/env node
/* eslint no-unused-expressions: off */

const Sequelize = require('sequelize');
const config = require('./config');
const yargs = require('yargs');

// Set up the connection with db
const db = new Sequelize(config.db.name, config.db.username, config.db.password, config.db);

// Definition of the Tweets table
const Tweet = db.define('tweets', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  text: {
    type: Sequelize.TEXT,
  },
  hashtag: {
    type: Sequelize.ARRAY(Sequelize.STRING),
  },
  timestamp: {
    type: Sequelize.DATE,
  },
  geo: {
    type: Sequelize.STRING,
  },
  location: {
    type: Sequelize.STRING,
  },
});

// Definition of the HashtagStats table
const HashtagStats = db.define('hashtagstats', {
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

/**
 * Returns a list of all the trending hashtags and counties
 */
function getHashtagStats() {
// TODO: implement this

}

/*
 * Inserts and updates hashtag statistics in HashtagStats
 */
function insertHashtagStats(country, hashtag) {
  HashtagStats.find({
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
      HashtagStats.create(data).then((row) => {
        console.log(`Tweet: ${row}`);
      });
    }
  });
}

/**
 * Creates the HashtagStats table
 */
function createHashtagStats() {
  HashtagStats.sync();
}

/**
 * Drops the HashtagStats table
 */
function dropHashtagStats() {
  HashtagStats.drop();
}

/**
 * Inserts tweets into the Tweets table
 */
function insertTweets(id, text, hashtag, timestamp, geo, location) {
  const data = {
    id,
    text,
    hashtag,
    timestamp,
    geo,
    location,
  };
  Tweet.create(data).then((tweet) => {
    console.log(`Tweet: ${tweet}`);
  });
}


/**
 * Create the Tweets table
 */
function createTweets() {
  Tweet.sync();
}

/**
 * Drops the table Tweets
 */
function dropTweets() {
  Tweet.drop();
}

const create = createHashtagStats;
const drop = dropHashtagStats;

if (require.main === module) {
  yargs
    .usage('$0 <command> [args]')
    .command('create', 'Creates the database', {}, create)
    .command('drop', 'Deletes the database', {}, drop)
    .demandCommand(1, 1, 'Must provide exactly one subcommand')
    .help()
    .argv;
}

module.exports = {
  db,
  insertHashtagStats,
};
