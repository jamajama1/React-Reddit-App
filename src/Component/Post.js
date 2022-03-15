import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: [],
            collections: [],
            comments: [],
            recents: [],

            postAuthor: [],
            default: [],

            postTitle: "",
            postImage: "",
            postContent: "",
            oneComment: "",

            date: new Date(),
            edit: false
        };
    }

    async componentDidMount() {
        // if URI doesnt exist
        this.getPost(this.props.match.params.id, input => {
            this.getUser(input);
        });
        this.getCollections(this.props.match.params.id);
        this.getComments(this.props.match.params.id);

        this.interval = setInterval(() => {
            this.getPost(this.props.match.params.id, input => {
                this.getUser(input);
            });
            this.getCollections(this.props.match.params.id);
            this.getComments(this.props.match.params.id);
        }, 4000)

    };
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // get post
    getPost(input, callback) {
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getPosts",
                postid: input
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(`getting post`);
                    console.info(result);
                    if (result.posts) {
                        this.setState({ post: result.posts[0] });
                        callback(result.posts[0].user_id);
                    }
                },
                (error) => { console.log(error) }
            );
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getPosts"
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(`getting post`);
                    console.info(result);
                    if (result.posts) {
                        this.setState({ recents: result.posts });
                    }
                },
                (error) => { console.log(error) }
            );
    }
    // get collections (tags)
    getCollections(input) {
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/ptcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getPostTags",
                postid: input
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(`getting collections`);
                    console.info(result);
                    if (result.post_tags) {
                        this.setState({ collections: result.post_tags });
                    }
                },
                (error) => { console.log(error) }
            );
    }
    // get comments
    getComments(input) {
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getPosts",
                parentid: input
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(`getting comments`);
                    console.info(result);
                    if (result.posts) {
                        this.setState({ comments: result.posts });
                    }
                },
                (error) => { console.log(error) }
            );
    }
    // get user
    getUser(input) {
        // get post author
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getUsers",
                userid: input
            })
        })
            .then((res) => res.json())
            .then(
                (result) => { this.setState({ postAuthor: result.users[0] }); },
                (error) => { console.log(error) }
            );


        // get default user
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getUsers",
                userid: sessionStorage.getItem("user")
            })
        })
            .then((res) => res.json())
            .then(
                (result) => { this.setState({ default: result.users[0] }); },
                (error) => { console.log(error) }
            );
    }


    // render comments
    renderComments() {
        if (this.state.comments) {
            return (
                <div className="postCommentHistory">{this.state.comments.map(comment => (
                    <div className="postComment" key={comment.post_id} >
                        <p className="content">
                            {comment.post_text}
                        </p>
                        <div className="postAuthor">
                            <Link to={`/profile/${comment.post_pic_url}`}>
                                <button className=" profileBar">
                                    <div className="roundProfile-mini">
                                        <img src="#" alt="temposasd" />
                                    </div>
                                    <p>{comment.post_type}</p>
                                </button>
                            </Link>
                            <p>{comment.timestamp}</p>
                        </div>
                    </div>
                ))}
                </div>
            )
        }
        else {
            return (
                <div className="postCommentHistory">
                    <p>loading comments ...</p>
                </div>
            )
        }
    }

    // render tags
    renderTags() {
        if (this.state.collections) {
            return (
                this.state.collections.map(tag => (
                    <button className="submitbutton type03" key={tag.post_tag_id}>{tag.tag}</button>
                ))
            )
        }
        else {
            return (
                <div className="postTags">
                    <p>loading tags ...</p>
                </div>
            )
        }
    }
    // render page
    renderPage() {
        return (
            <div>
                <div className="postLeft">
                    {this.state.default.user_id === this.state.post.user_id ?
                        <div className="userCard-buttons">
                            <button className="submitbutton type01" onClick={this.startEditsHandler.bind(this)}>Edit Post</button>
                        </div> : null
                    }
                    <div className="postCreator">
                        <h1 className="postTitle">{this.state.post.post_type}</h1>
                        <div className="postAuthor">
                            <Link to={`/profile/${this.state.postAuthor.username}`}>
                                <button className=" profileBar">
                                    <div className="roundProfile-mini">
                                        <img src="#" alt="temposasd" />
                                    </div>
                                    <p>{this.state.postAuthor.first_name} {this.state.postAuthor.last_name}</p>
                                </button>
                            </Link>
                            <p>{this.state.post.timestamp}</p>
                        </div>
                        <div className="postTags">
                            {this.renderTags()}
                        </div>
                    </div>
                    <div className="postContent">
                        <div className="postImage">
                            <img src={this.state.post.post_pic_url} alt="" />
                        </div>
                        <p className="content">
                            {this.state.post.post_text}
                        </p>
                    </div>
                </div>
                <div className="postRight">
                    {this.renderComments()}
                    <textarea id="averyveryspecialtextarea" aria-label={"comment textbox "} wrap="hard" onChange={this.myOneCommentHandler} placeholder={`There are currently ${this.state.post.comment_flag} comments. Join the discussion!`}></textarea>
                    <div class="userCard-buttons">
                        <button class="submitbutton type04" onClick={this.sendComment.bind(this)}>Comment</button>
                    </div>
                </div>
            </div>
        )
    }
    // render edit-page
    renderEditPage() {
        return (
            <div>
                <div className="postLeft">
                    <div className="userCard-buttons">
                        <button className="submitbutton type01" onClick={this.saveEditsHandler.bind(this)}>Save Edits</button>
                        <button className="submitbutton type01 warning" onClick={this.discardEditsHandler.bind(this)}>Discard Edits</button>
                        <button className="submitbutton type01 warning" onClick={this.deletePostHandler.bind(this)}>Delete Post</button>
                    </div>

                    <div className="postCreator">
                        <input className="edith1 postTitle" type="text" onChange={this.myTitleHandler} placeholder={this.state.post.post_type} />

                        <div className="postAuthor">
                            <button className=" profileBar">
                                <div className="roundProfile-mini">
                                    <img src="#" alt="temposasd" />
                                </div>
                                <p>{this.state.postAuthor.first_name} {this.state.postAuthor.last_name}</p>
                            </button>
                            <p>{this.state.post.timestamp}</p>
                        </div>
                        <div className="postTags">
                            {this.renderTags()}
                            <button className="submitbutton type03">+ add tag *coming soon*</button>
                        </div>
                    </div>
                    <div className="postContent">
                        <div className="postImage">
                            <input className="editp super img" type="text" onChange={this.myImageHandler} placeholder="paste new image link" />
                            <img src={this.state.post.post_pic_url} alt="" />
                        </div>
                        <div className="textareacontainer">
                            <textarea className="edittextarea" wrap="hard" onChange={this.myContentHandler} placeholder={this.state.post.post_text}>
                            </textarea>
                        </div>
                    </div>

                </div>
                <div className="postRight">
                    {this.renderComments()}
                    <textarea id="averyveryspecialtextarea" wrap="hard" onChange={this.myOneCommentHandler} placeholder={`There are currently ${this.state.post.comment_flag} comments. Join the discussion!`}></textarea>
                    <div class="userCard-buttons">
                        <button class="submitbutton type04" onClick={this.sendComment.bind(this)}>Comment</button>
                    </div>
                </div>
            </div>

        )
    }
    // render not-found-page
    renderNotFound() {
        return (
            <div className="postNotFound">
                <h1>POST NOT FOUND</h1>
                <p>Check out some of the most recent posts!</p>
                {this.renderPostPreviewBlock()}
            </div>
        )
    }
    // render post-preview block
    renderPostPreviewBlock() {
        if (this.state.recents) {
            return (
                <div className="postPreview">
                    {this.state.recents.map(post => (
                        <Link to={`/profile/${post.post_id}`}>
                            <div className="postPreview-block" key={post.post_id}>
                                <h4>{post.post_type}</h4>
                                {post.post_pic_url ?
                                    <img src={post.post_pic_url} alt={post.post_type} /> : null
                                }
                            </div>
                        </Link>
                    ))
                    }
                </div>
            );
        }
        else {
            return (
                <div>
                    <h3>User has yet to post something!</h3>
                </div>
            );
        }
    }

    // initiate edits button
    startEditsHandler() {
        this.setState({ edit: true })
    }
    // save edits button (POST REQUEST)
    saveEditsHandler() {
        let
            curDate = this.state.date,
            postTitle = this.state.postTitle,
            postContent = this.state.postContent,
            postImage = this.state.postImage,
            newDate = `${curDate.getFullYear()}-${`0${curDate.getMonth()}`.slice(-2)}-${`0${curDate.getDate()}`.slice(-2)} ${`0${curDate.getHours()}`.slice(-2)}:${`0${curDate.getMinutes()}`.slice(-2)}:${`0${curDate.getSeconds()}`.slice(-2)}`;

        if (this.state.postTitle === "") { postTitle = this.state.post.post_type }
        if (this.state.postContent === "") { postContent = this.state.post.post_text }
        if (this.state.postImage === "") { postImage = this.state.post.post_pic_url }

        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: `addOrEditPosts`,
                user_id: sessionStorage.getItem("user"),
                userid: sessionStorage.getItem("user"),
                session_token: sessionStorage.getItem("token"),
                postid: this.state.post.post_id,
                posttype: postTitle,
                posttext: postContent,
                postpicurl: postImage,
                commentflag: this.state.post.comment_flag,
                timestamp: newDate,
            })
        });
        this.setState({ edit: false })
    }
    // discard edits button
    discardEditsHandler() {
        this.setState({ edit: false, message: "fields left blank will not be updated" })
    }
    // delete post handler
    deletePostHandler() {
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: `addOrEditPosts`,
                user_id: sessionStorage.getItem("user"),
                session_token: sessionStorage.getItem("token"),
                postid: this.state.post.post_id
            })
        });
        this.props.history.push("/feed");
    }
    // edit title handler 
    myTitleHandler = event => {
        this.setState({ postTitle: event.target.value });
    };
    // edit image handler
    myImageHandler = event => {
        this.setState({ postImage: event.target.value });
    };
    // edit content handler
    myContentHandler = event => {
        this.setState({ postContent: event.target.value });
    };

    // comment handler
    myOneCommentHandler = event => {
        this.setState({ oneComment: event.target.value });
    };
    // send comment button
    sendComment() {
        let curDate = this.state.date, newDate;
        newDate = `${curDate.getFullYear()}-${`0${curDate.getMonth()}`.slice(-2)}-${`0${curDate.getDate()}`.slice(-2)} ${`0${curDate.getHours()}`.slice(-2)}:${`0${curDate.getMinutes()}`.slice(-2)}:${`0${curDate.getSeconds()}`.slice(-2)}`;

        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "addOrEditPosts",
                user_id: sessionStorage.getItem("user"),
                userid: sessionStorage.getItem("user"),
                session_token: sessionStorage.getItem("token"),
                parentid: this.state.post.post_id,
                posttext: this.state.oneComment,
                posttype: `${this.state.default.first_name} ${this.state.default.last_name}`,
                postpicurl: this.state.default.username,
                timesetamp: newDate,
            })
        });
        this.setState({ oneComment: "" });
        document.getElementById("averyveryspecialtextarea").value = "";
    }


    render() {

        return (
            <main className="post">
                {this.state.post.length !== 0 && !this.state.edit ?
                    this.renderPage() : null
                }
                {this.state.post.length !== 0 && this.state.edit ?
                    this.renderEditPage() : null
                }
                {this.state.post.length === 0 ?
                    this.renderNotFound() : null
                }
            </main>
        );
    }
}

export default withRouter(Post);