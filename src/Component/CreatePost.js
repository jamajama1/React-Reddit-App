import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Create extends Component {
  state = {
    posttitle: "",
    postimage: "",
    postcontent: "",
    postmessage: "",
    posttopic: "",

  }

  postHandler = event => {
    //make the api call to the authentication page
    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
      method: "post",
      body: JSON.stringify({
        action: "addOrEditPosts",
        user_id: sessionStorage.getItem("user"),
        session_token: sessionStorage.getItem("token"),
        userid: sessionStorage.getItem("user"),
        postpicurl: this.state.postimage,
        posttext: this.state.postcontent,
        posttype: this.state.posttitle,

      })
    })
      .then(res => res.json())
      .then(
        result => {
          console.info(result["Record Id"]);

          // adds the tag
          fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/ptcontroller.php", {
            method: "post",
            body: JSON.stringify({
              action: "addOrEditPostTags",
              user_id: sessionStorage.getItem("user"),
              session_token: sessionStorage.getItem("token"),
              userid: sessionStorage.getItem("user"),
              postid: result["Record Id"],
              tag: this.state.posttopic,

            })
          });

          this.setState({
            postmessage: "Your post has been successfully created!"
          });

        },
        error => {
          alert("error!");
        }
      );
  };


  postCheck = event => {
    fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
      method: "post",
      body: JSON.stringify({
        action: "getPosts",
      })
    })
      .then(res => res.json())
      .then(
        result => {
          console.log(result);
          this.setState({
            postmessag: "check "
          });

        },
        error => {
          alert("error!");
        }
      );
  };


  myTitleHandler = event => {
    this.setState({
      posttitle: event.target.value
    });
  };
  myImageHandler = event => {
    this.setState({
      postimage: event.target.value
    });
  };
  myContentHandler = event => {
    this.setState({
      postcontent: event.target.value
    });
  };
  myTopicHandler = event => {
    this.setState({
      posttopic: event.target.value
    });
  };



  render() {
    return (
      <main className="newpost">
        <form aria-label={'create post form'} className="pbox">
          <div >
            <label for="chooseTopix" required>
              Suggested Topics:
            </label>
            <select id="chooseTopix" onChange={this.myTopicHandler}>
              <option>t/Art</option>
              <option>t/Business</option>
              <option>t/Health&Medicine</option>
              <option>t/SocialSciences</option>
              <option>t/Engineering</option>
              <option>t/Technology</option>
            </select>
          </div>
          <p>Custom topics coming soon!</p>
          <input type="text" aria-label={"post title textbox"} placeholder="Post title" onChange={this.myTitleHandler} />

          <textarea className="inp" aria-label={"caption textbox"} placeholder="Write your content" wrap="hard" onChange={this.myChangeHandler1} required />

          <input type="text" aria-label={"image link textbox"} placeholder="Link to image " required onChange={this.myImageHandler} />

          <Link className="lint" to="/feed"> <button className="submitbutto" onClick={this.postHandler}>Submit</button> </Link>

          {this.state.postmessage}



        </form>
      </main>
    )
  }
}

export default Create;

/*<input type="file" onChange={this.fileSelectedHandler} value = {this.state.postimg}></input>

        <button className = "submitbutton" onClick={this.postCheck}>
            check
        </button>
        {this.state.postmessag}

*/