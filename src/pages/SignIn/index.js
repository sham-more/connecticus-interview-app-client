// SignIn.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Switch from "@mui/material/Switch";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKInput from "components/MKInput";
import MKButton from "components/MKButton";
import bgImage from "assets/images/bg-basic.jpeg";
import { useAuth } from 'contex/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function SignIn() {
  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({

    email: "",
    password: "",


  });

  const validateForm = () => {
    const errors = {};

    // Check if any field is empty
    if (!email.trim() || !password.trim()) {
      errors.general = "All fields are required";
    }
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Invalid email address";
    }

    // Validate password
    if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }


    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  // const handleSetRememberMe = () => setRememberMe(!rememberMe);



  const handleSignIn = async () => {
    try {
      // Validate form before making the API call
      if (!validateForm()) {
        return;
      }
      const response = await fetch('http://localhost:9090/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {

        const userData = await response.json();


        // Dispatches the 'LOGIN' action with user data

        dispatch({
          type: 'LOGIN',
          payload: {
            user: userData.user,
            token: userData.token,
            role: userData.role,
            email: userData.email,
            firstName: userData.firstName,
          },
        });





        // Redirect based on the user role


        if (userData.role === 'ADMIN') {
          navigate('/admin/dashboard');

        } else if (userData.role === 'USER') {

          navigate('/user/profile');
        } else {

          // Handle unknown role

          console.error('Unknown user role');
        }

        toast.success('Login successful!', {
          position: "bottom-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

      } else {

        // Handle authentication failure (showes error message)

        toast.error('Invalid credentials!', {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

    } catch (error) {

      toast.error('Error during authentication,try again!', {
        position: "bottom-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior

  };


  return (
    <>
      <MKBox
        position="absolute"
        top={0}
        left={0}
        zIndex={1}
        width="100%"
        minHeight="100vh"
        sx={{
          backgroundImage: ({ functions: { linearGradient, rgba }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.dark.main, 0.6),
              rgba(gradients.dark.state, 0.6)
            )}, url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <MKBox px={1} width="100%" height="100vh" mx="auto" position="relative" zIndex={2}>
        <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
            <Card>
              <MKBox
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                mx={2}
                mt={-3}
                p={2}
                mb={1}
                textAlign="center"
              >
                <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                  Connecticus Quiz App
                </MKTypography>

              </MKBox>
              <MKBox pt={4} pb={3} px={3}>
                <MKBox component="form" role="form" onSubmit={handleFormSubmit} >
                  <MKBox mb={2} position="relative">
                    <MKInput type="email" label="Email" value={email} fullWidth onChange={(e) => setEmail(e.target.value)} error={formErrors.email} />



                    {formErrors.email && (
                      <MKTypography
                        variant="caption"
                        color="error"
                        sx={{ position: 'absolute', bottom: '-20px', left: '8px' }}
                      >
                        {formErrors.email}
                      </MKTypography>
                    )}



                  </MKBox>
                  <MKBox mb={2} mt={3} position="relative">
                    <MKInput type="password" label="Password" value={password} fullWidth onChange={(e) => setPassword(e.target.value)} error={formErrors.password} />
                    {formErrors.password && (
                      <MKTypography
                        variant="caption"
                        color="error"
                        sx={{ position: 'absolute', bottom: '-20px', left: '8px' }}
                      >
                        {formErrors.password}
                      </MKTypography>
                    )}
                  </MKBox>

                  {/* <MKBox display="flex" alignItems="center" ml={-1}>
                    <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                    <MKTypography
                      variant="button"
                      fontWeight="regular"
                      color="text"
                      onClick={handleSetRememberMe}
                      sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                    >
                      &nbsp;&nbsp;Remember me
                    </MKTypography>
                  </MKBox> */}

                  <MKBox mt={4} mb={1}>
                    <MKButton variant="gradient" type="submit" color="info" fullWidth onClick={handleSignIn}>
                      Get Started
                    </MKButton>
                  </MKBox>

                  <MKBox mt={3} mb={1} textAlign="center">
                    <MKTypography variant="button" color="text">
                      Don&apos;t have an account?{' '}
                      <MKTypography
                        component={Link}
                        to="/sign-up"
                        variant="button"
                        color="info"
                        fontWeight="medium"
                        textGradient
                      >
                        Sign up

                      </MKTypography>
                    </MKTypography>
                  </MKBox>
                </MKBox>
              </MKBox>
            </Card>
          </Grid>
        </Grid>
      </MKBox>

    </>
  );
}

export default SignIn;
