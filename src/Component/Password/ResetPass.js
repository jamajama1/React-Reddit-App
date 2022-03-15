import React, { Component, userState } from 'react';
import { withRouter } from 'react-router-dom';

import logo from '../../res/logo-300.png';

class ResetPass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            message: "",
        };
        this.changeEmailHandler = this.changeEmailHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    changeEmailHandler = event => {
        this.setState({ email: event.target.value });
    };


    submitHandler = event => {
        event.preventDefault();

        if (this.state.email === ``) {
            this.setState({
                message: `Enter your academic @buffalo.edu email.`
            });
        }
        else if (!(this.state.email.toLowerCase().endsWith(`@buffalo.edu`) && 12 < this.state.email.length)) {
            this.setState({
                message: `Remember, all registered accounts are @buffalo.edu email addresses.`
            });
        }
        else {
            fetch(`http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php`, {
                method: "post",
                body: JSON.stringify({
                    action: `getUsers`,
                    emailaddr: this.state.email
                })
            })
                .then(res => res.json())
                .then(
                    result => {

                        console.info(result);
                        if (result.users) {
                            fetch(`http://webdev.cse.buffalo.edu/cse410/gr8/api/SocialAuth.php`, {
                                method: "post",
                                body: JSON.stringify({
                                    action: `forgotpassword`,
                                    email_addr: this.state.email
                                })
                            })
                                .then(res => res.json())
                                .then(
                                    result => {
                                        this.setState({
                                            message: `Check your email for further instructions.`
                                        });
                                        console.log(this.state.token);
                                        console.info(result.message);
                                    },
                                    error => {
                                        alert("error!");
                                    }

                                );
                        }
                        else {
                            this.setState({ message: `Did you enter the wrong email? We have no record of the email you provided!` });
                        }
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
                        <p>Step1: Enter the email you registered with.</p>
                        <br></br>
                    </div>
                    <form onSubmit={this.submitHandler} >
                        <p className="error">{this.state.message}</p>
                        <input type="hidden" name="action" value="input email" />
                        <label>Email</label><input type="text" id="email_addr" name="email_addr" placeholder="Email" size="50" onChange={this.changeEmailHandler} />
                        <br />
                        <input type="submit" className="warning" value="Reset Password" />
                    </form>
                    <div className="portalswitch">
                        <button className="link" onClick={() => { this.props.history.push("/login"); }}>I remember my account!</button>
                        <button className="link" onClick={() => { this.props.history.push("/reset02"); }}>I already have the OTP.</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ResetPass);