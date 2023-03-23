const User = require("../models/user");

// render the profile page
module.exports.profile = async (req, res) => {
    // return res.render("user_profile", {
    //     title: "User",
    // });
    if (req.cookies.user_id) {
        try {
            let user = await User.findById(req.cookies.user_id);
            if (!user) {
                console.log("User doesn't exist!");
                return res.redirect("/users/sign-in");
            }
            return res.render("user_profile", {
                title: "User",
                user: {
                    name: user.name,
                },
            });
        } catch (err) {
            console.log(`Error in finding user ${err}`);
            return res.redirect("/users/sign-in");
        }
    } else {
        return res.redirect("/users/sign-in");
    }
};
// render the sign in page
module.exports.signIn = (req, res) => {
    return res.render("user_sign_in", {
        title: "Sign In",
    });
};
// render the sign up page
module.exports.signUp = (req, res) => {
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
    return res.redirect("/");
};
