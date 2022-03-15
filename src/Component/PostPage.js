import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import pic from '../res/profile2.png';
import Profile from './Profile';
import auth from './auth.js';

class convo extends Component {


    state = {
        page: "Post",
        title: "this is the title of page",
        user: auth.username,
        commenter: "user2",
        comment: "Nice!",
        caption: "This is a caption",
        imageUrl: "https://pbs.twimg.com/profile_images/596409682945802240/qZU_Qe7K_400x400.png",
        usercomment: null
    }


    async componentDidMount() {


        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getPosts",
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result.posts);
                    this.setState({
                        comment: result.posts[3].post_text,
                        caption: result.posts[10].post_text,

                    });
                },
                /*(error) => {
                    alert("error!");
                }*/
            );


        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getCompleteUsers",
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log();
                    this.setState({
                        user: result.users[3].name,
                        commenter: result.users[5].name
                    });
                },
                /*(error) => {
                    alert("error!");
                }*/
            );
    };



    swapProfile() { this.setState({ page: "Profile" }); }

    updateComment(event) {
        this.setState({
            usercomment: event.target.value
        })
    }

    handleComment() {
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "addOrEditPosts",
                postid: 1,
                userid: 1,
                posttype: "comment",
                posttext: this.usercomment,
                post_pic_url: "https://pbs.twimg.com/profile_images/596409682945802240/qZU_Qe7K_400x400.png",
                commentflag: 1
            })
        })
    }

    render() {
        return (
            <div className= "Postdiv">
                <div class="poster">
                    <div className="ping">
                        <div className="author">
                                <Link className="linkpro" to="/profile"> <img className="proflin" src={pic} /> </Link>
                                <p> {this.state.user} </p>
                            </div>
                        <img className="postImage" src={this.state.imageUrl} alt="descriptive caption" />
                        <p>{this.state.caption} </p>
                    </div>
                </div>

                <div class="postDiscuss">
                    
                    <div className="commentHistory">
                        <h1>Comments</h1>
                        <div className="commentBlock">
                            <div className="author">
                                <Link className="linkpro" to="/profile"> <img className="proflin" src={pic} /> </Link>
                                <p> {this.state.user} </p>
                            </div>
                            <p>
                                {this.state.comment}
                            </p>
                        </div>
                        <div className="commentBlock">
                            <div className="author">
                                <Link className="linkpro" to="/profile"> <img className="proflin" src={pic}  /> </Link>
                                <p> {this.state.user} </p>
                            </div>
                            <p>
                                {this.state.comment}
                            </p>
                        </div>
                    </div>
                    
                    <form>
                        <textarea wrap="hard" placeholder="Join the discussion" value={this.state.usercomment} ></textarea>
                        <input type="submit" placeholder="comment" onClick={this.handleComment()} />
                    </form>
                </div>
                
            </div>
        )
    }
};

export default convo