var express = require('express');
var router = express.Router();
const User = require('../models/userSchema');
var sess;
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
var SENDGRID_APY_KEY = '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';

const saltRounds = 10;

/* GET home page. */
router.get('/', function (req, res, next) {
    sess = req.session;
    if (sess.auth == 1) {
        res.redirect("/dashboard");
    } else {
        res.render('index.hbs', {layout: "Layouts/IndexLayout.hbs", message: sess.message});
        sess.message = "";
    }
});

router.get('/register', function (req, res, next) {
    sess = req.session;
    if (sess.auth == 1) {
        res.redirect("/dashboard");
    } else {
        res.render("register.hbs", {layout: 'Layouts/IndexLayout.hbs', message: sess.message});
        sess.message = "";
    }
});

router.post('/login', async (req, res) => {
    sess = req.session;
    const user = await User.findOne({
        email: req.body.email
    });
    var loginPassword = req.body.password;
    if (user) {
        bcrypt.compare(loginPassword, user.password, function (err, response) {
            if (response == true) {
                sess.auth = 1;
                sess.userdata = user;
                res.redirect("/dashboard");
            } else {
                sess.message = "Wrong Password!";
                res.redirect("/");
            }
        });
    } else {
        sess.message = "User not found";
        res.redirect("/");
    }
});


router.post('/register', async (req, res) => {
    sess = req.session;
    var RegisterPassword = req.body.password;
    bcrypt.hash(RegisterPassword, saltRounds, function (err, hash) {
        const Item = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
        });
        Item.save().then(
            data => {
                sgMail.setApiKey(SENDGRID_APY_KEY);
                const msg = {
                    to: req.body.email,
                    from: 'pylondashboard@pasteque.com',
                    subject: 'Activation Message',
                    html: '<strong>You have registered successfully at PylonDashboard</strong>',
                };
                sgMail.send(msg);
                sess.message = "User created successfully";
                res.redirect("/");
            }
        ).catch(err => {
            throw err;
        })
    });
});
module.exports = router;
