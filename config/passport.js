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
      async (email, password, done) => {
        const userOnDB = await User.findOne({ EMAIL: email });
        const isSuccess = bcrypt.compareSync(password, userOnDB.PASSWORD); // True or False
        if (isSuccess) {
          done(null, userOnDB);
        } else {
          return done(null, false);
        }

        // console.log(await User.findOne({ email }));
        // async for login to be done before db access
        // process.nextTick(function () {
        //   // find user by email
        //   User.findOne({ "local.email": email }, function (err, user) {
        //     if (err) {
        //       return done(err);
        //     }
        //     // if no user is found send flash
        //     if (!user)
        //       return done(
        //         null,
        //         false,
        //         req.flash("loginMessage", "No user found.")
        //       );
        //     // if invalid password send flash
        //     if (!user.validPassword(password))
        //       return done(
        //         null,
        //         false,
        //         req.flash("loginMessage", "Oops! Wrong password.")
        //       );
        //     // else login successful
        //     else return done(null, user);
        //   });
        // });
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
