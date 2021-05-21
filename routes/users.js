const path = require('path')
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render('signup', {title_signUp: 'AJAX | sign Up'})
});



module.exports = router; 
  