const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
        },
        async (email, password, done) => {
            try {
                let user = await User.findOne({ email: email });
                if (!user || user.password != password) {
                    console.log("Invalid Username/Password");
                    return done(null, false);
                }
                return done(null, user);
            } catch (err) {
                console.log(`Error in finding user ${err}`);
                return done(err);
            }
        }
    )
);
// serializing user to decide which key is to be kept in the cookies
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// deserializing user from the key in the cookies
passport.deserializeUser(async (id, done) => {
    try {
        let user = await User.findById(id);
        return done(null, user);
    } catch (err) {
        console.log(`Error in finding user ${err}`);
        return done(err);
    }
});

module.exports = passport;
