let passport = require('passport');
let LocalStrategy = require('passport-local');
let mongoose = require('mongoose');
let User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    }, function(email, password, done) {
        User.findOne({email: email}).then(function(user){
            if(!user || !user.validPassword(password)){
                return done(null, false, {errorMessage: "email or password is invalid."})
            }
            return done(null, user);
        }).catch(done);
    }));