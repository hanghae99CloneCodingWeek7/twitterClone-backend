const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const User = require("../schemas/user");

module.exports = function (passport) {
  "google",
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: "/api/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          // console.log(accessToken);
          // console.log(refreshToken);

          const newUser = {
            GOOGLE_ID: profile.id,
            DISPLAY_NAME: profile.displayName,
            FIRST_NAME: profile.name.givenName,
            LAST_NAME: profile.name.familyName,
            EMAIL: profile.emails[0].value,
            PROFILE_PIC: profile.photos[0].value,
            REGISTER_FROM: "google",
          };
          try {
            let user = await User.findOne({ GOOGLE_ID: profile.id });

            if (user) {
              done(null, user);
            } else {
              user = await User.create(newUser);
              done(null, user);
            }
          } catch (error) {
            console.log(error);
          }
        }
      )
    );
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // override default fields in passport module
        usernameField: "EMAIL",
        passwordField: "PASSWORD",
        // pass in request from route to check if a user is logged in
        passReqToCallback: true,
      },

      async (req, email, password, done) => {
        try {
          const userOnDB = await User.findOne({ EMAIL: email });
          // console.log(userOnDB);
          const isSuccess = bcrypt.compareSync(password, userOnDB.PASSWORD); // True or False
          if (isSuccess) {
            done(null, userOnDB);
          } else {
            return done(null, false);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
