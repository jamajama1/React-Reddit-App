import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';

import Login from './Component/Login';
import Signup from './Component/Signup';
import Navbar from './Component/Navbar';
import Feed from './Component/Feed';
import Profile from './Component/Profile';
import Search from './Component/Search';
import Chat from './Component/Chat'
import Settings from './Component/Settings';
import Create from './Component/CreatePost';
import Post from './Component/Post';
import ProtectedRoute from './Component/ProtectedRoute';
import ResetPass from './Component/Password/ResetPass';
import SetPass from './Component/Password/SetPass';



function App() {
  if (sessionStorage.getItem("token") !== null && sessionStorage.getItem("token") !== "") {
    return (
      // Protected pages OPEN when user is successfully authenticated
      <Router basename="/cse410/gr8/app">
        <div className="App">
          <Switch>
            <div>
              <Navbar />
              <Route path="/login" exact component={Feed} />
              <Route path={["/signup", "/"]} exact component={Feed} />
              <Route path={"/reset01"} exact component={ResetPass} />
              <Route path={"/reset02"} exact component={SetPass} />
              <ProtectedRoute path={"/profile/:id"} component={Profile} />
              <ProtectedRoute path="/feed" exact component={Feed} />
              <ProtectedRoute path="/post/:id" component={Post} />
              <ProtectedRoute path="/post" exact component={Create} />
              <ProtectedRoute path="/profile" exact component={Profile} />
              <ProtectedRoute path="/search" component={Search} />
              <ProtectedRoute path="/chat" component={Chat} />
              <ProtectedRoute path="/create" component={Create} />
              <ProtectedRoute path="/settings" component={Settings} />
            </div>

            <Route path="*" component={() => "Error 404 Page not Found"} />
          </Switch>

        </div>
      </Router>
    );
  }
  else {
    return (
      // Protected pages CLOSED when user fails to authenticate
      <Router basename="/cse410/gr8/app">
        <div className="App">
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path={["/signup", "/"]} exact component={Signup} />
            <Route path={"/reset01"} exact component={ResetPass} />
            <Route path={"/reset02"} exact component={SetPass} />
            <div>
              <Navbar />
              <ProtectedRoute path={"/profile/:id"} component={Profile} />
              <ProtectedRoute path="/feed" exact component={Feed} />
              <ProtectedRoute path="/post/:id" component={Post} />
              <ProtectedRoute path="/profile" exact component={Profile} />
              <ProtectedRoute path="/search" component={Search} />
              <ProtectedRoute path="/chat" component={Chat} />
              <ProtectedRoute path="/create" component={Create} />
              <ProtectedRoute path="/settings" component={Settings} />
            </div>

            <Route path="*" component={() => "Error 404 Page not Found"} />
          </Switch>

        </div>
      </Router>)

  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Router><App /></Router>, rootElement);

export default App;

