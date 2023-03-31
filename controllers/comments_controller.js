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
module.exports.destroy = async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.id);
        if (comment) {
            if (comment.user == req.user.id) {
                await Comment.findByIdAndDelete(comment._id);
                console.log(`Deleted Comment: ${req.params.id}`);
                await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
                console.log(`Deleted Comment(${comment._id}) reference from Post(${comment.post})`);
            } else {
                console.log(`User(${req.user.id}) is not authorized to delete Comment(${comment.id})`);
            }
        } else {
            console.log(`Comment not found for ID: ${req.param.id}`);
        }
    } catch (err) {
        console.log(`Error Deleting comment: ${err}`);
    }
    res.redirect("back");
};
