var express = require('express');
var router = express.Router();

// Load Models
var User = require('../models/user');
var Event = require('../models/event');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET calendar page. */
router.get('/calendar', isLoggedIn, function(req, res, next) {
  res.render('calendar', { title: 'Calendar', user: req.user });
});

/* GET init data in calendar */
router.get('/calendar/init', isLoggedIn, function(req, res){
  Event.collection.insert([
    {
      user_email: "userB@email.com",
      text: "My test event A",
      start_date: new Date(2017,8,1),
      end_date:   new Date(2017,8,5)
    },
    {
      user_email: "userB@email.com",
      text: "My test event A",
      start_date: new Date(2017,8,1),
      end_date:   new Date(2017,8,5)
    },
    {
      user_email: "userA@email.com",
      text:"One more test event",
      start_date: new Date(2017,8,3),
      end_date:   new Date(2017,8,8),
      color: "#DD8616"
    }
  ], function(err, docs){
    if (err) {
      throw err;
    } else {
      console.info('%d events were successfully stored.', docs.length);
    }
  });

  res.send("Test events were added to the database")
});

/* GET data to calendar */
router.get('/calendar/data', isLoggedIn, function(req, res){
  Event.find({}, function(err, data) {
    if (!err) {
      var response = [];

      //set id property for all records of logged in user
      for (var i = 0; i < data.length; i++) {
        if(req.user.local.email == data[i].user_email)
          response.push({ ...data[i]._doc, id: data[i]['_id'] });
      }

      console.log(response);

      //output response
      res.send(response);
    } else {throw err;}
  });
});

/* GET events changes */
router.post('/calendar/data', isLoggedIn, function(req, res){
  var data = req.body;

  //get operation type
  var mode = data["!nativeeditor_status"];
  //get id of record
  var sid = data.id;
  console.info("%s", sid);
  console.info("%s", data._id);
  var tid = sid;

  //remove properties which we do not want to save in DB
  delete data.id;
  delete data.gr_id;
  delete data["!nativeeditor_status"];

  // link data with user
  data.user_email = req.user.local.email;

  //output confirmation response
  function update_response(err, result){
    if (err)
      mode = "error";
    else if (mode == "inserted")
      tid = data._id;

    res.setHeader("Content-Type","text/xml");
    res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
  }

  //run db operation
  if (mode == "updated")
    Event.findByIdAndUpdate(sid, data, update_response);
  else if (mode == "inserted")
    Event.collection.insert([data], update_response);
  else if (mode == "deleted")
    Event.findByIdAndRemove(sid, update_response);
  else
    res.send("Not supported operation");
});
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

module.exports = router;
