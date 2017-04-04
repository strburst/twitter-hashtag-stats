#!/usr/bin/env node
/* eslint no-unused-expressions: off */

// set up the connection with db
const pg = require('pg');
const Sequelize = require('sequelize');

const db = new Sequelize('db_name', 'username', 'password', { // change database name, username, password
  host: 'host', // change host
  dialect: 'postgres',
});



// definition of the Tweets table
const Tweet = db.define('tweets', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
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

// definition of the HashtagStats table
const HashtagStats = db.define('hashtagstats', {
  country: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  hashtag: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  count: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
});

// returns a list of all the trending hashtags and counties
function getHashtagStats() {
// TODO: implement this

}

// inserts and updates hashtag statistics in HashtagStats
function insertHashtagStats(country, hashtag) {
  HashtagStats.find({
      where: {
        country: country,
        hashtag: hashtag
      }
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

// creates the HashtagStats table
function createHashtagStats() {
  HashtagStats.sync();
}

// drops the HashtagStats table
function dropHashtagStats() {
  HashtagStats.drop();
}

// inserts tweets into the Tweets table
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


// create the Tweets table
function createTweets() {
  Tweet.sync();
}

// drops the table Tweets
function dropTweets() {
  Tweet.drop();
}

// require('yargs')
//   .usage('$0 <command> [args]')
//   .command('create', 'Creates the database', {}, create)
//   .command('drop', 'Deletes the database', {}, drop)
//   .demandCommand(1, 1, 'Must provide exactly one subcommand')
//   .help()
//   .argv;



module.exports = {
  insertHashtagStats,
};
