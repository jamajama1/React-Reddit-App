import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from './auth';


function ProtectedRoute({ component: Component, ...rest }) {
    return (
        <Route {...rest}
            render={(props) => {
                if (sessionStorage.getItem("token") !== "" && sessionStorage.getItem("token") !== null) {
                    return <Component {...props} />;
                }
                else {
                    return (
                        <Redirect to=
                            {
                                {
                                    pathname: "/",
                                    state: {
                                        from: props.location
                                    }
                                }
                            }
                        />
                    );
                }
            }}
        />

    );
}

export default ProtectedRoute;

