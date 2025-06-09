import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/Register";
import UpdateRegister from "./pages/UpdateRegister";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./admin/AdminDashboard";
import Profile from "./pages/Profile";
import AboutUs from "./pages/AboutUs";
import { AuthProvider } from "./hooks/useAuth";
import OfficerDash from "./researchofficer/OfficerDash";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AdminParentFeedbackForm from "./admin/ParentFeedbackForm";
import AdminObservationForm from "./admin/ObservationForm";
import AdminSchoolForm from "./admin/SchoolForm";
import AdminUpdateParentForm from "./admin/UpdateParentForm";
import AdminUpdateObserveForm from "./admin/UpdateObserveForm";
import AdminUpdateSchoolForm from "./admin/UpdateSchoolForm";
import ParentFeedback from "./admin/ParentFormTable";
import SchoolFeedback from "./admin/SchoolFormTable";
import ObservationFeedback from "./admin/ObservationFormTable";
import FindSchool from "./admin/FindSchool";
import ResearchParentFeedbackForm from "./researchofficer/ParentFeedbackForm";
import ResearchObservationForm from "./researchofficer/ObservationForm";
import ResearchSchoolForm from "./researchofficer/SchoolForm";
import ResearchUpdateParentForm from "./researchofficer/UpdateParentForm";
import ResearchUpdateObserveForm from "./researchofficer/UpdateObserveForm";
import ResearchUpdateSchoolForm from "./researchofficer/UpdateSchoolForm";

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

function Unauthorized() {
  return <h3>Access Denied: You do not have permission to view this page.</h3>;
}

function ErrorPage() {
  return (
    <div className="text-center mt-5">
      <h3>Error: Failed to load user data</h3>
      <p>Please try logging in again or contact support.</p>
      <a href="/login" className="btn btn-primary">Back to Login</a>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            <Route path="/about_us" element={<AboutUs />} />
            <Route
              path="/update-register/:userId"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UpdateRegister />
                </ProtectedRoute>
              }
            />

           {/* Admin Form Routes (Admin and Research Officer) */}
           <Route
              path="/parent_form"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <AdminParentFeedbackForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/observation_form"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <AdminObservationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school_form"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <AdminSchoolForm />
                </ProtectedRoute>
              }
            />

            {/* Research Officer Form Routes (Admin and Research Officer) */}
            <Route
              path="/research_parent_form"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <ResearchParentFeedbackForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research_observation_form"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <ResearchObservationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research_school_form"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <ResearchSchoolForm />
                </ProtectedRoute>
              }
            />

            {/* Update Form Routes (Admin and Research Officer) */}
            <Route
              path="/update_parent_form/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <AdminUpdateParentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update_observation_form/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <AdminUpdateObserveForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update_school_form/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <AdminUpdateSchoolForm />
                </ProtectedRoute>
              }
            />

            {/* Research Officer Update Form Routes (Admin and Research Officer) */}
            <Route
              path="/research_update_parent_form/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <ResearchUpdateParentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research_update_observation_form/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <ResearchUpdateObserveForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/research_update_school_form/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <ResearchUpdateSchoolForm />
                </ProtectedRoute>
              }
            />

            {/* Form Routes 
            <Route path="/parent_form" element={<ParentFeedbackForm />} />
            <Route path="/observation_form" element={<ObservationForm />} />
            <Route path="/school_form" element={<SchoolForm />} />*/}

            {/* Update Form Routes (Protected for Admin and Research Officer) 
            <Route
              path="/update_parent_form/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <UpdateParentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update_observation_form/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <UpdateObserveForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/update_school_form/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <UpdateSchoolForm />
                </ProtectedRoute>
              }
            />*/}

            {/* Admin Component Routes */}
            <Route
              path="/parent-feedback"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ParentFeedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school-feedback"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SchoolFeedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/observation-feedback"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ObservationFeedback />
                </ProtectedRoute>
              }
            />
            <Route
              path="/find-school"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <FindSchool />
                </ProtectedRoute>
              }
            />

            {/* Dashboard Routes */}
            <Route
              path="/admin_dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/officer_dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "Research Officer"]}>
                  <OfficerDash />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "Research Officer", "Field Officer", "Assistant Field Officer"]}
                >
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Error and Unauthorized Routes */}
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;