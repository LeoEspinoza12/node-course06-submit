const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const cors = require('./cors')

// we have to import the multer module
const multer = require('multer');


// we will configure a storage set up for our file downloads
const storage = multer.diskStorage({
  // first we will configure a destination which will
  // be located on the public folder images
  destination: (req, file, callback) => {
    callback(null, 'public/images')
  },
  
  // then we will set up a filename for the uploaded files
  // if we will not set up a filename, multer will set up a 
  // random filename which will be very hard to find
  filename: (req, file, callback) => {
    // we will use the method (original name) to make sure
    // that the uploaded file will be saved by the same name
    callback(null, file.originalname)
  }
  
});


// this is the configuration for the imageFileFilter
// this is to check if the file is an image
const imageFileFilter = (req, file, callback) => {
  if (file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('You can only upload image files'), false)
  }
  callback(null, true)


  // if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
  //   return cb(new Error('You can upload only image files!'), false);
  // }
  // cb(null, true);


}

// configure the multer module for use of our multer application
// multer requires two parameters, the first one is the storage path
// which we have just set up, the second one is the image file filtering
const upload = multer({
  storage: storage, 
  fileFilter: imageFileFilter
})

// set up the upload router
const uploadRouter = express.Router()

// use the upload router
uploadRouter.use(bodyParser.json())

// create the upload route
uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res, next) => {
  res.sendStatus(200);
})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403
  res.end(`GET operation is not supported on /imageUpload`)
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res, next) => {
  res,statusCode = 200;
  res.setHeader('Content-Tye', 'application/json');
  res.json(req.file);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403
  res.end(`PUT operation is not supported on /imageUpload`)
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  res.statusCode = 403
  res.end(`DELETE operation is not supported on /imageUpload`)
})







module.exports = uploadRouter