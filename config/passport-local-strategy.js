const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/user");

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passReqToCallback: true,
        },
        async (req, email, password, done) => {
            try {
                let user = await User.findOne({ email: email });
                if (!user || user.password != password) {
                    req.flash("error", "Invalid Username/Password");
                    return done(null, false);
                }
                return done(null, user);
            } catch (err) {
                console.log(`Error in finding user ${err}`);
                req.flash("error", `Error encountered`);
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
// Check if the user is authenticated
passport.checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/users/sign-in");
};
// send User data from req to response local
passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
};

module.exports = passport;
