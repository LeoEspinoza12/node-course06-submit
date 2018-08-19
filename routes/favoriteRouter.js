const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose')
const Favorites = require('../models/favorites')

const favoriteRouter = express.Router()
favoriteRouter.use(bodyParser.json())

const cors = require('./cors')

const authenticate = require('../authenticate');


// favoriteRouter.route('/')
//   .options(cors.corsWithOptions, (req, res, next) => {
//     res.sendStatus(200);
//   })
//   .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
//     Favorites.find({})
//     .populate('user', 'dishes')
//       .then((favorite) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(favorite)
//       }, (err) => next(err))
//       .catch((err) => next(err));
//   })
//   .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//    res.statusCode = 403
//    res.end(`POST operation is not supported for Favorites`)
//   })
//   .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     res.statusCode = 403
//     res.end(`PUT operation is not supported for Favorites`)
//   })
//   .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favorites.remove({})
//       .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(resp)
//       }, (err) => next(err))
//       .catch((err) => next(err))
//   });


// /////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////
// favoriteRouter.route('/:dishId')
//   .options(cors.corsWithOptions, (req, res, next) => {
//     res.sendStatus(200);
//   })
//   .get(cors.cors, (req, res, next) => {
//      res.statusCode = 403
//      res.end(`GET operation is not supported for Favorites/ID`)
//   })
//   .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    
//     // Favorites.find({})
//     //   .then((favorite) => {
//     //     if (favorite != null){
//     //       req.body.user = req.user._id;
//     //       req.body.dishes.push(dish)
//     //       console.log(favorite) 
//     //       // favorite.dishes.push(req.params.dishId);
          
//     //       favorite.save()
//     //       //   .then((favorite)=> {
//     //       //     res.statusCode = 200;
//     //       //     res.setHeader('Content-Type', 'application/json');
//     //       //     res.json(favorite)
//     //       //   }, err => next(err));
//     //       res.json(favorite)
//     //     } else {
//     //       err = new Error('Favorites is not found')
//     //         err.status = 404;
//     //           return next(err)
//     //     }
//     //   }, (err) => next(err))
//     //     .catch((err) => next(err))


// Favorites.find({
//     'user': req.user._id
//   })
//   .then((favorite) => {
//     var index = favorite.dishes.indexOf(req.body);
//     if (index == -1) {
//       favorite.dishes.push(req.body)
//       favorite.save()
//         .then((favorite) => {
//           res.statusCode = 200;
//           res.setHeader('Content-Type', 'application/json');
//           res.json(favorite);
//         }, (err) => next(err));
//     } else {
//       err = new Error('Dish ' + req.params.dishId + ' already exists');
//       err.status = 404;
//       return next(err);
//     }
//   }, (err) => next(err))
//   .catch((err) => next(err));





//   })
//   .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favorites.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new: true})
//       .then((favorite) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(favorite)
//       }, (err) => next(err))
//       .catch((err) => next(err))
//   })
//   .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
//     Favorites.findByIdAndRemove(req.params.dishId)
//       .then((resp) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(resp)
//       }, (err) => next(err))
//       .catch((err) => next(err))
//   })


































































// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const authenticate = require('../authenticate');

// const Favorites = require('../models/favorites');

// const favoriteRouter = express.Router();

favoriteRouter.route('/')
   .options(cors.corsWithOptions, (req, res, next) => {
     res.sendStatus(200);
   })
.get(authenticate.verifyUser, (req, res, next) => {
  Favorites.find({})
  .populate('user')
  .populate('dishes')
  .then((favorites) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(favorites);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
  
  Favorites.find({
    'user': req.user._id
  })
  .then((favorite) => {
    
    for (var key in req.body) {
      var index = favorite.dishes.indexOf(req.body[key])
      console.log(index);
      if (index == -1) {
        favorite.dishes.push(req.body[key])
        console.log('Favorite has been added!');
        favorite.save()
        .then((favorite) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(favorite);
        }, (err) => next(err))
        
      } else {
        err = new Error('already exists');
        err.status = 404;
        return next(err);
        
      }
      
    }
    
  })
  
})
.delete(authenticate.verifyUser, (req, res, next) => {
  var userId = req.user._id;
  Favorites.remove({
    user: userId
  })
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
  
});




favoriteRouter.route('/:dishId')
  .options(cors.corsWithOptions, (req, res, next) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next)=> {
    Favorites.findOne({user: req.user_id})
      .then((favorites) => {
        if(!favorites){
          res.statusCode = 200;
          res.setHeader('Content-type', 'application/json');
          return res.json({"exists": false, "favorites": null})
        }
          else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0){
              res.statusCode = 200;
              res.setHeader('Content-type', 'application/json');
              return res.json({"exists": false,"favorites": null})
            }
              else {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                return res.json({"exists": true, "favorites": null})
              } 
          }
      }, (err) => next(err))
        .catch((err) => next(err))
  })



  .delete(authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({'user': req.user._id}, (err, favorite) => {
      if (err) return next(err);

        var index = favorite.dishes.indexOf(req.params.dishId);

        if(index >= 0) {
          favorite.dishes.splice(index, 1);
          favorite.save()
            .then((favorite) => {
              Favorites.findById(favorite._id)
              .populate('user')
              .populate('dishes')
                .then((favorite)=> {
                  console.log('Favorite dish has been deleted'. favorite);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json')
                  res.json(favorite)
                })
            })
              .catch((err) => {
                return next(err)
              })
        }
        else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end('Dish' + req.params._id + 'is not in your list')
        }
    }, (err) => next(err))
      .catch((err) => next(err))
  })


.post(authenticate.verifyUser, (req, res, next) => {
   Favorites.findOne({
       'user': req.user._id
     })
     .then((favorite) => {
       if (favorite != null) {
         if (favorite.dishes.indexOf(req.params.dishId) === -1) {
           favorite.dishes.push(req.params.dishId);
         }
         favorite.save()
           .then((favorite) => {
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.json(favorite);
           }, (err) => next(err));
       } else {
         Favorites.create({
             dishes: req.params.dishId,
             user: req.user._id
           })
           .then((favorite) => {
             console.log('Favorite Created ', favorite);
             res.statusCode = 200;
             res.setHeader('Content-Type', 'application/json');
             res.json(favorite);
           }, (err) => next(err))
           .catch((err) => next(err));
       }
     }, (err) => next(err))
     .catch((err) => next(err));
   })
                       
  
  module.exports = favoriteRouter;




