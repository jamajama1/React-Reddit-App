import React, { Component, userState } from 'react';
import { withRouter } from 'react-router-dom';

import logo from '../res/logo-300.png';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            message: "",
            sessiontoken: ""
        };
    }

    myChangeHandler = event => {
        this.setState({ username: event.target.value });
    };

    passwordChangeHandler = event => {
        this.setState({ password: event.target.value });
    };

    submitHandler = event => {
        event.preventDefault();


        if (this.state.username !== `` && this.state.password !== ``) {
            fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/SocialAuth.php", {
                method: "post",
                body: JSON.stringify({
                    action: "login",
                    username: this.state.username,
                    password: this.state.password
                })
            })
                .then(res => res.json())
                .then(result => {
                    console.info(result);
                    console.log(result.message)
                    console.log("Testing");
                    if (result.user) {
                        sessionStorage.setItem("token", result.user.session_token);
                        sessionStorage.setItem("user", result.user.user_id);
                        // localStorage.setItem("token", result.user.session_token);
                        // localStorage.setItem("user", result.user.user_id);
                        this.setState({
                            sessiontoken: result.user.session_token,
                            message: result.user.session_token
                        });
                        this.props.history.push("/feed");
                    } else {
                        sessionStorage.removeItem("token");
                        sessionStorage.removeItem("user");
                        this.setState({
                            sessiontoken: "",
                            message: result.message
                        });
                        // this.props.history.push("/signup")
                    }
                },
                    error => {
                        alert("Error!");
                    }
                );
        }
        else {
            this.setState({
                message: "fields cannot be empty"
            })
        }

    };

    render() {
        console.log("Rendering login, token is " + sessionStorage.getItem("token"));
        if (sessionStorage.getItem("token") === null || sessionStorage.getItem("token") === "") {
            return (
                <div className="portal">
                    <div className="login">
                        <div>
                            <img className="logo" src={logo} />
                            <br></br>
                            <h4>TOPIX: Collaborative Learning</h4>
                            <p>Log into your account!</p>
                            <br></br>
                        </div>
                        <form onSubmit={this.submitHandler}>
                            <p className="error">{this.state.message}</p>
                            <label>
                                <input placeholder="Email" type="text" onChange={this.myChangeHandler} />
                            </label>
                            <label>
                                <input placeholder="Password" type="password" onChange={this.passwordChangeHandler} />
                            </label>
                            <input type="submit" value="Log in" />
                        </form>
                        <div className="portalswitch">
                            <button className="link" onClick={() => { this.props.history.push("/"); }}>I don't have an account.</button>
                            <button className="link" onClick={() => { this.props.history.push("/reset01"); }}>I forgot my password.</button>
                        </div>
                    </div >
                </div>
            );
        } else {
            console.log("Returning welcome message");
            console.log(`Username: ${this.state.username}\nToken${this.state.sessiontoken}`)
            this.props.history.push("/feed");
            return null;
        }
    }
}

export default withRouter(Login);