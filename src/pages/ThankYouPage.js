import React, { useState, useEffect } from 'react';
import { useAuth } from '../contex/AuthContext';
import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function ThankYouPage() {
    const { state, dispatch } = useAuth();
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function (event) {
        window.history.pushState(null, null, window.location.href);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowContent(true);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, []);

    const handleLogout = () => {
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

        navigate('/sign-in');
    };

    return (
        <div style={{
            backgroundColor: "white", width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",


        }}>

            <div style={{
                display: "flex",
                width: "750px", height: "400px",
                alignItems: "center",
                flexDirection: "column",
                padding: "50px",
                borderRadius: "10px",
                border: "1.7px solid #49a3f1",

                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",

            }}>
                <dotlottie-player src="https://lottie.host/1be46d60-ed11-4f50-8463-26883fad0044/yDp5ntCwtX.json" background="transparent" style={{ marginTop: "-50px", transition: "opacity 0.5s ease-in-out", height: "350px" }} speed="1" loop={false} autoplay></dotlottie-player>

                {showContent && (
                    <>

                        <div style={{
                            opacity: showContent ? 1 : 0,
                            position: "absolute",
                            transition: "opacity 0.5s ease-in-out",
                            overflow: "hidden",
                        }}>

                        </div>
                        <p style={{ marginTop: "-90px", transition: "opacity 0.5s ease-in-out" }}>Your submission has been sent successfully!</p>
                        <Button variant="outlined" color="primary" onClick={handleLogout} style={{ transition: "opacity 0.5s ease-in-out" }}>
                            <Link>Logout</Link>
                        </Button>
                    </>
                )}
            </div>
        </div >
    );
}

export default ThankYouPage;
