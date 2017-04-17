const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    pageclass: 'index',
    title: 'Twitter Streaming Stats',
  });
});

module.exports = router;
