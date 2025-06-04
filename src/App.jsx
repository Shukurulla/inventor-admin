// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";

// Store
import { store } from "./store/store";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Buildings from "./pages/Buildings";
import Floors from "./pages/Floors";
import Faculties from "./pages/Faculties";
import Rooms from "./pages/Rooms";

const App = () => {
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
              <Route path="buildings" element={<Buildings />} />
              <Route path="floors" element={<Floors />} />
              <Route path="faculties" element={<Faculties />} />
              <Route path="rooms" element={<Rooms />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
