// AuthContext.js
import React, { createContext, useContext, useReducer } from 'react';

const AuthContext = createContext();

const initialToken = localStorage.getItem('token');
const initialUserRole = localStorage.getItem("role");

const initialState = {

    token: initialToken || null,
    role: initialUserRole || null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem("role", action.payload.role);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                role: action.payload.role,
            };
        case 'LOGOUT':
            localStorage.removeItem('token');
            localStorage.removeItem("role");
            return {
                ...state,
                user: null,
                token: null,
                role: null,
            };
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };
