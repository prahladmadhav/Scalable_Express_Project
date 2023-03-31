const Post = require("../models/post");

module.exports.home = async (req, res) => {
    let posts = [];
    try {
        posts = await Post.find({}).populate("user").exec();
    } catch (err) {
        console.log(`Error pulling all Posts: ${err}`);
    }
    return res.render("home", {
        title: "Home",
        posts: posts
    });
};
