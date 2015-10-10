var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  kclass = { html: 'session', body: 'valign-wrapper center-align' }
  res.render('index', { title: '8ditor | Connexion', kclass: kclass });
});

module.exports = router;
