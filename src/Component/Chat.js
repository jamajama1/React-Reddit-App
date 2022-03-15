import React, { Component } from 'react';

import '../styles/chat.css';
import pic from '../res/profile2.png';
import auth from './auth';
import Messages from './Messages'
import { Link } from 'react-router-dom';


class Chat extends Component {
    
    state = {
        page: "Chat",
        userid: 99999999,
        Users: [],
        currentUser: sessionStorage.getItem("user"),
        conversationsIDs: [],
        messages: [],
        recId: 999999,
        userMessage: "",
        email: ""
    }

    handleChange({ target }) {
        this.setState({
          [target.name]: target.value
        });
      }
    

    getUsers(){
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getUsers"
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log("in get users");
                    console.log(result);
                    this.setState({Users: result.users});
  
                },
                (error) => {
                    alert("error!");
                }
            ).then(e => {
                    console.log("SPLICE THIS: " + this.state.Users)
                    console.log("CURRENT USER: " + this.state.currentUser)
                    const arr = this.state.Users;
                    console.log(arr);
                    for (var i = arr.length - 1; i >= 0; --i) {
                        if (arr[i].email_addr == "" || arr[i].email_addr == null || arr[i].user_id == this.state.currentUser) {
                            arr.splice(i,1);
                        }
                    }

                    this.setState({Users: arr});
                    console.log("SPLICED");
                    console.log(arr);
            
                            },
                            (error) => {
                                alert("error!");
                            }
                        );
                }

    returnEmail(userId){
        
            /* fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/usercontroller.php", {
                method: "post",
                body: JSON.stringify({
                    action: "getUsers",
                    userid: userId
                })
            })
                .then((res) => res.json())
                .then(
                    (result) => {
                        this.setState({email: result.users.email_addr});
                        console.log("returned" + result.users.email_addr);
                        return this.state.email;
                    }); */
                    console.log("OH No! ")
    }
    getMessages(recip){
        this.setState({messages: []});
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/messagecontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getMessages",
                userid: recip,
                recipientid: this.state.currentUser
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log("in get messages");

                    var joined = this.state.messages.concat(result.messages || [])
                    this.setState({messages: joined});
                    console.log(this.state.messages)
                },
                (error) => {
                    alert("error!");
                }
            ).then(
                (result) => {
                    var sorted = this.state.messages.sort(function(a,b) {return (a.message_id > b.message_id) ? 1 : ((b.message_id > a.message_id) ? -1 : 0);} );
                    this.setState({messages: sorted});
                },
                (error) => {
                    alert("error!");
                }
            );

            fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/messagecontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getMessages",
                userid: this.state.currentUser,
                recipientid: recip
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log("in get messages");
                    var joined = this.state.messages.concat(result.messages || [])
                    this.setState({messages: joined});
                    console.log(this.state.messages)
                },
                (error) => {
                    alert("error!");
                }
            );
    }

    sendMessages(){
        console.log("in SEND MESSAGE");
        console.log("SESSION!!! " + sessionStorage.getItem("user"))
        console.log( this.state.userMessage);
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/messagecontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "addOrEditMessages",
                userid: sessionStorage.getItem("user"),
                user_id: sessionStorage.getItem("user"),
                session_token: sessionStorage.getItem("token"),
                recipientid: this.state.recId,
                message: this.state.userMessage
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log("in get messages");
                    console.log("RESULT " + result);
                    console.log(result);
                },
                (error) => {
                    alert("error!");
                }
            );

            fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/messagecontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getConversation",
                userid: this.state.currentUser
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                },
                (error) => {
                    alert("error!");
                }
            );
        this.getMessages(this.state.recId);
    }

    changeUser(userid){
        this.setState({recId: userid});
        console.log("!!!!!!!!!!!!!!!!!! " + this.state.recId);
        this.getMessages(userid);
    }

    async componentDidMount() {
        this.getUsers();
        console.log("TTTTTTTTTTT " + this.state.recId);
    };

        


    swapProfile(recID) { 
        this.setState({ 
            page: "Profile",
            recId: recID
        }, () => {
            console.log("IUNIVSUDNVIUSD" + this.state.recId);
        });
    }

    render() {
        return ( 
    <main>
    {
        this.state.page === 'Profile' ?
        null : 
            <h1>
            Chat
            </h1> 
    }
    {
        this.state.page === 'Profile' ?
        null : 
        <div className= "cont">
            <div className="history">
                { 
                        this.state.Users && this.state.Users.map((Users) => 
                        <div className="contactDetails" onClick={this.changeUser.bind(this, Users.user_id)}>
                            <Link to={`/profile/${Users.username}`}><img className="pic" aria-label={"profile icon"} src={pic} align="left"></img></Link>
                                <div className="chatContent">
                                    <p className="para" > {Users.email_addr} </p>
                                </div>
                        </div>
                )}
            </div>
    
            <div className="history">
                {  
                    this.state.messages  && this.state.messages.map((messages) => {
                    return messages.recipient_id == this.state.currentUser ?
                    <div className="contactDetails">
                            <div className="chatContent">
                                <p className="para" >{messages.message}</p>
                            </div>
                        </div>
                        :
                        <div className="contactDetails2">
                            <div className="content">
                                <p className="p2">{messages.message}</p>
                            </div>
                        </div>
                    }          
                )}
            </div>

            <div className="chatContainer">
            <input type="text" aria-label={"message textbox"} name="userMessage" placeholder="Type your message..." value={ this.state.userMessage } onChange={ this.handleChange.bind(this) } />
            <button value="Send" onClick={ this.sendMessages.bind(this) }>Send</button>
            </div>
            
        </div>
    }
    {/* </main> */}
    </main>
        )
    }
};

export default Chat

