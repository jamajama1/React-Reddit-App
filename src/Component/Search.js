import React, { Component } from 'react';
import Categorybox from './Extras/Categorybox';
import { Link } from 'react-router-dom';

class Search extends Component{
    state = {
        posts: [],
        filteredPosts: [],
        currentUser: sessionStorage.getItem("user"),
        search: ""
    }
    search() {

        this.setState({posts: []});
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/postcontroller.php", {
            method: "post",
            body: JSON.stringify({
                action: "getPosts"
            })
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log("searching for: ");
                    console.log(this.state.search);
                    console.log(result.posts.length);
                    for(var i = 0; i < result.posts.length; i++) {
                        if (result.posts[i].post_type == this.state.search || 
                            result.posts[i].post_text.includes(this.state.search)) {
                                console.log(this.state.posts[i]);
                                var joined = this.state.posts.concat(result.posts[i] || [])
                                this.setState({posts: joined});
                        }
                    }
                    console.log("result: ");
                    console.log(this.state.posts)
                },
                (error) => {
                    alert("error!");
                }
            ).then(e => {
                    /* console.log("in get messages");
                    console.log(result);
                    var joined = this.state.posts.concat(result.posts || [])
                    this.setState({posts: joined});
                    console.log(this.state.posts) */
                },
                (error) => {
                    alert("error!");
                }
            )
    }


    handleChange({ target }) {
        this.setState({
          [target.name]: target.value
        });
      }


    render() {
        return (
            <main className="searchbox">
                <div className="categories">

                    <Categorybox name="Art" description="Hey you... I'll be your Mona Lisa"/>
                    <Categorybox name="Business" description="Get your bread up!"/>
                    <Categorybox name="Health&Medicine" description="An apple a... A topix a day!"/>
                    <Categorybox name="SocialSciences" description="Human society and social relationships"/>
                    <Categorybox name="Engineering" description="Let's build it!"/>
                    <Categorybox name="Technology" description="A RAM is a computer's favorite animal"/>
                </div>
                <div className="searchbar">
                <input type="text" name="search" placeholder="Search..." value={ this.state.search } onChange={ this.handleChange.bind(this) } />
                    <button className="button" onClick={ this.search.bind(this) }><i class="fas fa-search"></i></button>
                </div>

                <ul className="results">
                {this.state.posts  && this.state.posts.map(post => (
                        <div className="postBlock">
                            <div className="postContent">
                                <header> Post made by User: {post.user_id} </header>
                                <Link className="lint" to={`/post/${post.post_id}`}> <img className="specImg" src={post.post_pic_url} alt={post.post_id}/> </Link>
                                <div className="captione">
                                    <p> {post.post_text} </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </ul>
            </main>
        );
    }
}
export default Search;