import React, { Component } from 'react';
import PostPage from './PostPage';
import { Link } from 'react-router-dom';

// images for the configuration buttons
import config00full from '../res/configs/00full.png'
import config01splits from '../res/configs/01splits.png'
import config02splits from '../res/configs/02splits.png'
import config03thirds from '../res/configs/03thirds.png'
import config04thirds from '../res/configs/04thirds.png'
import config05thirds from '../res/configs/05thirds.png'
import config06thirds from '../res/configs/06thirds.png'
import config07quarters from '../res/configs/07quarters.png'



class post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "Feed",
            currentUser: sessionStorage.getItem("user"),
            sessionToken: sessionStorage.getItem("session"),
            usercomment: null,
            postd: 0,
            friends: [],
            posts: [],
            listType: props.listType,
            users: [],

            config: "config00full",
            container0: [],
            container1: [],
            container2: [],
            container3: [],

            feed0: "t/science",
            feed1: "t/art",
            feed2: "t/technology",
            feed3: "t/business",
        };
    }


    componentDidMount() {
        this.loadPosts();
        this.loadCollections();
        this.loadUsers();
    }


    loadPosts() {
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getPosts",

            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);

                    this.setState({
                        posts: result.posts
                    });
                },
                (error) => {
                    alert("error!");
                }
            );
    };

    loadCollections() {
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getPosts",
                tag: this.state.feed0
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({ container0: result.posts });
                }
            );
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getPosts",
                tag: this.state.feed1
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log("container1");
                    console.info(result)
                    this.setState({ container1: result.posts });
                }
            );
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getPosts",
                tag: this.state.feed2
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({ container2: result.posts });
                }
            );
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getPosts",
                tag: this.state.feed3
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({ container3: result.posts });
                }
            );
    };

    loadUsers() {
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getUsers",
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);

                    this.setState({
                        users: result.users
                    });
                },
                (error) => {
                    alert("error!");
                }
            );
    };

    getFriendsPosts() {

        for (var i = 0; i < this.state.friends.length; i++) {
            console.log(this.state.friends[i].connect_user_id)
            fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
                method: "post",
                body: JSON.stringify({
                    action: "getConnectionPosts",
                    timestamp: "01-JAN-2020 00:00:00",
                    maxposts: 20
                })
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        console.log(result);
                        this.setState({

                        });
                    },
                    (error) => {
                        alert("error!");
                    }
                );
        }
    };

    forceRefresh() {
        this.loadPosts();
        this.loadCollections();
    };

    selectConfig(event) {
        console.info(event.target.id.toString());
        if (event.target.id === "config00full") { this.setState({ config: event.target.id }) }
        else if (event.target.id === "config01splits") { this.setState({ config: event.target.id }) }
        else if (event.target.id === "config02splits") { this.setState({ config: event.target.id }) }
        else if (event.target.id === "config03thirds") { this.setState({ config: event.target.id }) }
        else if (event.target.id === "config04thirds") { this.setState({ config: event.target.id }) }
        else if (event.target.id === "config05thirds") { this.setState({ config: event.target.id }) }
        else if (event.target.id === "config06thirds") { this.setState({ config: event.target.id }) }
        else if (event.target.id === "config07quarters") { this.setState({ config: event.target.id }) }
        else if (event.target.id === "config07quarters") { this.setState({ config: event.target.id }) }
    };
    renderContent(input, collectionName, collectionContent) {
        if (collectionContent) {
            return (
                <div className={`container ${input}`}>
                    <div className="feedTitle">
                        <h1>{collectionName}</h1>
                    </div>
                    <div className="feedWrap">
                        {collectionContent.map(post => (
                            <Link className="" to={`/post/${post.post_id}`}>
                                <div className="postBlock">
                                    <div className="postBlockNext">
                                        <header> Post made by User: {post.user_id} </header>
                                        <img className="specImg" aria-label={"posted image"} src={post.post_pic_url} alt={post.post_id} />
                                        <div className="captione">
                                            <p> {post.post_text} </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className={`container ${input}`}>
                    <div className="feedTitle">
                        <h1>{collectionName}</h1>
                    </div>
                    <div className="feedWrap">

                        <p>this topix has no posts!</p>

                    </div>
                </div>
            )
        }
    };

    render() {
        const { posts, users } = this.state;
        return (
            <main className="feed">
                <div className="feedSettings">
                    <button className="submitbutton type05" id="config00full" onClick={this.selectConfig.bind(this)}><img src={config00full} alt="config00full" id="config00full" onClick={this.selectConfig.bind(this)} /></button>
                    <button className="submitbutton type05" id="config01splits" onClick={this.selectConfig.bind(this)}><img src={config01splits} alt="config01splits" id="config01splits" onClick={this.selectConfig.bind(this)} /></button>
                    <button className="submitbutton type05" id="config02splits" onClick={this.selectConfig.bind(this)}><img src={config02splits} alt="config02splits" id="config02splits" onClick={this.selectConfig.bind(this)} /></button>
                    <button className="submitbutton type05" id="config03thirds" onClick={this.selectConfig.bind(this)}><img src={config03thirds} alt="config03thirds" id="config03thirds" onClick={this.selectConfig.bind(this)} /></button>
                    <button className="submitbutton type05" id="config04thirds" onClick={this.selectConfig.bind(this)}><img src={config04thirds} alt="config04thirds" id="config04thirds" onClick={this.selectConfig.bind(this)} /></button>
                    <button className="submitbutton type05" id="config05thirds" onClick={this.selectConfig.bind(this)}><img src={config05thirds} alt="config05thirds" id="config05thirds" onClick={this.selectConfig.bind(this)} /></button>
                    <button className="submitbutton type05" id="config06thirds" onClick={this.selectConfig.bind(this)}><img src={config06thirds} alt="config06thirds" id="config06thirds" onClick={this.selectConfig.bind(this)} /></button>
                    <button className="submitbutton type05" id="config07quarters" onClick={this.selectConfig.bind(this)}><img src={config07quarters} alt="config07quarters" id="config07quarters" onClick={this.selectConfig.bind(this)} /></button>
                    <button className="submitbutton type03b" onClick={this.forceRefresh.bind(this)}>Force Refresh</button>
                </div>
                <div className="feedConfig">

                    {this.state.config === "config00full" ?
                        <div>
                            {this.renderContent("full", "All Posts", this.state.posts)}
                        </div> : null
                    }
                    {this.state.config === "config01splits" ?
                        <div>
                            {this.renderContent("tall", "All Posts", this.state.posts)}
                            {this.renderContent("tall", this.state.feed0, this.state.container0)}
                        </div> : null
                    }
                    {this.state.config === "config02splits" ?
                        <div>
                            {this.renderContent("wide", "All Posts", this.state.posts)}
                            {this.renderContent("wide", this.state.feed0, this.state.container0)}
                        </div> : null
                    }
                    {this.state.config === "config03thirds" ?
                        <div>
                            {this.renderContent("tall", "All Posts", this.state.posts)}
                            <div className="container2 tall">
                                {this.renderContent("wide", this.state.feed0, this.state.container0)}
                                {this.renderContent("wide", this.state.feed1, this.state.container1)}
                            </div>
                        </div> : null
                    }
                    {this.state.config === "config04thirds" ?
                        <div>
                            <div className="container2 tall">
                                {this.renderContent("wide", "All Posts", this.state.posts)}
                                {this.renderContent("wide", this.state.feed0, this.state.container0)}
                            </div>
                            {this.renderContent("tall", this.state.feed1, this.state.container1)}
                        </div> : null
                    }
                    {this.state.config === "config05thirds" ?
                        <div>
                            {this.renderContent("wide", "All Posts", this.state.posts)}
                            <div className="container2 wide">
                                {this.renderContent("tall", this.state.feed0, this.state.container0)}
                                {this.renderContent("tall", this.state.feed1, this.state.container1)}
                            </div>
                        </div> : null
                    }
                    {this.state.config === "config06thirds" ?
                        <div>
                            <div className="container2 wide">
                                {this.renderContent("tall", "All Posts", this.state.posts)}
                                {this.renderContent("tall", this.state.feed0, this.state.container0)}
                            </div>
                            {this.renderContent("wide", this.state.feed1, this.state.container1)}
                        </div> : null
                    }
                    {this.state.config === "config07quarters" ?
                        <div>
                            <div className="container2 wide">
                                {this.renderContent("tall", "All Posts", this.state.posts)}
                                {this.renderContent("tall", this.state.feed0, this.state.container0)}
                            </div>
                            <div className="container2 wide">
                                {this.renderContent("tall", this.state.feed1, this.state.container1)}
                                {this.renderContent("tall", this.state.feed2, this.state.container2)}
                            </div>
                        </div> : null
                    }


                </div>
            </main>
        )
    }
};

export default post;


/*
{
    this.state.page === 'Profile' ?
        null :
        <div>
            <div className="feedTitle">
                <h1>Popular Feed</h1>
            </div>
            <div className="postBlock">
                <div className="postContent">
                    <h4 onClick={this.swapProfile.bind(this)}>{this.state.user2}</h4>
                    <img className="specImg" onClick={this.swapProfile.bind(this)} src={this.state.imageUrl2}/>
                    <img className="specImg" onClick={this.swapProfile.bind(this)} src={this.state.imageUrl5}/>
                    <p className="message">{this.state.comment2}</p>
                </div>
            </div>
        </div>
}




        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getCompleteUsers",
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        user: result.users[3].name,
                        user2: result.users[5].name,
                        friends: result.users[0].connections,
                    });
                    console.log(this.state.friends);
                    this.getFriendsPosts();
                },
                (error) => {
                    //alert("error!");
                }
            );

*/