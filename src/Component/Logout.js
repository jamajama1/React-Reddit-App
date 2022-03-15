import React, { Component } from 'react';
import auth from './auth';
import { withRouter } from 'react-router-dom';

class Logout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <button className="link link2" onClick={
                () => {
                    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/SocialAuth.php", {
                        method: "post",
                        body: JSON.stringify({
                            action: "logout",
                            username: this.props.emailaddr,
                            session_token: sessionStorage.getItem("token")
                        })
                    })
                        .then(res => res.json())
                        .then(result => {
                            console.log(result.message);
                            console.log("just logged off");
                            sessionStorage.removeItem("token");
                            sessionStorage.removeItem("user");
                            this.props.history.push("/");
                        });
                }
            }>
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </button>
            );

    }
}

export default withRouter(Logout);

