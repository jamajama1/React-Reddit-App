import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import auth from './auth';

import logo from '../res/logo-300.png';
import Logout from './Logout';

function Navbar() {
    if (sessionStorage.getItem("token") !== "" && sessionStorage.getItem("token") !== null) {
        return (
            <nav>
                <div className="main-buttons">
                    <Link to="/feed"> <img aria-label={"topix logo, feed"} className="logo" src={logo} /> </Link>
                    <Link to="/profile"> <i className="fas fa-user"></i> <span>Profile</span> </Link>
                    <Link to="/search"> <i className="fas fa-search"></i> <span>Search</span> </Link>
                    <Link to="/chat"> <i className="fas fa-comments"></i> <span>Chat</span> </Link>
                    <Link to="/create"> <i className="far fa-plus-square"></i> <span>Post</span> </Link>
                </div>
                <div className="secondary-buttons">
                    <Logout />
                    <Link to="/settings"> <i className="fas fa-cog"></i> <span>Settings</span> </Link>
                </div>
            </nav>
        )
    }
    else {
        return null;
    }
}

export default Navbar;