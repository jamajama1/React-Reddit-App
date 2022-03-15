import React from "react";
import '../App.css';
import { withRouter } from 'react-router-dom';
import signup from './Signup.js'
// import customSettings from './customSettings.js'

 class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      username: "",
      password: "",
      sessionToken: "",
      // phoneNumber: props.phoneNumber,
      emailaddr: props.emailaddr,
      firstname: props.firstname,
      birthday: 'Unknown',
      profImg: "",
      confirm: "",
      users: []
    };
    // this.fieldChangeHandler.bind(this);
  }

  async componentDidMount() {

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
          this.setState({
            // user: result.users[0].name,
            emailaddr: result.users[0].email_addr,
          });
        },
        (error) => {
          alert("settings made api call!")
        }
      );

    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/uacontroller.php", {
      method: "post",
      body: JSON.stringify({
        action: "getUserArtifacts",
        userid: sessionStorage.getItem("user"),
        artifactcategory: "birthday",
      })

    })
      .then((res) => res.json())
      .then(
        (result) => {
          // console.log(result.user_artifacts[0].artifact_type);
          try {
            this.setState({
              birthday: result.user_artifacts[0].artifact_type
            });
          }
          catch{
            // alert("settings made api call!")
          }
        },
        (error) => {
          alert("settings made api call!")
        }
      );

  };

  switchCustom() {
    this.setState(
      { page: "customSettings" }
    );
  }

  switchProfPic() {
    this.setState(
      { page: "switchPic" }
    );
  }

  deleteAccount() {
    this.setState(
      { page: "deleteAccount" }
    );
  }


  customHandler = (event) => {

    const date = document.getElementById('birthday');
    // this.setState({ birthday: date.value });

    event.preventDefault();

    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/uacontroller.php", {
      method: "post",
      body: JSON.stringify({
        user_id: sessionStorage.getItem("user"),
        session_token: sessionStorage.getItem("token"),
        action: "addOrEditUserArtifacts",
        // action: "deleteUserArtifacts",
        // artifactid: "2",
        artifacttype: date.value,
        artifactcategory: "birthday",
        userid: sessionStorage.getItem("user")
      })
    })

      .then(res => res.json())
      .then(

        // this.settings.bind(this),
        result => {
          console.log(this.state.session_token);
          console.log(result.Status);
          this.setState({
            birthday: date.value,

          });

        },
        error => {
          alert("error!");
        }
      );
  }

  profPicHandler = (event) => {

    const path = document.getElementById('img').files[0].value;
    path = path.value.replace("C:\fakepath\\", "/");
    console.log(path);

    event.preventDefault();

    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/uacontroller.php", {
      method: "post",
      body: JSON.stringify({
        user_id: sessionStorage.getItem("user"),
        session_token: sessionStorage.getItem("token"),
        action: "addOrEditUserArtifacts",
        artifacturl: path,
        artifacttype: "picture",
        artifactcategory: "profile",
        userid: sessionStorage.getItem("user")
      })
    })

      .then(res => res.json())
      .then(

        // this.settings.bind(this),
        result => {
          console.log(this.state.artifacturl);
          console.log(result.Status);
          this.setState({
            profImg: path
          });

        },
        error => {
          alert("error!");
        }
      );
  }

  deleteHandler = event => {
    event.preventDefault();

    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
      method: "post",
      body: JSON.stringify({
        action: "deleteUsers",
        user_id: sessionStorage.getItem("user"),
        session_token: sessionStorage.getItem("token"),
        userid: sessionStorage.getItem("user")
      })
    })
      .then(res => res.json())
      .then(
        result => {
          console.info(result);
          if (!result.Status.includes("error")) {
          }
          else {
            console.log("failed to delete account from server")
          }

        },
        error => {
          alert("error!");
        }
      );

    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/SocialAuth.php", {
      method: "post",
      body: JSON.stringify({
        action: "logout",
        username: this.state.emailaddr,
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
  render() {
    return (
      <main>


        <h1>Settings</h1>

        <br />
        <label> Email: {this.state.emailaddr}</label>
        <br />
        <label> Birthday: {this.state.birthday}</label>
        <label>(Year, Month, Date) </label>
        <br /><br />



        <input type="submit" onClick={this.switchCustom.bind(this)} value="Customize Settings" />
        <br />
        {/* <input type="submit" onClick={this.switchProfPic.bind(this)} value="Change Profile Picture" /> */}
        <br />
        <input type="submit" className="warning" onClick={this.deleteAccount.bind(this)} value="Delete Account" />


        {/* {this.state.page === "switchPic" ?
          <div className="custom">
            <form onSubmit={this.profPicHandler} >
              <br />  <br />
              <label for="img">Select image:</label>
              <br />
              <input type="file" id="img" name="img" accept="image/*" />
              <br /> <br />
              <input type="submit" />
              <br />  <br />
              <label>{this.state.confirm}</label>
            </form>
          </div> : null
        } */}

        {this.state.page === "customSettings" ?
          <div className="custom">
            <form onSubmit={this.customHandler} >
              <br />  <br />  <br />
              <label for="birthday">Birthday: </label>
              <input type="date" id="birthday" name="birthday"></input>
              <input type="submit" value="Save" />
            </form>
          </div> : null
        }

        {this.state.page === "deleteAccount" ?
          <div className="custom">
            <form onSubmit={this.deleteHandler} >
              <br />  <br />  <br />
              <label >Are you sure you want to delete your account?</label>
              <br /><br />
              <input type="button" value="Cancel" />
              <br /><br />
              <input type="submit" className="warning" value="Yes, delete." />
            </form>
          </div> : null
        }
      </main>

    );
  }

}

export default withRouter(Settings);

