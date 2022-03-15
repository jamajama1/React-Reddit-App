import React, { Component } from 'react';

import '../App.css';
import profilePic from "../res/profile2.png"
import auth from './auth';

export default class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        console.log("IN CONSTRUCTOR " + props.RecId);
        this.state = {
            userid: auth.username,
            username: props.RecId,
            password: auth.password,
            firstname: props.firstname,
            artifacturl: "https://via.placeholder.com/300x400",
            users: []
        };
        // this.fieldChangeHandler.bind(this);
    }
    state = {
        page: "profile"
    };

    async componentDidMount() {

        console.log(auth.username);
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getCompleteUsers",
                userid: this.state.username

            })

        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result.users);
                    this.setState({
                        // user: result.users[0].name,
                        username: result.users[0].email_addr
                    });
                },
                (error) => {
                    alert("profile made api call!")
                }
            );






        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/uacontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getUserArtifacts",
                // artifacttype: “picture”,
                // artifactcategory: “uploads”
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        // user: result.users[0].name,
                        user_artifacts: result.user_artifacts,
                        // artifacturl: result.artifacturl
                    });
                },
                (error) => {
                    alert("profile made api call!")
                }
            );

    };

    // const Profile = (props) => (
    render() {
        return (
            <main class="profile">
                <div class='userInfo'>
                    <img src={profilePic} alt="profilePic" className="profile" />
                    <h1>{this.state.username}</h1>
                    <p> 
                        Hello! My name is user. Certified traxdfxbvel lover. Professional food trailblazer. Coffee aficionado. Avid student.
                    </p>
                </div>

                <div class="userGallery">
                    <img src={this.state.artifacturl} alt="imagePlcHolder" class="placeHoldr1" />
                    <img src="https://via.placeholder.com/300x400" alt="imagePlcHolder" />
                    <img src="https://via.placeholder.com/300x400" alt="imagePlcHolder" />
                    <img src="https://via.placeholder.com/300x400" alt="imagePlcHolder" />
                    <img src="https://via.placeholder.com/300x400" alt="imagePlcHolder" />
                </div>
            </main>
        );
    }
}
    // export default Profile

