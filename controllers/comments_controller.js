const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = async (req, res) => {
    try {
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            });
            console.log(`Comment created: ${comment.id}`);
            post.comments.push(comment._id);
            post.save();
            console.log(`Comment(${comment.id}) linked to Post(${req.body.post})`);
        } else {
            console.log(`No post found for ID: ${req.body.post}`);
        }
    } catch (err) {
        console.log(`Error creating comment: ${err}`);
    }
    res.redirect("back");
};
