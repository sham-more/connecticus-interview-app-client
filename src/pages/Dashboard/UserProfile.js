// UserProfile.js
import React from 'react';
import { useAuth } from '../../contex/AuthContext';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Dispatch the 'LOGOUT' action
        dispatch({
            type: 'LOGOUT',
        });

        toast.success('Logout successful!', {
            position: "bottom-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });





        // Redirects to the login page 
        navigate('/sign-in');

    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '500px', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <h1>Welcome, {state.firstName}!</h1>
            <div style={{ display: "flex", gap: "30px" }}>

                <Button variant="outlined" color="primary"  >
                    <Link to="/quiz-screen">Go to Quiz</Link>
                </Button>
                <Button variant="outlined" color="primary" onClick={handleLogout}>
                    <Link>Logout</Link>
                </Button>

            </div>

        </div>

    );
};

export default UserProfile;

