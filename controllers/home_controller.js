const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async (req, res) => {
    let posts = [];
    let users = [];
    try {
        posts = await Post.find({})
            .populate("user")
            .populate({
                path: "comments",
                populate: {
                    path: "user",
                },
            })
            .exec();
        users = await User.find({});
    } catch (err) {
        console.log(`Error pulling all Posts: ${err}`);
    }
    return res.render("home", {
        title: "Home",
        posts: posts,
        all_users: users,
    });
};
