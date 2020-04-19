let express = require('express');
let router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const passport = require('passport');
const User = require('../models/user');
const jwtHelper = require('../helpers/jwtHelper');
const BoomHelper = require("../helpers/BoomHelper");
const {verifyUserAccess} = require("../controllers/user.controller");
const PassVault = require('../models/passVault');
const axios = require('axios');

router.route('/users')
    .post((req, res, next) => {
        let user = new User(req.body);
        user.setPassword(req.body.password);
        user.save()
            .then((doc) => res.status(200).json({user: doc, accessToken: user.generateJwt({id: doc.id,
                    authenticate: true})}))
            .catch((err) => res.status(500).json({errorMessage: "Internal server error"}))
    });

router.route('/user/:userId')
    .put(jwtHelper.verifyJwtToken, verifyUserAccess, (req, res, next) => {
        if (!ObjectId.isValid(req.params.userId))
            return res.status(400).send('No record with given id: ' + req.params.userId);
        User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true }, (err, doc) => {
            BoomHelper.apiResponseHandler(res, doc, err);
        });
    })
    .delete(jwtHelper.verifyJwtToken, verifyUserAccess, (req, res, next) => {
        if (!ObjectId.isValid(req.params.userId))
            return res.status(400).send('No record with given id: ' + req.params.userId);
        User.findByIdAndRemove(req.params.userId, (err, doc) => {
            BoomHelper.apiResponseHandler(res, doc, err);
        });
    });

router.route('/user/:userId/notification/:notificationId')
    .put(jwtHelper.verifyJwtToken, verifyUserAccess, (req, res, next) => {
        if (!ObjectId.isValid(req.params.userId))
            return res.status(400).send('No record with given id: ' + req.params.userId);

        const filter = {'_id': req.params.userId, 'notifications._id': req.params.notificationId};
        const update = Object.entries(req.body).reduce((acc, [k, v]) => {
            acc['notifications.$.' + k] = v;
            return acc
        }, {});
        User.findOneAndUpdate(filter, {$set: update}, {new: true}).exec()
            .then((doc) => res.status(200).json(doc))
            .catch((err) => res.status(500).send(err));
    });

router.route('/user/:userId/password/:passwordId')
    .put(jwtHelper.verifyJwtToken, verifyUserAccess, (req, res, next) => {
        if (!ObjectId.isValid(req.params.userId))
            return res.status(400).send('No record with given id: ' + req.params.userId);

        const filter = {'_id': req.params.userId, 'passwords._id': req.params.passwordId};
        const update = Object.entries(req.body).reduce((acc, [k, v]) => {
            acc['passwords.$.' + k] = v;
            return acc
        }, {});
        User.findOneAndUpdate(filter, {$set: update}, {new: true}).exec()
            .then((doc) => res.status(200).json(doc))
            .catch((err) => res.status(500).send(err));
    });

router.route('/user/:userId/passwords')
    .post(jwtHelper.verifyJwtToken, verifyUserAccess, (req, res, next) => {
        if (!ObjectId.isValid(req.params.userId))
            return res.status(400).send('No record with given id: ' + req.params.userId);

        let password = new PassVault(req.body);
        User.findByIdAndUpdate(req.params.userId, {$push: {passwords: password}}, {new: true},
            (err, doc) => {
                BoomHelper.apiResponseHandler(res, doc, err);
            });
    });

router.post('/user/login', (req, res, next) => {
    passport.authenticate('local', {session: false}, function(err, user, info) {
        if (err){
            return next(err);
        }
        if (user){
            // If the user enabled 2-steps verification then dont return his details just yet, send a limited accessToken
            if (!user.security.twoStepsVerification) {
                return res.json({user: user, accessToken: user.generateJwt({ id: user.id, authenticate: true })})
            } else {
                return res.json({user: {security: {twoStepsVerification: true}},
                    accessToken: user.generateJwt({ id: user.id, authenticate: false })})
            }
        } else {
            return res.status(422).json(info);
        }
    })(req,res,next)
});

router.post('/user/validate', jwtHelper.verifyJwtToken, (req, res, next) => {
    // takes user id from the token
    User.findById(req.id).exec()
        .then((user) => {
            axios({
                method: 'get',
                url: "https://www.authenticatorApi.com/Validate.aspx",
                params: {Pin: req.query.pin, SecretCode: user.security.secret}
            }).then((result) => {
                if (result["data"] === "True") {
                    res.json({user: user, accessToken: user.generateJwt({ id: user.id, authenticate: true })});
                } else{
                    res.status(422).json({errorMessage: "PIN Rejected"})
                }
            }).catch((err) => {
                res.status(500).json({errorMessage: "Internal server error"});
            });
        })
        .catch((err) => {
            res.status(500).json({errorMessage: "Internal server error"});
        })
});

module.exports = router;
