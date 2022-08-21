const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../schemas/user");

module.exports = function (passport) {
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

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
