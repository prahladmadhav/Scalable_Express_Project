const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async (req, res) => {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id,
        });
        if (req.xhr) {
            // post = await Post.findById(post._id).populate("user");
            post = await post.populate("user");
            return res.status(200).json({
                data: {
                    post: post,
                },
                message: "Post created",
            });
        }
        req.flash("success", `Post created`);
        console.log(`Post created: ${post.id}`);
    } catch (err) {
        req.flash("error", `Error encountered`);
        console.log(`Error Creating a Post: ${err}`);
    }
    return res.redirect("back");
};
module.exports.destroy = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (post) {
            if (post.user == req.user.id) {
                await Post.deleteOne({ _id: post._id });
                console.log(`Deleted Post: ${req.params.id}`);
                await Comment.deleteMany({ post: req.params.id });
                if (req.xhr) {
                    return res.status(200).json({
                        data: {
                            post_id: req.params.id,
                        },
                        message: "Post and internal comments deleted",
                    });
                }
                console.log(`Deleted Comments linked to Post: ${req.params.id}`);
                req.flash("success", `Post and internal comments deleted`);
            } else {
                req.flash("error", `Unauthorized to delete post`);
                console.log(`User(${req.user.id}) is not authorized to delete Post(${post.id})`);
            }
        } else {
            req.flash("error", `Error finding post`);
            console.log(`Post not found for ID: ${req.params.id}`);
        }
    } catch (err) {
        req.flash("error", `Error encountered`);
        console.log(`Error Deleting Post: ${err}`);
    }
    return res.redirect("back");
};
