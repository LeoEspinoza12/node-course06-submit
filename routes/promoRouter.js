const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose')
const Promotions = require('../models/promotions')

const promoRouter = express.Router()
promoRouter.use(bodyParser.json())

const authenticate = require('../authenticate');

const cors = require('./cors')

promoRouter.route('/')
.options(cors.corsWithOptions, (req, res, next) => {
  res.sendStatus(200);
})
  .get(cors.cors, (req, res, next) => {
    // instead of using the Promotions.find({}), 
    //  we can pass in the req.query information by which the server
    // can check or verify for the token
     Promotions.find(req.query)
       .then((promo) => {
         res.statusCode = 200;
         res.setHeader('Content-Type', 'application/json');
         res.json(promo)
       }, (err) => next(err))
       .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body)
      .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo)
        console.log('New Promotion is created \n', promo, '\n')
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end(`PUT operation is not supported for Promotions`)
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  });


promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res, next) => {
  res.sendStatus(200);
})
  .get(cors.cors, (req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end(`POST operation is not supported on ${req.params.promoId}`)
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndUpdate(req.params.promoId, {$set: req.body},{new: true})
      .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = promoRouter;