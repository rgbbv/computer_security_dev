let express = require('express');
let router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const passport = require('passport');
const User = require('../models/user');
const jwtHelper = require('../helpers/jwtHelper');
const BoomHelper = require("../helpers/BoomHelper");

function verifyUserAccess(req, res, next) {
    User.findById(req.params.id).exec((err, user) => {
        if (String(user.id) !== String(req.id)) {
            return res.status(403).send({auth: false, message: 'Unauthorized to change this resource'});
        }
        next();
    });
}

router.route('/users')
    .post((req, res, next) => {
        let user = new User(req.body);
        user.setPassword(req.body.password);
        user.save((err, doc) => {
            BoomHelper.apiResponseHandler(res, {user: doc, accessToken: user.generateJwt()}, err);
        })
    });

router.route('/user/id=:id')
    .get(jwtHelper.verifyJwtToken, (req, res, next) => {
        if (!ObjectId.isValid(req.params.id))
            return res.status(400).send('No record with given id: ' + req.params.id);
        User.findById(req.params.id, (err, doc) => {
            BoomHelper.apiResponseHandler(res, doc, err);
        });
    })
    .put(jwtHelper.verifyJwtToken, verifyUserAccess, (req, res, next) => {
        if (!ObjectId.isValid(req.params.id))
            return res.status(400).send('No record with given id: ' + req.params.id);
        User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }, (err, doc) => {
            BoomHelper.apiResponseHandler(res, doc, err);
        });
    })
    .delete(jwtHelper.verifyJwtToken, verifyUserAccess, (req, res, next) => {
        if (!ObjectId.isValid(req.params.id))
            return res.status(400).send('No record with given id: ' + req.params.id);
        User.findByIdAndRemove(req.params.id, (err, doc) => {
            BoomHelper.apiResponseHandler(res, doc, err);
        });
    });

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {session: false}, function(err, user, info) {
        if(err){
            return next(err);
        }
        if(user){
            return res.json({user: user, accessToken: user.generateJwt()});
        } else {
            return res.status(422).json(info);
        }
    })(req,res,next)
});

module.exports = router;
