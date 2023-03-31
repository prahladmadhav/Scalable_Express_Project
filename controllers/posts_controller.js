const Post = require("../models/post");

module.exports.create = async (req, res) => {
    try {
        console.log(req.user);
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id,
        });
        console.log(`Post created: ${post.id}`);
    } catch (err) {
        console.log(`Error Creating a Post: ${err}`);
    }
    return res.redirect("back");
};
