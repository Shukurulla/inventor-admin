// App.jsx - Updated with new routes
import React, { useEffect } from "react";
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
import UserDetail from "./pages/UserDetail";
import UniversityStructure from "./pages/UniversityStructure";
import Statistics from "./pages/Statistics";
// import AddedPage from "./pages/AddedPage";
import SpecificationsPage from "./pages/SpecificationsPage";
import AdminEquipmentPage from "./pages/AdminEquipmentPage";
import ContractsPage from "./pages/ContractsPage";

// Role-based route protection component
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("userRole") || "manager";

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App = () => {
  useEffect(() => {
    // Initialize theme and other settings
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
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

              {/* Routes available to all authenticated users */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="specifications" element={<SpecificationsPage />} />

              {/* Admin-only routes */}
              <Route path="users" element={<Users />} />
              <Route path="users/:userId" element={<UserDetail />} />
              <Route path="admin-equipment" element={<AdminEquipmentPage />} />
              <Route
                path="university-structure"
                element={<UniversityStructure />}
              />
              <Route path="contracts" element={<ContractsPage />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </Provider>
  );
};

export default App;
