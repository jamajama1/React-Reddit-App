class Auth {
    constructor() {
        this.authenticated = false;
        this.username = "";
        this.sessiontoken = "";
    }

    login() {
        if (sessionStorage.getItem("user") !== "") {
            this.authenticated = true;
            this.username = sessionStorage.getItem("user");
            this.sessiontoken = sessionStorage.getItem("token");
        }
    }

    logout() {
        fetch("http://webdev.cse.buffalo.edu/cse410/gr8/api/SocialAuth.php", {
            method: "post",
            body: JSON.stringify({
                action: "logout",
                username: this.username,
                session_token: this.sessiontoken
            })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result.message);
                console.log("just logged off");
                this.authenticated = false;
                this.username = "";
                this.sessiontoken = "";
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");

            });
    }

    isAuthenticated() {
        return this.authenticated;
    }
}

export default new Auth()