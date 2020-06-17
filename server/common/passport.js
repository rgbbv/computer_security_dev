let passport = require('passport');
let LocalStrategy = require('passport-local');
let mongoose = require('mongoose');
let User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'ae',
    passwordField: 'password'
    }, (ae, password, done) => {
        User.findOne({ae: ae}).then((user) => {
            if(!user || !user.validPassword(password)){
                return done(null, false, {errorMessage: "email or password is invalid."})
            }
            return done(null, user);
        }).catch(done);
    }));