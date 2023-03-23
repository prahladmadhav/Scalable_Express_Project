const User = require("../models/user");

// render the profile page
module.exports.profile = async (req, res) => {
    return res.render("user_profile", {
        title: "User",
    });
};
// render the sign in page
module.exports.signIn = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/users/profile");
    }
    return res.render("user_sign_in", {
        title: "Sign In",
    });
};
// render the sign up page
module.exports.signUp = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/users/profile");
    }
    return res.render("user_sign_up", {
        title: "Sign Up",
    });
};
// gets sign up data
module.exports.create = async (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        console.log("Password does not match");
        return res.redirect("back");
    }
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            console.log("User already exists!");
            return res.redirect("back");
        }
        try {
            let user = await User.create(req.body);
            console.log("User created");
            return res.redirect("/users/sign-in");
        } catch {
            console.log("Error in creating user");
            return res.redirect("back");
        }
    } catch {
        console.log("Error in finding user");
        return res.redirect("back");
    }
};
// sign in and create a session for the user
module.exports.createSession = (req, res) => {
    return res.redirect("/users/profile");
};
// create sign out action
module.exports.destroySession = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};
