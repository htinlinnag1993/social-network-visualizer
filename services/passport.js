const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id);``
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback',
        proxy: true
    }, async (accessToken, refreshToken, profile, done) => {
        // console.log('access token: ', accessToken);
        // console.log('refresh token: ', refreshToken);
        console.log('profile: ', profile.emails[0].value);
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
            // we already have a record with the given profile id
            done(null, existingUser);
        } else {
            // we don't have a user record with this ID, make a new record
            const  newUser = await new User({ 
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value
            }).save();
            done(null, newUser);
        }
        
    })
);