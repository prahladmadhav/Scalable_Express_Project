const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async (req, res) => {
    let posts = [];
    let users = [];
    try {
        posts = await Post.find({})
            .sort("-createdAt")
            .populate("user")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                },
            });
        try {
            users = await User.find({});
        } catch (err) {
            req.flash("error", `Error encountered loading users`);
            console.log(`Error pulling all Users: ${err}`);
        }
    } catch (err) {
        req.flash("error", `Error encountered loading posts`);
        console.log(`Error pulling all Posts: ${err}`);
    }
    return res.render("home", {
        title: "Home",
        posts: posts,
        all_users: users,
    });
};
