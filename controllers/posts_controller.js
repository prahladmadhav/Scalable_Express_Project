const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async (req, res) => {
    try {
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
module.exports.destroy = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (post) {
            if (post.user == req.user.id) {
                await Post.deleteOne({_id: post._id});
                console.log(`Deleted Post: ${req.params.id}`);
                await Comment.deleteMany({post: req.params.id});
                console.log(`Deleted Comments linked to Post: ${req.params.id}`);
            } else {
                console.log(`User(${req.user.id}) is not authorized to delete Post(${post.id})`);
            }
        } else {
            console.log(`Post not found for ID: ${req.params.id}`);
        }
    } catch (err) {
        console.log(`Error Deleting Post: ${err}`);
    }
    return res.redirect("back");
};
