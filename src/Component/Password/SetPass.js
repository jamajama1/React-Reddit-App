import React, { Component, userState } from 'react';
import { withRouter } from 'react-router-dom';

import logo from '../../res/logo-300.png';

class SetPass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            token: "",
            newpass: "",
            confirmpass: ""
        };
    }


    changeEmailHandler = (event) => { this.setState({ email: event.target.value }) }
    changeTokenHandler = (event) => { this.setState({ token: event.target.value }) }
    changeNewPassHandler = (event) => { this.setState({ newpass: event.target.value }) }
    changeConfirmPassHandler = (event) => { this.setState({ confirmpass: event.target.value }) }

    submitHandlerPart2 = event => {
        event.preventDefault();

        if (this.state.email === `` && this.state.token === `` && this.state.newpass === `` && this.state.confirmpass === ``) {
            this.setState({
                message: `You cannot submit an empty form.`
            });
        }
        else if (this.state.email.length < 1) {
            this.setState({
                message: `Enter your academic @buffalo.edu email.`
            });
        }
        else if (!(this.state.email.toLowerCase().endsWith(`@buffalo.edu`) && 12 < this.state.email.length)) {
            this.setState({
                message: `Friendly reminder that all accounts must be @buffalo.edu email.`
            });
        }
        else if (this.state.token.length < 1) {
            this.setState({
                message: `Please check your @buffalo.edu email for your authentication code.`
            });
        }
        else if (this.state.newpass.length < 11) {
            this.setState({
                message: `Your password is weak. Enter at least 12 characters.`
            });
        }
        else if (this.state.newpass !== this.state.confirmpass) {
            this.setState({
                message: `Passwords do not match, please try again!`
            });
        }
        else {
            fetch(`http://webdev.cse.buffalo.edu/cse410/gr8/api/SocialAuth.php`, {
                method: "post",
                body: JSON.stringify({
                    action: `setpassword`,
                    email_addr: this.state.email,
                    token: this.state.token,
                    newpassword: this.state.newpass,
                    confirmpass: this.state.confirmpass
                })
            })
                .then(res => res.json())
                .then(
                    result => {
                        this.setState({
                            message: result.message
                        });
                        console.log(this.state.token);
                        console.info(result.message);
                        // = = = = = = = = = =    SIGN-UP (3/4) LOGIN HANDLER    = = = = = = = = = = //
                        fetch(`http://webdev.cse.buffalo.edu/cse410/gr8/api/SocialAuth.php`, {
                            method: "post",
                            body: JSON.stringify({
                                action: "login",
                                username: this.state.email,
                                password: this.state.newpass
                            })
                        })
                            .then(res => res.json())
                            .then(
                                result2 => {
                                    if (result2.user) {
                                        sessionStorage.setItem("token", result2.user.session_token);
                                        sessionStorage.setItem("user", result2.user.user_id);
                                        this.props.history.push("/feed");
                                    }
                                    else {
                                        sessionStorage.removeItem("token");
                                        sessionStorage.removeItem("user");
                                    }
                                },
                                error => {
                                    alert("Error!");
                                }
                            )
                    },
                    error => {
                        alert("error!");
                    }

                );
        }
    }

    render() {
        return (
            <div className="portal">
                <div className="login reset">
                    <div>
                        <img className="logo" src={logo} />
                        <br></br>
                        <h4>TOPIX: Resetting Your Password</h4>
                        <p>Step 2: Enter your OTP (One-Time Passwowrd) from your email.</p>
                        <br></br>
                    </div>
                    <form onSubmit={this.submitHandlerPart2} >
                        <p className="error">{this.state.message}</p>
                        <input type="hidden" name="action" value="setpassword" />
                        <label>Email Address</label><input type="text" id="email_addr" name="email_addr" placeholder="Email Address" size="50" onChange={this.changeEmailHandler} />
                        <br />
                        <label>Token</label><input type="text" id="token" name="token" placeholder="Token" size="50" onChange={this.changeTokenHandler} />
                        <br />
                        <label>New Password</label><input type="password" id="newpassword" name="newpassword" placeholder="New Password" size="50" onChange={this.changeNewPassHandler} />
                        <br />
                        <label>Confirm Password</label><input type="password" id="confirmpassword" name="confirmpassword" placeholder="Confirm Password" size="50" onChange={this.changeConfirmPassHandler} />
                        <input type="submit" value="Continue" />
                    </form>
                    <div className="portalswitch">
                        <button className="link" onClick={() => { this.props.history.push("/login"); }}>I remember my account!</button>
                        <button className="link" onClick={() => { this.props.history.push("/reset01"); }}>I didn't get an email.</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(SetPass);