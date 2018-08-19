const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose')
const Leaders = require('../models/leaders')

const leaderRouter = express.Router()
leaderRouter.use(bodyParser.json())

const cors = require('./cors')

const authenticate = require('../authenticate');


leaderRouter.route('/')
  .options(cors.corsWithOptions, (req, res, next) => {
    res.sendStatus(200);
  })
  .get(cors.cors, (req, res, next) => {
    // instead of using the Leaders.find({}),
    //  we can pass in the req.query information by which the server
    // can check or verify for the token
    Leaders.find(req.query)
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body)
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
        console.log('New Leader is created \n', leader, '\n')
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end(`PUT operation is not supported for Leaders`)
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  });


leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res, next) => {
  res.sendStatus(200);
})
  .get(cors.cors, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403
    res.end(`POST operation is not supported on ${req.params.leaderId}`)
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new: true})
      .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader)
      }, (err) => next(err))
      .catch((err) => next(err))
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp)
      }, (err) => next(err))
      .catch((err) => next(err))
  })

module.exports = leaderRouter;