import React from 'react';
import Nav from '../Component/Navbar.js';

import '../App.css';
const template = props => (
    <header>
    <nav className="App">
        <Nav />
    </nav>
    <main>
    <div className= "container">
        This is where your Components go. 
    </div>
    </main>
    </header>
);

export default template