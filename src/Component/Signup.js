import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import logo from '../res/logo-300.png';

class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dbase: `http://webdev.cse.buffalo.edu/cse410/gr8/api/SocialAuth.php`,
      dbase2: `http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php`,
      dbase3: `http://webdev.cse.buffalo.edu/cse410/gr8/api/uacontroller.php`,
      page: `signup`,

      // for 1/4 KEY HANDLER
      email: ``,

      // for 2/4 COMPLETION HANDLER
      token: ``,
      newpass: ``,
      confirmpass: ``,
      message: ``,

      // for 3/4 LOGIN HANDLER
      sessiontoken: ``,

      // for 4/4 PROFILE HANDLER
      username: ``,
      firstname: ``,
      lastname: ``
    };
  }

  // = = = = = = = = = =    PAGE HANDLER    = = = = = = = = = = //
  swapLogin() { this.setState({ page: `login` }); }
  swapSignup22() { this.setState({ message: `Check your email for a One-Time-Password`, page: `signup2` }); }
  swapSignup2() { this.setState({ message: `Check your email for a One-Time-Password`, page: `signup2` }); }
  swapSignup3() { this.setState({ page: `signup3` }); }



  // = = = = = = = = = =    SIGN-UP (1/4) OTP HANDLER    = = = = = = = = = = //
  changeEmailHandler = (event) => {
    this.setState({
      email: event.target.value
    })
  }

  submitHandlerPart1 = event => {
    event.preventDefault();
    if (!(this.state.email.toLowerCase().endsWith(`@buffalo.edu`) && 12 < this.state.email.length)) {

      this.setState({
        message: `You can only register using an @buffalo.edu email.`
      });
      console.log(`Only @buffalo.edu academic emails permitted.`)
    }

    // checks database to see if email is already registered
    else {
      fetch(this.state.dbase2, {
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
              this.setState({ message: `Your account already exists!` });
            }
            else {
              fetch(this.state.dbase, {
                method: "post",
                body: JSON.stringify({
                  action: `register`,
                  email_addr: this.state.email
                })
              })
                .then(res => res.json())
                .then(
                  this.swapSignup2.bind(this),
                  result => {
                    this.setState({
                      newpass: ``,
                      confirmpass: ``,
                      message: result.message
                    });
                  },
                  error => {
                    alert("error!");
                  }
                );
            }
          },
          error => {
            alert("error!");
          }
        );
    }
  }



  // = = = = = = = = = =    SIGN-UP (2/4) COMPLETION HANDLER    = = = = = = = = = = //
  changeTokenHandler = (event) => {
    this.setState({ token: event.target.value })
  }
  changeNewPassHandler = (event) => {
    this.setState({ newpass: event.target.value })
  }
  changeConfirmPassHandler = (event) => {
    this.setState({ confirmpass: event.target.value })
  }
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
      fetch(this.state.dbase, {
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
            fetch(this.state.dbase, {
              method: "post",
              body: JSON.stringify({
                action: "login",
                username: this.state.email,
                password: this.state.confirmpass
              })
            })
              .then(res => res.json())
              .then(
                result2 => {
                  if (result2.user) {
                    sessionStorage.setItem("token", result2.user.session_token);
                    sessionStorage.setItem("user", result2.user.user_id);
                    this.setState({
                      sessiontoken: result2.user.session_token,
                      message: result2.user.session_token
                    });
                    this.swapSignup3();
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


  // = = = = = = = = = =    SIGN-UP (4/4) PROFILE HANDLER    = = = = = = = = = = //
  changeUsernameHandler = (event) => {
    this.setState({ username: event.target.value })
  }
  changeFirstnameHandler = (event) => {
    this.setState({ firstname: event.target.value })
  }
  changeLastnameHandler = (event) => {
    this.setState({ lastname: event.target.value })
  }
  submitHandlerPart3 = event => {
    event.preventDefault();

    if (this.state.username === `` && this.state.firstname === `` && this.state.lastname === ``) {
      this.setState({
        message: `You cannot submit an empty form.`
      });
    }

    if (0 < this.state.username.length) {
      fetch(this.state.dbase2, {
        method: "post",
        body: JSON.stringify({
          action: `getUsers`,
          username: this.state.username
        })
      })
        .then(res => res.json())
        .then(
          result => {

            if (result.users) {
              this.setState({ message: `Username already exists, choose something else!` });
            }
            else {
              if (this.state.firstname.length < 1 || this.state.lastname.length < 1) {
                this.setState({ message: `Enter your first name and last name.` })
              }
              else {
                // add default user profile picture to user profile
                fetch(this.state.dbase3, {
                  method: "post",
                  body: JSON.stringify({
                    action: `addOrEditUserArtifacts`,
                    user_id: sessionStorage.getItem("user"),
                    session_token: sessionStorage.getItem("token"),
                    userid: sessionStorage.getItem("user"),
                    artifactcategory: "profile pictures",
                    artifacttype: "image",
                    artifacturl: "https://2.bp.blogspot.com/-FbxUvD06XII/U7gmu0QgyyI/AAAAAAAAHGc/LBwdFunn8a4/s1600/DSCN4950.JPG",
                  })
                })

                // add username, first name, and last name to user profile
                fetch(this.state.dbase2, {
                  method: "post",
                  body: JSON.stringify({
                    action: `addOrEditUsers`,
                    user_id: sessionStorage.getItem("user"),
                    session_token: sessionStorage.getItem("token"),
                    userid: sessionStorage.getItem("user"),
                    username: this.state.username,
                    firstname: this.state.firstname,
                    lastname: this.state.lastname
                  })
                })
                  .then(res => res.json())
                  .then(
                    result => {
                      console.log(result);
                      this.props.history.push("/feed")
                    }
                  );
              }
            }
          },
          error => {
            alert("error!");
          }
        );
    }

    else if (this.state.username === ``) {
      this.setState({
        message: `Please enter a username.`
      });
    }

    else if (this.state.firstname === ``) {
      this.setState({
        message: `You cannot submit an empty form.`
      });
    }

    else if (this.state.lastname === ``) {
      this.setState({
        message: `You cannot submit an empty form.`
      });
    }
  }

  render() {
    return (
      <div className="portal">
        {this.state.page === `signup` ?
          <div className="login">
            <div>
              <img className="logo" aria-label={"topix logo"}src={logo} />
              <br></br>
              <h4>TOPIX: Academia Networking App</h4>
              <p>Create an account now!</p>
              <br></br>
            </div>
            <form onSubmit={this.submitHandlerPart1}>
              <p className="error">{this.state.message}</p>
              <input type="hidden" name="action" value="register" />
              <label>
                <input type="text" id="email_addr" name="email_addr" size="50" placeholder="Email" onChange={this.changeEmailHandler} />
              </label>
              <input type="submit" value="Sign Up" />
              <input type="submit" value="I have an auth code." onClick={this.swapSignup22.bind(this)} />
            </form>
            <div className="portalswitch">
              <button className="link" onClick={() => { this.props.history.push("/login"); }}>I have an account.</button>
            </div>
          </div> : null
        }
        {this.state.page === `signup2` ?
          <div className="login">
            <form onSubmit={this.submitHandlerPart2} >
              <p className="error">{this.state.message}</p>
              <input type="hidden" name="action" value="setpassword" />
              <label>Email</label><input type="text" id="email_addr" name="email_addr" placeholder="Email" size="50" onChange={this.changeEmailHandler} />
              <br />
              <label>Token</label><input type="text" id="token" name="token" placeholder="Token" size="50" onChange={this.changeTokenHandler} />
              <br />
              <label>New Password</label><input type="password" id="newpassword" name="newpassword" placeholder="New Password" size="50" onChange={this.changeNewPassHandler} />
              <br />
              <label>Confirm Password</label><input type="password" id="confirmpassword" name="confirmpassword" placeholder="Confirm Password" size="50" onChange={this.changeConfirmPassHandler} />
              <input type="submit" value="Continue" />
            </form>
          </div> : null
        }
        {this.state.page === `signup3` ?
          <div className="login">
            <form onSubmit={this.submitHandlerPart3} >
              <p className="error">{this.state.message}</p>
              <input type="hidden" name="action" value="setpassword" />
              <label>Username</label><input type="text" id="username" name="username" placeholder="Username" size="50" onChange={this.changeUsernameHandler} />
              <br />
              <label>First Name</label><input type="text" id="firstname" name="firstname" placeholder="First Name" size="50" onChange={this.changeFirstnameHandler} />
              <br />
              <label>Last Name</label><input type="text" id="lastname" name="lastname" placeholder="Last Name" size="50" onChange={this.changeLastnameHandler} />
              <br />
              <input type="submit" value="Complete Signup" />
            </form>
          </div> : null
        }
      </div>
    );
  }



}
export default withRouter(Signup);