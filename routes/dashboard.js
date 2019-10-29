var express = require('express');
var router = express.Router();
var sess;
var fs = require("fs");
var request = require("request");

/* GET users listing. */
router.get('/', function(req, res, next) {
  sess = req.session;
  if (sess.auth == 1){
    var totalItems = 0;
    request({url: "http://35.223.118.133/api/raw/heitems", json: true }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        totalItems = body.length;
        console.log(totalItems);
      }
    });
    res.render('dashboard.hbs', {layout: "Layouts/DashboardLayout.hbs", username: sess.username , message: sess.message, totalItems: totalItems});
  }else{
    res.redirect('/');
  }
});

router.get('/logout',(req,res) => {
  req.session.destroy((err) => {
    if(err) {
      return console.log(err);
    }
    res.redirect('/');
  });

});

router.get('/allitems', function(req, res, next) {
  sess = req.session;
  if (sess.auth == 1) {

    var url = "http://35.223.118.133/api/raw/heitems";

    request({
      url: url,
      json: true
    }, function (error, response, body) {

      if (!error && response.statusCode === 200) {
        // res.send(body); // Print the json response
      }
      res.render("allitems.hbs", {layout: "Layouts/DashboardLayout.hbs", items: body, username: sess.username});
    })
  }else{
    res.redirect('/');
  }
});

router.get('/oneitem', function(req, res, next) {
  sess = req.session;
  if (sess.auth == 1) {
    res.render('oneitem.hbs', {layout: "Layouts/DashboardLayout.hbs", username: sess.username , message: sess.message});
  }else{
    res.redirect('/');
  }
});

router.post('/oneitem', function(req, res, next) {
  sess = req.session;
  if (sess.auth == 1) {
    var BarCode = req.body.barcode;

    request.post('http://35.223.118.133/api/getitemfindataviabarcode', {
      json: {
        barcode: BarCode,
        warehouseid: null
      }
    }, (error, response, body) => {
      if (error) {
        console.error(error);
        return
      }
      res.render("oneitem.hbs", {layout: "Layouts/DashboardLayout.hbs", item: body, username: sess.username});
    })
  }else{
    res.redirect('/');
  }
});

module.exports = router;
