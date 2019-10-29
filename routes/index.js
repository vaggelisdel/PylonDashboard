var express = require('express');
var router = express.Router();
const User = require('../models/userSchema');
var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
  sess = req.session;
  if (sess.auth == 1){
    res.redirect("/dashboard");
  }else{
    res.render('index.hbs', {layout: "Layouts/IndexLayout.hbs", message: sess.message});
    sess.message = "";
  }
});

router.get('/register', function(req, res, next) {
  sess = req.session;
  if (sess.auth == 1){
    res.redirect("/dashboard");
  }else{
    res.render("register.hbs", {layout: 'Layouts/IndexLayout.hbs', message: sess.message});
    sess.message = "";
  }
});

router.post('/login', async (req, res) => {
  sess = req.session;
  const user = await User.findOne({
    email: req.body.email
  });

  if (user){
    if (user.password == req.body.password){
      sess.auth = 1;
      sess.username = user.username;
      res.redirect("/dashboard");
    }else{
      sess.message = "Wrong Password!";
      res.redirect("/");
    }
  }else{
    sess.message = "User not found";
    res.redirect("/");
  }
});


router.post('/register', async (req, res) => {
  sess = req.session;
  const Item = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  Item.save().then(
      data=> {
        sess.message = "User created successfully";
        res.redirect("/");
      }
  ).catch(err=>{
    throw err;
  })
});
module.exports = router;
