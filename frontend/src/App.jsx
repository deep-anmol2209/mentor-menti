import '@fortawesome/fontawesome-free/css/all.min.css';

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Toaster} from "react-hot-toast";
import Dashboard from './page/dashboard/dashboard';
import AllMentors from './page/AllMentors';
import { publicRoutes, dashboardRoutes } from './routes';
import ProtectedRoute from "./components/ProtectedRoute";
// import routes from "./routes";



function App() {
  return (
    <div className='mx-auto max-w-screen-3xl'>
      <Toaster/>
      <Router>
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.isProtected ? (
                <ProtectedRoute>{route.element}</ProtectedRoute>
              ) : (
                route.element
              )}
            />
          ))}

          {/* Dashboard Layout Route */}
          <Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            {dashboardRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element} // No need to double-wrap
              />
            ))}
          </Route>

          {/* Other Routes */}
          <Route path="/mentors" element={<AllMentors />} />
        </Routes>
      </Router>
    </div>
  )
}

const RouteElement = ({ route }) => {
  return route.isProtected ? (<ProtectedRoute>{route.element}</ProtectedRoute>) : (<>{route.element}</>);
};
export default App;
