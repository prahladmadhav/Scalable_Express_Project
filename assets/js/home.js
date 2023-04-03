class PostComments {
    constructor(postId) {
        this.postId = postId;
        this.commentsContainer = $(`#post-${postId}-comments`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
        this.createComment();
        let thisPostComments = this;
        $(" .delete-comment-button", this.commentsContainer).each(function () {
            thisPostComments.deleteComment($(this));
        });
    }
    createComment() {
        let thisPostComments = this;
        thisPostComments.newCommentForm.submit((e) => {
            e.preventDefault();
            $.ajax({
                type: "post",
                url: "/comments/create",
                data: thisPostComments.newCommentForm.serialize(),
                success: (data) => {
                    let newComment = thisPostComments.newCommentDom(data.data.comment);
                    thisPostComments.commentsContainer.prepend(newComment);
                    thisPostComments.deleteComment($(" .delete-comment-button", newComment));
                    customNotyFM("success", data.message);
                },
                error: (error) => {
                    console.log(error.responseText);
                },
            });
        });
    }
    newCommentDom(comment) {
        return $(`
        <li id="post-comment-${comment._id}">
            <p>
                <small>
                    <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                </small>
            </p>
            <p>
                ${comment.content}
                <br>
                <small>
                    ${comment.user.name}
                </small>
            </p>
        </li>
        `);
    }
    deleteComment(deleteLink) {
        let thisdeleteLink = $(deleteLink);
        thisdeleteLink.click((e) => {
            e.preventDefault();
            $.ajax({
                type: "get",
                url: thisdeleteLink.prop("href"),
                success: (data) => {
                    $(`#post-comment-${data.data.comment_id}`).remove();
                    customNotyFM("success", data.message);
                },
                error: (error) => {
                    console.log(error.responseText);
                },
            });
        });
    }
}
class Posts {
    constructor() {
        this.createPost();
        this.convertPostsToAjax();
    }
    createPost() {
        let thisPosts = this;
        let newPostForm = $("#new-post-form");
        newPostForm.submit((e) => {
            e.preventDefault();
            $.ajax({
                type: "post",
                url: "/posts/create",
                data: newPostForm.serialize(),
                success: (data) => {
                    let newPost = thisPosts.newPostDom(data.data.post);
                    $("#posts-list-container>ul").prepend(newPost);
                    thisPosts.deletePost($(" .delete-post-button", newPost));
                    customNotyFM("success", data.message);
                },
                error: (error) => {
                    console.log(error.responseText);
                },
            });
        });
    }
    newPostDom(post) {
        return $(`
            <li id="post-${post._id}">
                <p>
                    <p>
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                        </small>
                    </p>
                    ${post.content}
                    <br>
                    <small>${post.user.name}</small>
                </p>
                <div class="post-comments">
                    <form action="/comments/create" method="post">
                        <input type="text" name="content" placeholder="Type here to add comments..." required />
                        <input type="hidden" name="post" value="${post._id}" />
                        <input type="submit" value="Add Comment">
                    </form>                                
                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}"></ul>
                    </div>
                </div>
            </li>  
        `);
    }
    deletePost(deleteLink) {
        $(deleteLink).click((e) => {
            e.preventDefault();
            $.ajax({
                type: "get",
                url: $(deleteLink).prop("href"),
                success: (data) => {
                    $(`#post-${data.data.post_id}`).remove();
                    customNotyFM("success", data.message);
                },
                error: (error) => {
                    console.log(error.responseText);
                },
            });
        });
    }
    convertPostsToAjax() {
        let thisPosts = this;
        $("#posts-list-container>ul>li").each(function () {
            let self = $(this);
            let deleteButton = $(" .delete-post-button", self);
            thisPosts.deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop("id").split("-")[1];
            new PostComments(postId);
        });
    }
}
new Posts();
