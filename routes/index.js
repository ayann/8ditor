var express = require('express');
var router = express.Router();
var session;

router.route('/')
  /* GET home page. */
  .get(function(req, res, next) {
    if (req.session.pseudo) {
      res.redirect('/editor');
    }else{
      kclass = { html: 'session', body: 'bi valign-wrapper center-align' }
      res.render('home/index', { title: '8ditor | Connexion', kclass: kclass });
    }
  })

  .post(function(req, res, next) {
    var pseudo = req.body.pseudo;
    if (pseudo.length > 0) {
      req.session.pseudo = pseudo;
      res.redirect('/editor');
    } else {
      req.flash('error', 'Merci de renseigner votre Pseudo!');
      res.redirect('/');
    }
  });

/* GET editor page. */
router.get('/editor', function(req, res, next) {
  kclass = null;
  pseudo = req.session.pseudo;
  if (pseudo) {
    res.render('editor/index', { title: '8ditor | Editor' });
  }else{
    req.flash('error', 'Merci de vous authentifier!');
    res.redirect('/');
  }
});

module.exports = router;
