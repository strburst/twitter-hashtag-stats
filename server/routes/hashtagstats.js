const express = require('express');
const { HashtagStats } = require('../../scanner/tweetprocessors');
const db = require('../../db');

const router = express.Router();

const hs = new HashtagStats(db);

/* GET home page. */
router.get('/', (req, res, next) => {
  hs.get().then((data) => {
    res.render('hashtagstats', {
      pageclass: 'hashtagstats',
      title: 'Frequent Hashtags by Country',
      data: JSON.stringify(data),
    });
  }).catch((error) => {
    res.status(500);
    res.render('error', {
      error,
      message: 'An error occured when querying the database',
    });
  });
});

module.exports = router;
