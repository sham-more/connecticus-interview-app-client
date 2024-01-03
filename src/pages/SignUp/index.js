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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const errors = {};

    // Validate first name
    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }

    // Validate last name
    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
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

    // Check if any field is empty
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      errors.general = "All fields are required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleSignUp = async () => {
    try {

      // Validate form before making the API call
      if (!validateForm()) {
        return;
      }


      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (response.ok) {

        const userData = await response.json();


        // Stores the token in local storage
        localStorage.setItem('token', userData.token);
        localStorage.setItem("email", userData.email);
        localStorage.setItem("firstName", userData.firstName);

        //Successfully registered
        toast.success('Registration successful!', {
          position: "bottom-left",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });



        // Redirect to the SignIn page
        navigate('/sign-in');
      } else {


        // Display error toast when user already present
        toast.error('user already exist!', {
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


      // Display error toast
      toast.error('Error during registration. Please try again later.');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior
    handleSignUp();
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
          <Grid item xs={11} sm={9} md={5} lg={4} xl={3} style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "25px" }}>
            <Card style={{ width: "600px" }}>
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
              <MKBox pt={1} pb={3} px={3}>
                <MKBox component="form" role="form" onSubmit={handleFormSubmit}>
                  <MKBox mb={2} mt={3} position="relative">
                    <MKInput
                      type="text"
                      label="First Name" s
                      value={firstName}
                      fullWidth
                      onChange={(e) => setFirstName(e.target.value)}
                      error={formErrors.firstName}
                    />
                    {formErrors.firstName && (
                      <MKTypography
                        variant="caption"
                        color="error"
                        sx={{ position: 'absolute', bottom: '-20px', left: '8px' }}
                      >
                        {formErrors.firstName}
                      </MKTypography>
                    )}
                  </MKBox>
                  <MKBox mb={2} mt={3} position="relative">
                    <MKInput
                      type="text"
                      label="Last Name"
                      value={lastName}
                      fullWidth
                      onChange={(e) => setLastName(e.target.value)}
                      error={formErrors.lastName}
                    />
                    {formErrors.lastName && (
                      <MKTypography
                        variant="caption"
                        color="error"
                        sx={{ position: 'absolute', bottom: '-20px', left: '8px' }}
                      >
                        {formErrors.lastName}
                      </MKTypography>
                    )}
                  </MKBox>
                  <MKBox mb={2} mt={3} position="relative">
                    <MKInput
                      type="email"
                      label="Email"
                      value={email}
                      fullWidth
                      onChange={(e) => setEmail(e.target.value)}
                      error={formErrors.email}
                    />
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
                    <MKInput
                      type="password"
                      label="Password"
                      value={password}
                      fullWidth
                      onChange={(e) => setPassword(e.target.value)}
                      error={formErrors.password}
                    />
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

                  <MKBox mt={4} mb={1}>
                    <MKButton variant="gradient" color="info" fullWidth onClick={handleSignUp}>
                      Sign Up
                    </MKButton>
                  </MKBox>

                  <MKBox mt={3} mb={1} textAlign="center">
                    <MKTypography variant="button" color="text">
                      Already have an account?{' '}
                      <MKTypography
                        component={Link}
                        to="/sign-in"
                        variant="button"
                        color="info"
                        fontWeight="medium"
                        textGradient
                      >
                        Sign in
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

export default SignUp;
