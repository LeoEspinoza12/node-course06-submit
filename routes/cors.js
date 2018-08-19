const express = require('express');
const cors = require('cors')

const app = express();


// this is to create a multiple origins of 
// our Scheme, Hotsname, and Portnumber
const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http:localhost:4200'];

const corsOptionsDelegate = (req, callback) => {
  var corsOptions;

  // here we are going to check if the req.header is 
  // in the whitelist array. if the result returns a number 
  // greater than 1, then we can configure
  if(whitelist.indexOf(req.header('Origin')) !== -1){
    corsOptions = { origin: true };
  }
    else {
      corsOptions = { origin: false }
    }
  callback(null, corsOptions)
}

// when the configuration of the cors module 
// by just calling cors() WITH NO OPTIONS, then this will reply back 
// when access-control-allow-origin with the wildcard (*)  
exports.cors = cors();

// but if we need to apple a cors with specific options of a particular root
// then we will use this method
exports.corsWithOptions = cors(corsOptionsDelegate);