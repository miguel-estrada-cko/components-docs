var express = require('express')
var router = express.Router()

const regions = require('../config/regions')
const aspects = require('../config/aspects')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Payment Components Demo',
    regions: regions,
    aspects: aspects,
  })
})

module.exports = router;
