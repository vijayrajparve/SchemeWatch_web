import React, { useState, useEffect } from "react";
import { auth, db } from "../components/Firebase";
import { doc, getDoc, updateDoc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MidDayMealLogo from "../images/Mid_day_logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMoon, faSun, faEdit, faSignOutAlt, faArrowLeft, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log("Profile fetched user data:", data);
            setUserData(data);
            setFormData({
              firstName: data.firstName || "N/A",
              lastName: data.lastName || "N/A",
            });
          } else {
            console.warn("No profile data found for UID:", user.uid);
            toast.error("No profile data found!");
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error("Error fetching profile: " + error.message);
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    };
    fetchUserData();
  }, [navigate]);

 // Updated handleLogout function to match Dashboard component
const handleLogout = async () => {
  if (!window.confirm("Are you sure you want to logout?")) return;

  setLoading(true);
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }

    let userData = {
      email: currentUser.email || "N/A",
      firstName: "N/A",
      lastName: "N/A",
      role: "Unknown",
    };
    const userDocRef = doc(db, "Users", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      userData = { ...userData, ...userDocSnap.data() };
    } else {
      console.warn("Users document missing for UID:", currentUser.uid);
    }

    const inactiveDocRef = doc(db, "inactiveUsers", currentUser.uid);
    const inactiveDocSnap = await getDoc(inactiveDocRef);

    if (!inactiveDocSnap.exists()) {
                await setDoc(inactiveDocRef, {
                  ...userData,
                  lastInactive: serverTimestamp(), // **Change**: Corrected to lastInactive
                });
                console.log("User added to inactiveUsers");
              } else {
                await setDoc(
                  inactiveDocRef,
                  { lastInactive: serverTimestamp() },
                  { merge: true }
                );
                console.log("Updated lastInactive in inactiveUsers");
              }

    const activeDocRef = doc(db, "activeUsers", currentUser.uid);
    const activeDocSnap = await getDoc(activeDocRef);
    if (activeDocSnap.exists()) {
      await deleteDoc(activeDocRef);
      console.log("User removed from activeUsers");
    } else {
      console.log("No activeUsers document to delete");
    }

    // Update the Users collection with lastInactive timestamp
    await setDoc(
      doc(db, "Users", currentUser.uid),
      {
        lastLogout: serverTimestamp(),
        lastInactive: serverTimestamp(),
      },
      { merge: true }
    );

    await auth.signOut();
    toast.success("Logged out successfully!", { position: "top-right" });
    setTimeout(() => navigate("/login"), 1500);
  } catch (error) {
    console.error("Logout error:", error);
    toast.error(`Error logging out: ${error.message}`, {
      position: "top-right",
    });
  } finally {
    setLoading(false);
  }
};

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, formData);
      setUserData((prev) => ({ ...prev, ...formData }));
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "dark-theme" : "light-theme"} style={{ minHeight: "100vh", paddingBottom: "80px" }}>
      <nav className="navbar navbar-dark bg-primary px-3 sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <img src={MidDayMealLogo} alt="Mid Day Meal Logo" style={{ height: "40px", marginRight: "10px" }} />
            <span className="fs-4 fw-bold text-white">Profile</span>
          </div>
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-light" onClick={handleLogout} disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Logout"}
            </button>
          </div>
        </div>
      </nav>


      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 overflow-hidden mb-4">
              <div className="card-header bg-transparent">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="mb-0" style={{ color: isDarkMode ? "#f8f9fa" : "#343a40" }}>
                    {isEditing ? "Edit Profile" : "My Profile"}
                  </h2>
                  <button
                    onClick={() => navigate(-1)}
                    className={`btn ${isDarkMode ? "btn-outline-light" : "btn-outline-secondary"} btn-sm`}
                   >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                    Back
                  </button>
                </div>
              </div>

              <div className="card-body">
                {userData ? (
                  <div className="row">
                    <div className="col-md-4 text-center mb-4 mb-md-0">
                      {userData.photoURL ? (
                        <img
                          src={userData.photoURL}
                          alt={`${userData.firstName} ${userData.lastName}'s profile`}
                          className="rounded-circle img-thumbnail mb-3"
                          style={{ width: "180px", height: "180px", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          className="rounded-circle img-thumbnail mb-3 d-flex justify-content-center align-items-center mx-auto"
                          style={{
                            width: "180px",
                            height: "180px",
                            backgroundColor: isDarkMode ? "#495057" : "#e9ecef",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faUser}
                            size="4x"
                            style={{ color: isDarkMode ? "#f8f9fa" : "#6c757d" }}
                          />
                        </div>
                      )}

                      <h4 className="mb-1" style={{ color: isDarkMode ? "#f8f9fa" : "#343a40" }}>
                        {(userData.firstName || "N/A").toUpperCase()} {(userData.lastName || "N/A").toUpperCase()}
                      </h4>

                      <span
                        className="badge text-white"
                        style={{
                          backgroundColor: "#343a40", // Charcoal dark gray (professional look)
                          fontSize: "1rem",           // Slightly larger text
                          textTransform: "uppercase"
                        }}
                      >
                        {userData.role || "N/A"}
                      </span>


                    </div>

                    <div className="col-md-8">
                      {isEditing ? (
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              className={`form-control ${isDarkMode ? "bg-dark text-white" : ""}`}
                              placeholder="First Name"
                              style={{ textTransform: "uppercase" }}
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              className={`form-control ${isDarkMode ? "bg-dark text-white" : ""}`}
                              placeholder="Last Name"
                              style={{ textTransform: "uppercase" }}
                            />
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-end gap-2">
                              <button
                                className="btn btn-secondary"
                                onClick={handleEditToggle}
                              >
                                <FontAwesomeIcon icon={faTimes} className="me-2" />
                                Cancel
                              </button>
                              <button
                                className="btn btn-primary"
                                onClick={handleSave}
                                disabled={loading}
                              >
                                {loading ? (
                                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                ) : (
                                  <FontAwesomeIcon icon={faSave} className="me-2" />
                                )}
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="row g-3">
                          <div className="col-12">
                            <h5 className="mb-3" style={{ color: isDarkMode ? "#f8f9fa" : "#343a40" }}>Personal Information</h5>
                            <div className="list-group">
                              <div className={`list-group-item ${isDarkMode ? "bg-dark text-white border-secondary" : ""}`}>
                                <div className="d-flex justify-content-between">
                                  <span className="fw-bold">Email:</span>
                                  <span>{userData.email || "N/A"}</span>
                                </div>
                              </div>
                              <div className={`list-group-item ${isDarkMode ? "bg-dark text-white border-secondary" : ""}`}>
                                <div className="d-flex justify-content-between">
                                  <span className="fw-bold">First Name:</span>
                                  <span>{userData.firstName.toUpperCase() || "N/A"}</span>
                                </div>
                              </div>
                              <div className={`list-group-item ${isDarkMode ? "bg-dark text-white border-secondary" : ""}`}>
                                <div className="d-flex justify-content-between">
                                  <span className="fw-bold">Last Name:</span>
                                  <span>{userData.lastName.toUpperCase() || "N/A"}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-12 mt-4">
                            <button
                              className="btn btn-primary me-2"
                              onClick={handleEditToggle}
                            >
                              <FontAwesomeIcon icon={faEdit} className="me-2" />
                              Edit Profile
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="lead" style={{ color: isDarkMode ? "#f8f9fa" : "#343a40" }}>
                      No user data found!
                    </p>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>
      </div>

      <footer
        className="text-center py-3"
        style={{
          backgroundColor: "#6c757d",
          color: "#f8f9fa",
          position: "fixed",
          bottom: 0,
          width: "100%",
          margin: 0,
          padding: "1rem 0",
          left: 0
        }}
      >
        <p className="mb-0">© 2025 PM-POSHAN Profile. All rights reserved.</p>
      </footer>


      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default Profile;