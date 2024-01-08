// App.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from 'assets/theme';
import { AuthProvider } from 'contex/AuthContext';
import routes from 'routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from './Routes/PrivateRoute';

/**
 * Author: Shyam More
 * Organization: Connecticus Technologies
 */

const App = () => {

  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.name}
              path={route.route}
              element={
                route.roles ? (
                  <PrivateRoute
                    roles={route.roles}
                    component={route.component}
                  />
                ) : (
                  <route.component />
                )
              }
            />
          ))}



          {/* Default route for unauthorized access or we also can redirect to not found page */}

          <Route path="*" element={<Navigate to="/pagenotfound" />} />
          <Route path="/" element={<Navigate to="/sign-in" />} />
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;
