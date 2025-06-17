// App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";

// Store
import { store, startTokenRefresh, stopTokenRefresh } from "./store/store";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import UserDetail from "./pages/UserDetail";
import UniversityStructure from "./pages/UniversityStructure";
import Statistics from "./pages/Statistics";

const App = () => {
  useEffect(() => {
    // Start token refresh when app loads
    const token = localStorage.getItem("accessToken");
    if (token) {
      startTokenRefresh();
    }

    // Cleanup on unmount
    return () => {
      stopTokenRefresh();
    };
  }, []);

  return (
    <Provider store={store}>
      <div className="font-inter">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="users/:userId" element={<UserDetail />} />
              <Route path="statistics" element={<Statistics />} />
              <Route
                path="university-structure"
                element={<UniversityStructure />}
              />
            </Route>
          </Routes>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
