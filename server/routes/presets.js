var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Preset = require('../models/preset');
var Verify = require('./verify');

var presetRouter = express.Router();
presetRouter.use(bodyParser.json());

presetRouter.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
  userId = req.decoded._doc._id;
  Preset.find({ postedBy: userId})
    .populate('postedBy')
    .exec(function (err, presets) {
      console.log(userId);
      if (err) return next(err);
      res.json(presets);
  });
})

.post(function (req, res, next) {

  // var meetup = new Preset(req.body);
  // meetup.save(function (err, result) {
  //   res.json(result);
  // });

  userId = req.decoded._doc._id;
   Preset.findOne({postedBy : req.decoded._doc._id, _id: req.body._id}, function (err, preset) {
     if (err) throw err;
     if(preset === null) {    //Create a new preset
       req.body.postedBy = req.decoded._doc._id;
       Preset.create(req.body, function (err, preset) {
           if (err) throw err;
           console.log('Preset created!');
           var id = preset._id;
           res.writeHead(200, {
               'Content-Type': 'text/plain'
           });
           res.end('Added the preset with id: ' + id);
       });
     }
     else {     //update the preset
      //  preset.save(req.body, function (err, preset) {
      //    if (err) throw err;
      //    console.log("updated preset");
      //    console.log(preset);
      //    res.json(preset);
      //  });
       Preset.findByIdAndUpdate(req.body._id, {
             $set: req.body
          }, {
             new: true
          }, function (err, preset) {
             if (err) throw err;
             console.log("updated preset");
             console.log(preset);
             res.json(preset);
        });
     }
   });
})

.delete(function (req, res, next) {
  console.log(req.body);
  Preset.remove({name: req.body.name}, function (err, results) {
    if (err) return console.error(err);
    res.json(results);
  });


    // userId = req.decoded._doc._id;
    // Favorites.findOne({postedBy: userId}, function(err, favorite) {
    //   if (err) throw err;
    //   console.log(favorite);
    //   deleteThis = favorite._id;
    //   Favorites.findByIdAndRemove(deleteThis, function(err, resp) {
    //     if (err) throw err;
    //     res.json(resp);
    //   });
    // });
});

presetRouter.route('/:presetId')
//.all(Verify.verifyOrdinaryUser)

.put(function (req, res, next) {
  Dishes.findByIdAndUpdate(req.params.dishId, {
      $set: req.body
  }, {
      new: true
  }, function (err, dish) {
      if (err) throw err;
      res.json(dish);
  });
})

.delete(function (req, res, next) {
  //userId = req.decoded._doc._id;
  //Favorites.findOne({postedBy: userId}, function(err, favorite) {
  //  if (err) throw err;
  Preset.findByIdAndRemove(req.params.presetId, function (err, resp) {
    if (err) throw err;
    res.json(resp);
  });
  // Preset.save(function (err, resp) {
  //   if (err) throw err;
  //   res.json(resp);
  // });
  //});

});
module.exports = presetRouter;
