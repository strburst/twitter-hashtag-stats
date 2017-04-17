const express = require('express');
const { HashtagStats } = require('../../scanner/tweetprocessors');
const db = require('../../db');

const router = express.Router();

const hs = new HashtagStats(db);

/* GET home page. */
router.get('/', (req, res, next) => {
  hs.get().then((data) => {
    res.render('hashtagstats', {
      title: 'Frequent Hashtags by Country',
      data: JSON.stringify(data),
    });
  });
});

module.exports = router;
