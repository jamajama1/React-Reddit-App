import React, { Component } from 'react';

import '../styles/chat.css';
import pic from '../res/profile2.png';


class Messages extends Component {

    render() {

        console.log("in messages");
        console.log(this.props);
            
        return ( 
            <header>
                <div className="contactDetails">
                    <div className="content">
                    <img className="pic" aria-label={"user icon"} src={pic} align="left"></img>
                        <p> User: </p>
                        <p>Hi there!</p>
                    </div>
                </div>
                
            </header>
        )
    }
};

export default Messages