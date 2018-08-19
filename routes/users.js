var express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/user')
var router = express.Router();

router.use(bodyParser.json());

const passport = require('passport');

const authenticate = require('../authenticate')

const cors = require('./cors')

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function (req, res, next) {
  // res.send('respond with a resource');
    User.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
      }, (err) => next(err))
      .catch((err) => next(err));
});


//////////////////////////////////////////////////////////////////////
router.options('*', cors.corsWithOptions, (req, res) => {
  res.sendStatus(200)
})


//////////////////////////////////////////////////////////////////////
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  
  // User.findOne({username: req.body.username})
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({"This is the error": {err: err}})
      }
        else {
          if(req.body.firstname){
            user.firstname = req.body.firstname;
          }
          if (req.body.lastname) {
            user.lastname = req.body.lastname;
          }
            user.save((err, user)=>{
              if(err){
                res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                      return
              }
              passport.authenticate('local')(req, res, () => {
                res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration successfull'})
              });
            });
        };
   });
});


//////////////////////////////////////////////////////////////////////
router.post('/login', cors.corsWithOptions, (req, res, next) => {

  // this is the new set-up of the login
  // instead of the passport authenticate in the post parameters
  // we are putting it inside. as you can see there were three
  // parameters that are being passes. the err user info
  // the error will be passed if in the authentication an error occured
  // then user is the value returned when the authication is successful
  // then when the info is the information about the user
  passport.authenticate('local', (err, user, info) => {
    // pass the error if there is
    if(err) return next(err)

    // if the user is null then pass the response
    if(!user) {
      res.statusCode = 401
        res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful', err: info})
    }
      // but if the user is not, then req.logIn will make the 
      // is a method that you can use from passport.authenticate
      req.logIn(user, (err)=>{
        //check for the error
        if(err){
          res.statusCode = 401
            res.setHeader('Content-Type', 'application/json');
              res.json({success: false,status: 'Login Unsuccessful',err: 'Could not login user' })
        }
          const token = authenticate.getToken({_id: req.user._id})
            res.statusCode = 401
              res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'Login Successful', token: token}) 
      }); 
    }) (req, res, next);
  })


//////////////////////////////////////////////////////////////////////
router.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You just logged out!');
    err.status = 403;
    next(err);
  }
});



//////////////////////////////////////////////////////////////////////
router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res, next) => {
  if(req.user){
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: true,
      token: token,
      status: 'You are succcessfully logged in'
    })
  }



})


//////////////////////////////////////////////////////////////////////
// this method id used to check if the jwt token is valid or not
// this means that the jwt token expires and when you are using it that the 
// token is still not valid, then you will have to login again to generate
// a new token that you can
router.get('/checkJWTToken', cors.corsWithOptions, (req, res)=>{
  passport.authenticate('jwt', {session: false}, (err, user, info)=>{
    if(err) return next(err)
      if(!user) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        return res.json({status: 'JWT is invalid', success: false, err: info})
      } 
        else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.json({status: 'JWT is still valid',success: true, err: user})
        }
    }) (req, res)
})














//////////////////////////////////////////////////////////////////////
router.post('/samp', cors.corsWithOptions, passport.authenticate('local'), (req, res, next) => {
  console.log('sample')
  function manski(a, b, callback) {
    var z = a + b
    if (z == 15) {
      callback(true, 'it was correct')
    } else {
      callback(false, null)
    }
  }

  manski(5, 1, (err, data) => {
    if (!err) {
      console.log(`your data result is: ${data}`)
    } else {
      console.log(`${data}`)
    }
  })

})
















module.exports = router;

