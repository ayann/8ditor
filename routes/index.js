var express = require('express');
var router = express.Router();
var session;

router.route('/')
  /* GET home page. */
  .get(function(req, res, next) {
    session = req.session;
    kclass = { html: 'session', body: 'bi valign-wrapper center-align' }
    res.render('index', { title: '8ditor | Connexion', kclass: kclass });
  })

  .post(function(req, res, next) {
    var pseudo = req.body.pseudo;
    session = req.session;
    session.pseudo = pseudo;
    res.redirect('/editor');
  });

/* GET editor page. */
router.get('/editor', function(req, res, next) {
  kclass = null;
  pseudo = req.session.pseudo;
  if (pseudo) {
    // req.flash('error', 'Merci de vous authentifier!')
    res.render('editor', { title: '8ditor | Editor' });
  }else{
    res.redirect('/');
  }
});

module.exports = router;
