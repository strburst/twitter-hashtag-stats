const express = require('express');
const { LanguageStats } = require('../../scanner/tweetprocessors');
const db = require('../../db');

const router = express.Router();

const ls = new LanguageStats(db);

/* GET home page. */
router.get('/', (req, res, next) => {
  ls.get().then((data) => {
    res.render('languagestats', {
      pageclass: 'languagestats',
      title: 'Language frequency',
      data: JSON.stringify(data),
    });
  });
});

module.exports = router;
