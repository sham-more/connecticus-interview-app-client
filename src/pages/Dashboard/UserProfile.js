// UserProfile.js
import React from 'react';
import { useAuth } from '../../contex/AuthContext';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const UserProfile = () => {
    const { state } = useAuth();


    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", height: "500px", width: "100%", justifyContent: "center", alignItems: "center" }}>
            <h2>Welcome,User!</h2>
            <button style={{ padding: "5px", width: "120px", border: "2px solid green", borderRadius: "10px" }}>
                <Link to="/quiz-screen">Go to Quiz</Link>
            </button>
        </div>
    );
};
export default UserProfile
