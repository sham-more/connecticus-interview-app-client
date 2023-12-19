// App.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from 'assets/theme';
import { AuthProvider } from 'contex/AuthContext';
import routes from 'routes';
import PrivateRoute from './Routes/PrivateRoute';

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



          {/* Default route for unauthorized access */}

          <Route path="*" element={<Navigate to="/sign-in" />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
