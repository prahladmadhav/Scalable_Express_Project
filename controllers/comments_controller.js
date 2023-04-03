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
            // // latest comment at the end
            // post.comments.push(comment._id);
            // latest comment at the start
            post.comments.splice(0, 0, comment._id);
            post.save();
            console.log(`Comment(${comment.id}) linked to Post(${req.body.post})`);
            if (req.xhr) {
                await comment.populate("user");
                return res.status(200).json({
                    data: {
                        comment: comment,
                    },
                    message: "Comment created",
                });
            }
            req.flash("success", `Comment created`);
        } else {
            req.flash("error", `Error finding post`);
            console.log(`No post found for ID: ${req.body.post}`);
        }
    } catch (err) {
        req.flash("error", `Error encountered`);
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
                if (req.xhr) {
                    return res.status(200).json({
                        data: {
                            comment_id: comment._id,
                        },
                        message: "Comment deleted",
                    });
                }
                req.flash("success", `Comment deleted`);
            } else {
                req.flash("error", `Unauthorized to delete comment`);
                console.log(`User(${req.user.id}) is not authorized to delete Comment(${comment.id})`);
            }
        } else {
            req.flash("error", `Error finding comment`);
            console.log(`Comment not found for ID: ${req.param.id}`);
        }
    } catch (err) {
        req.flash("error", `Error encountered`);
        console.log(`Error Deleting comment: ${err}`);
    }
    res.redirect("back");
};
