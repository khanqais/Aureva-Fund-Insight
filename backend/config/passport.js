const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if a user with this Google ID already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Existing Google user — just return them
          return done(null, user);
        }

        // Check if there's an existing account with the same email
        // (user might have registered with email/password before)
        const email = profile.emails?.[0]?.value;
        user = await User.findOne({ email });

        if (user) {
          // Link Google ID to existing account
          user.googleId = profile.id;
          user.avatar = profile.photos?.[0]?.value;
          await user.save();
          return done(null, user);
        }

        // Brand new user — create account from Google profile
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email,
          avatar: profile.photos?.[0]?.value,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Passport session serialization (required even if we use JWT later)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
