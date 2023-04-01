const User = require("../models/user");

// render the profile page
module.exports.profile = async (req, res) => {
    try {
        let profileUser = await User.findById(req.params.id);
        if (profileUser) {
            return res.render("user_profile", {
                title: "User",
                profile_user: profileUser,
            });
        } else {
            console.log(`User(${req.params.id}) was not found`);
        }
    } catch (err) {
        console.log(`Error Loading profile page: ${err}`);
    }
    return res.redirect("back");
};
// render the sign in page
module.exports.signIn = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return res.render("user_sign_in", {
        title: "Sign In",
    });
};
// render the sign up page
module.exports.signUp = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
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
    req.flash("success", "Logged in successfully");
    return res.redirect("/");
};
// create sign out action
module.exports.destroySession = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You have Logged out");
        res.redirect("/");
    });
};
// update user data
module.exports.update = async (req, res) => {
    try {
        if (req.user.id == req.params.id) {
            await User.findByIdAndUpdate(req.params.id, req.body);
            console.log(`User(${req.params.id}) has been updated`);
        } else {
            console.log(`User(${req.params.id}) does not match User(${req.user.id}), hence not allowed to update`);
            return res.status(401).send("Unauthorized");
        }
    } catch (err) {
        console.log(`Error Update User(${req.params.id}) Data: ${err}`);
    }
    return res.redirect("back");
};
