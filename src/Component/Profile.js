import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            default: null,
            defaultid: null,
            user: null,
            userid: null,

            edit: false,
            connection: false,
            defaultnet: "loading connections ... ",
            userlinks: "profile links coming soon",
            userposts: [],
            userpfp: "",
            pfpid: "",

            username: "",
            firstname: "",
            lastname: "",
            userbio: "",
            bioid: "",

            message: "fields left blank will not be updated",
        };
    }

    async componentDidMount() {

        // if URI doesnt exist
        if (this.props.match.path.length < 9) {
            // get all account info
            this.getUserData(sessionStorage.getItem("user"));
        }

        // if URI does exist
        else if (9 <= this.props.match.path.length) {
            this.checkUserExists(this.props.match.params.id, (input) => {

                // if account does exist
                if (input.users) {
                    // get all account info
                    console.log(`below is input form callback function`)
                    console.info(input)
                    this.getUserData(input.users[0].user_id);
                }

                // if account doesnt exist
                else {
                    // nothing lol
                }
            })
        }

        this.interval = setInterval(() => {

            // if URI doesnt exist
            if (this.props.match.path.length < 9) {
                // get all account info
                this.getUserData(sessionStorage.getItem("user"));
            }

            // if URI does exist
            else if (9 <= this.props.match.path.length) {
                this.checkUserExists(this.props.match.params.id, (input) => {

                    // if account does exist
                    if (input.users) {
                        // get all account info
                        console.log(`below is input form callback function`)
                        console.info(input)
                        this.getUserData(input.users[0].user_id);
                    }

                    // if account doesnt exist
                    else {
                        // nothing lol
                    }
                })
            }
        }, 4000)
    };
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // checking to see if user exists
    checkUserExists(input, callback) {
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getUsers",
                username: input
            })
        })
            .then((res) => res.json())
            .then(
                (result) => { callback(result); },
                (error) => { console.log(error) }
            );
    }


    // fetching user data given userid
    getUserData(input) {
        // fetches user data
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getCompleteUsers",
                userid: input
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);

                    // store the entire user
                    this.setState({
                        user: result.users[0],
                        userid: result.users[0].user_id
                    })

                    // fetch user profile picture
                    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/uacontroller.php", {
                        method: "post",
                        body: JSON.stringify({
                            action: "getUserArtifacts",
                            artifacttype: "image",
                            artifactcategory: "profile pictures",
                            userid: result.users[0].user_id
                        })
                    })
                        .then((res2) => res2.json())
                        .then(
                            (result2) => {
                                if (result2.user_artifacts) {
                                    this.setState({ userpfp: result2.user_artifacts[0].artifact_url, pfpid: result2.user_artifacts[0].artifact_id })
                                }
                            },
                            (error2) => {
                                console.info(error2)
                            }
                        );

                    // fetch user bio
                    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/uacontroller.php", {
                        method: "post",
                        body: JSON.stringify({
                            action: "getUserArtifacts",
                            artifacttype: "text",
                            artifactcategory: "bio",
                            userid: result.users[0].user_id
                        })
                    })
                        .then((res2) => res2.json())
                        .then(
                            (result2) => {
                                if (result2.user_artifacts) {
                                    this.setState({ userbio: result2.user_artifacts[0].artifact_url, bioid: result2.user_artifacts[0].artifact_id })
                                }
                            },
                            (error2) => {
                                console.info(error2)
                            }
                        );

                    // fetch user posts
                    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
                        method: "post",
                        body: JSON.stringify({
                            action: "getPosts",
                            userid: this.state.userid,
                        })
                    })
                        .then((res3) => res3.json())
                        .then(
                            (result3) => {
                                console.info(result3.posts)
                                if (result3.posts) {
                                    this.setState({ userposts: result3.posts })
                                }
                            },
                            (error3) => {
                                console.info(error3)
                            }
                        );

                    // fetch default connections
                    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/connectioncontroller.php", {
                        method: "post",
                        body: JSON.stringify({
                            action: "getConnections",
                            userid: sessionStorage.getItem("user"),
                            connectuserid: result.users[0].user_id
                        })
                    })
                        .then((res4) => res4.json())
                        .then(
                            (result4) => {
                                console.info(result4)
                                if (result4.connections) {
                                    this.setState({ defaultnet: result4.connections, connection: true })
                                }
                            },
                            (result4) => {
                                console.info(result4)
                            }
                        );

                    // fetch user links COMING SOON
                    // fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/uacontroller.php", {
                    //     method: "post",
                    //     body: JSON.stringify({
                    //         action: "getUserArtifacts",
                    //         artifacttype: "url",
                    //         artifactcategory: "links",
                    //         userid: result.users[0].user_id
                    //     })
                    // })
                    //     .then((res3) => res3.json())
                    //     .then(
                    //         (result3) => {
                    //             if (result3.user_artifacts[0]) {
                    //                 this.setState({ userlinks: result3.user_artifacts[0] })
                    //             }
                    //         },
                    //         (error3) => {
                    //             console.info(error3)
                    //         }
                    //     );

                },
                (error) => { console.log(error) }
            );

        // fetches default data
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getCompleteUsers",
                userid: sessionStorage.getItem("user")
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);

                    // store the entire user
                    this.setState({
                        default: result.users[0],
                        defaultid: result.users[0].user_id
                    })

                    // fetch additional information
                    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/uacontroller.php", {
                        method: "post",
                        body: JSON.stringify({
                            action: "getUserArtifacts",
                            artifacttype: "picture",
                            artifactcategory: "profile pictures",
                            userid: result.users[0].user_id
                        })
                    })
                        .then((res2) => res2.json())
                        .then(
                            (result2) => { console.info(result2); },
                            (error2) => { console.info(error2) }
                        );

                },
                (error) => { console.log(error) }
            );
    }

    // render post-preview block
    renderPostPreviewBlock() {
        if (this.state.userposts) {
            return (
                <div className="postPreview">
                    {this.state.userposts.map(post => (
                        <Link to={`/post/${post.post_id}`}>
                            <div aria-label={"post by this user"} className="postPreview-block" key={post.post_id}>
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
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: `getUsers`,
                username: this.state.username
            })
        })
            .then(res => res.json())
            .then(
                result => {
                    console.log(`==========================aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa${result}`)
                    console.info(result)
                    if (result.users && this.state.username !== "") {
                        this.setState({ message: `Username already exists, choose something else or leave it blank!` });
                    }
                    else {
                        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
                            method: "post",
                            body: JSON.stringify({
                                action: `addOrEditUsers`,
                                user_id: sessionStorage.getItem("user"),
                                session_token: sessionStorage.getItem("token"),
                                userid: sessionStorage.getItem("user"),
                                username: this.state.username,
                                firstname: this.state.firstname,
                                lastname: this.state.lastname,
                                mode: "ignorenulls"
                            })
                        })
                            .then(res => res.json())
                            .then(
                                result => {
                                    console.log("successfully updated BASIC bio information");

                                    if (this.state.userpfp !== "") {
                                        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/uacontroller.php", {
                                            method: "post",
                                            body: JSON.stringify({
                                                action: `addOrEditUserArtifacts`,
                                                user_id: sessionStorage.getItem("user"),
                                                session_token: sessionStorage.getItem("token"),
                                                userid: sessionStorage.getItem("user"),
                                                artifactid: this.state.pfpid,
                                                artifactcategory: "profile pictures",
                                                artifacttype: "image",
                                                artifacturl: this.state.userpfp,
                                            })
                                        })
                                            .then(res => res.json())
                                            .then(result => {
                                                console.log("successfully updated PFP information");
                                            })
                                    }
                                    if (this.state.userbio !== "") {
                                        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/uacontroller.php", {
                                            method: "post",
                                            body: JSON.stringify({
                                                action: `addOrEditUserArtifacts`,
                                                user_id: sessionStorage.getItem("user"),
                                                session_token: sessionStorage.getItem("token"),
                                                userid: sessionStorage.getItem("user"),
                                                artifactid: this.state.bioid,
                                                artifactcategory: "bio",
                                                artifacttype: "text",
                                                artifacturl: this.state.userbio,
                                            })
                                        })
                                            .then(res => res.json())
                                            .then(result => {
                                                console.log("successfully updated PFP information");
                                            })
                                    }
                                    this.setState({ edit: false })
                                }
                            );
                    }
                },
                error => {
                    alert("error!");
                }
            );

    }
    // discard edits button
    discardEditsHandler() {
        this.setState({ edit: false, message: "fields left blank will not be updated" })
    }
    // username handler
    myUsernameHandler = event => {
        this.setState({ username: event.target.value });
    };
    // firstname handler
    myFirstnameHandler = event => {
        this.setState({ firstname: event.target.value });
    };
    // lastname handler
    myLastnameHandler = event => {
        this.setState({ lastname: event.target.value });
    };
    // bio handler
    myBioHandler = event => {
        this.setState({ userbio: event.target.value });
    };
    // profile image handler
    myProfileImageHandler = event => {
        this.setState({ userpfp: event.target.value });
    };


    // quick delete handler
    // quick delete link handler

    // follow handler (POST REQUEST)
    followHandler() {
        // unfollow the individual
        if (this.state.connection) {
            fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/connectioncontroller.php", {
                method: "post",
                body: JSON.stringify({
                    action: "deleteConnections",
                    user_id: sessionStorage.getItem("user"),
                    session_token: sessionStorage.getItem("token"),
                    connectionid: this.state.defaultnet[0].connection_id,
                })
            })
                .then((res) => res.json())
                .then(
                    (result) => { console.info(result); this.setState({ connection: false }) },
                    (error) => { console.log(error) }
                );
        }
        // follow the individual
        else {
            fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/connectioncontroller.php", {
                method: "post",
                body: JSON.stringify({
                    action: "addOrEditConnections",
                    user_id: sessionStorage.getItem("user"),
                    session_token: sessionStorage.getItem("token"),
                    userid: this.state.defaultid,
                    connectuserid: this.state.userid
                })
            })
                .then((res) => res.json())
                .then(
                    (result) => { console.info(result); this.setState({ connection: true }) },
                    (error) => { console.log(error) }
                );

        }

    }


    // FUTURE FEATURES: add quick chat feature

    render() {

        console.log(`below is the user information`)
        console.info(this.state.user)
        console.log(`above is the user information`)

        console.log(`below is the default information`)
        console.info(this.state.default)
        console.log(`above is the default information`)
        console.info(this.state.userpfp)

        return (
            <main className="profile">
                {this.state.userid === sessionStorage.getItem("user") && this.state.userid !== null ?
                    <div>

                        {/* /* IF is editing, render edit buttons and features. ELSE render normal page with edit profile button */}
                        {!this.state.edit ?
                            <div>
                                <div className="profile-tophalf">
                                    <div className="userCard">
                                        <div className="userCard-left">
                                            <div className="roundProfile">
                                                <img aria-label={"profile Image"} src={this.state.userpfp} alt={`${this.state.user.first_name} ${this.state.user.last_name}`} />
                                            </div>
                                            <div>
                                                <h3>{this.state.user.first_name}</h3>
                                                <h3>{this.state.user.last_name}</h3>
                                            </div>
                                            <div>
                                                <p>@{this.state.user.username}</p>
                                            </div>
                                        </div>
                                        <div className="userCard-right">
                                            <p className="content">
                                                {this.state.userbio}
                                            </p>
                                            <div className="userCard-links">
                                                <button aria-label={"links to add to your page, coming soon!"} className="submitbutton type02">links are coming soon!</button>
                                            </div>
                                        </div>
                                        <div className="userCard-buttons">
                                            <button className="submitbutton type01" onClick={this.startEditsHandler.bind(this)}>Edit Profile</button>
                                        </div>
                                    </div>
                                    <div className="userStats">
                                        <h2>Topix Stats</h2>
                                        <div className="userStats-all">

                                            <ul className="userStats-card">
                                                <li>t/Topix </li>
                                                <li>00 posts</li>
                                                <li>--</li>
                                                <li>--</li>
                                                <li>--</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="bothalf">
                                    {this.renderPostPreviewBlock()}
                                </div>
                            </div> : null
                        }
                        {this.state.edit ?
                            <div>
                                <div className="profile-tophalf">
                                    <div className="userCard">
                                        <div className="userCard-left">
                                            <div className="roundProfile">
                                                <input className="editp super" type="text" onChange={this.myProfileImageHandler} placeholder="image link" />
                                                <img src={this.state.userpfp} alt={`${this.state.user.first_name} ${this.state.user.last_name}`} />
                                            </div>
                                            <div>
                                                <input className="edith3" type="text" onChange={this.myFirstnameHandler} placeholder={this.state.user.first_name} />
                                                <input className="edith3" type="text" onChange={this.myLastnameHandler} placeholder={this.state.user.last_name} />
                                            </div>
                                            <div>
                                                <input className="editp" type="text" onChange={this.myUsernameHandler} placeholder={this.state.user.username} />
                                            </div>
                                            <p className="error editerror">{this.state.message}</p>
                                        </div>
                                        <div className="userCard-right">
                                            <textarea className="edittextarea" wrap="hard" onChange={this.myBioHandler} placeholder={this.state.userbio}>
                                            </textarea>
                                            <div className="userCard-links">
                                                <button className="submitbutton type02">links are coming soon!</button>
                                            </div>
                                        </div>
                                        <div className="userCard-buttons">
                                            <button className="submitbutton type01" onClick={this.saveEditsHandler.bind(this)}>Save Edits</button>
                                            <button className="submitbutton type01 warning" onClick={this.discardEditsHandler.bind(this)}>Discard Edits</button>
                                        </div>
                                    </div>
                                    <div className="userStats">
                                        <h2>Topix Stats</h2>
                                        <div className="userStats-all">

                                            <ul className="userStats-card">
                                                <li>t/Topix </li>
                                                <li>00 posts</li>
                                                <li>00 comments</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="bothalf">
                                    {this.renderPostPreviewBlock()}
                                </div>
                            </div> : null
                        }
                    </div> : null
                }
                {this.state.userid !== sessionStorage.getItem("user") && this.state.userid !== null ?
                    <div>
                        <div className="profile-tophalf">
                            <div className="userCard">
                                <div className="userCard-left">
                                    <div className="roundProfile">
                                        <img src={this.state.userpfp} alt={`${this.state.user.first_name} ${this.state.user.last_name}`} />
                                    </div>
                                    <div>
                                        <h3>{this.state.user.first_name}</h3>
                                        <h3>{this.state.user.last_name}</h3>
                                    </div>
                                    <div>
                                        <p>@{this.state.user.username}</p>
                                    </div>
                                </div>
                                <div className="userCard-right">
                                    <p className="content">
                                        {this.state.userbio}
                                    </p>
                                    <div className="userCard-links">
                                        <button className="submitbutton type02">quick message coming soon!</button>
                                    </div>
                                </div>
                                <div className="userCard-buttons">
                                    {!this.state.connection ?
                                        <button className="submitbutton type01" onClick={this.followHandler.bind(this)}>Follow</button> : null
                                    }
                                    {this.state.connection ?
                                        <button className="submitbutton type01" onClick={this.followHandler.bind(this)}>Unfollow</button> : null
                                    }
                                </div>
                            </div>
                            <div className="userStats">
                                <h2>Topix Stats</h2>
                                <div className="userStats-all">

                                    <ul className="userStats-card">
                                        <li>t/Topix </li>
                                        <li>00 posts</li>
                                        <li>00 comments</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="bothalf">
                            {this.renderPostPreviewBlock()}
                        </div>
                    </div> : null
                }
                {this.state.userid === null ?
                    <div>
                        <h1>USER NOT FOUND</h1>
                        <p>Either check your internet connection or search for someone else.</p>
                        <form className="searchbar">
                            <input placeholder="Search" />
                            <button><i className="fas fa-search"></i></button>
                        </form>
                    </div> : null
                }
            </main>
        );
    }
}

export default Profile