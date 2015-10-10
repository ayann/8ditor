var express = require('express');
var router = express.Router();

router.route('/')
  /* GET home page. */
  .get(function(req, res, next) {
    kclass = { html: 'session', body: 'bi valign-wrapper center-align' }
    res.render('index', { title: '8ditor | Connexion', kclass: kclass });
  })

  .post(function(req, res, next) {
    res.redirect('/editor');
  });

/* GET editor page. */
router.get('/editor', function(req, res, next) {
  kclass = null;
  res.render('editor', { title: '8ditor | Editor' });
});

module.exports = router;
