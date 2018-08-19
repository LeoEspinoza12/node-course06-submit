const passport = require('passport');
const LocalStartegy = require('passport-local').Strategy;
var User = require('./models/user')

const JwtStrategy = require('passport-jwt').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;

const jwt = require('jsonwebtoken');

////////////////////////////////////////////////////
// here we will import the passport-facebook-token
const FacebookTokenStrategy = require('passport-facebook-token');


var config = require('./config');


const local = passport.use(new LocalStartegy(User.authenticate()))
module.exports = local


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


module.exports.getToken = (user) => { 
  return jwt.sign(user, config.secretKey, {
    expiresIn:3600 
  });
};

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey;


module.exports.jwtPassport = passport.use(new JwtStrategy(opts, 
  (jwt_payload, done) => {
    console.log("\nJWT Payload: ", jwt_payload)

    User.findOne({_id:  jwt_payload._id}, (err, user) => {
      if(err){
        return done(err, false)
      }
        else if (user) {
          // console.log('\n\nthis is the user: ', user)
          return done(null, user)
        }
          else {
            return done(null, false)
          }
    })
  }));


module.exports.verifyUser = passport.authenticate('jwt', {session: false} );

module.exports.verifyAdmin = function (req, res, next) {
  console.log(req.user.username);
  console.log(req.user.admin);
  if (!req.user.admin) {
    err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
  } else {
    next();
  }
};




/////////////////////////////////////////////////////////////////////////
// this is basically the configuration of our facebook passport.
module.exports.facebookPassport = passport.use(new FacebookTokenStrategy(
  {
    clientID: config.facebook.clientId ,
    clientSecret: config.facebook.clientSecret
  },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({facebookId: profile.id}, (err, user) => {
        if(err){
          return done(err, false);
        }
          if(!err && user !== null){
            return done(null, user)
          }
            else {
              user = new User({username: profile.displayName});
              user.facebookId = profile.id;
              user.firstname = profile.name.givenName;
              user.lastname = profile.name.familyName;
              user.save((err, user) => {
                if(err){
                  return done(err, false)
                }
                  else {
                    return done(null, user)
                  }
              })
            }
      });
    }



))









