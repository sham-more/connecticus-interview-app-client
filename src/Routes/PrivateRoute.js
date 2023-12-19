
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contex/AuthContext';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    const { state } = useAuth();

    console.log("User Role :" + state.role);

    if (!state.token) {
        return <Navigate to="/sign-in" />;
    }

    if (roles && roles !== state.role) {
        return <Navigate to="/unauthorized" />;
    }



    return roles ? <Component {...rest} /> : <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
