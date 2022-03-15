import React from 'react';


const category = props => (

        <div class="searchBlock">
                <a href="/">t/{props.name}</a>
                <p>{props.description}  </p>
                <button>Follow</button>
        </div>


);

export default category;