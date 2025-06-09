import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { auth, db } from "../components/Firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import slider1 from "../images/slider1.jpg";
import slider2 from "../images/slider2.jpg";
import slider3 from "../images/slider3.jpg";
import slider4 from "../images/slider4.jpg";
import Mid_day_logo from "../images/Mid_day_logo.png";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const aboutUsRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, role, userData, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && userData) {
      console.log("Dashboard userData:", userData);
      setUserName(userData.firstName || user.displayName || "User");
    }
  }, [user, userData]);

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#212529" : "#f4f7fa";
    return () => {
      document.body.style.backgroundColor = ""; // Clean up on unmount
    };
  }, [isDarkMode]);

  async function handleLogout() {
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
  }

  const scrollToAboutUs = () => {
    aboutUsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const renderAboutUs = () => (
    <section ref={aboutUsRef} style={{ padding: "3rem 0", backgroundColor: isDarkMode ? "#2c3e50" : "#f8f9fa" }}>
      <div style={{ padding: "0 15px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", margin: "0 -15px" }}>
          <div style={{ flex: "0 0 100%", padding: "0 15px", textAlign: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ color: isDarkMode ? "#f8f9fa" : "#343a40" }}>About PM-POSHAN Scheme</h2>
            <div style={{ width: "80px", height: "4px", background: isDarkMode ? "#4dabf7" : "#339af0", margin: "0.5rem auto", borderRadius: "2px" }}></div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", margin: "0 -15px" }}>
          <div style={{ flex: "0 0 50%", padding: "0 15px", marginBottom: "1.5rem" }}>
            <div style={{
              borderRadius: "12px",
              overflow: "hidden",
              height: "100%",
              transition: "transform 0.3s ease",
              background: isDarkMode ? "#343a40" : "white",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                borderBottom: `1px solid ${isDarkMode ? "#495057" : "#e9ecef"}`,
              }}>
                <i className="fas fa-history" style={{ fontSize: "1.5rem", marginRight: "1rem", color: isDarkMode ? "#4dabf7" : "#339af0" }}></i>
                <h3 style={{ fontSize: "1.3rem", marginBottom: 0, color: isDarkMode ? "#f8f9fa" : "#343a40" }}>History</h3>
              </div>
              <div style={{ padding: "1.5rem" }}>
                <p style={{ color: isDarkMode ? "#ced4da" : "#495057", marginBottom: 0 }}>
                  The Mid Day Meal Scheme has been implemented in Puducherry since <strong>1930</strong>
                  under French administration. In independent India, Tamil Nadu pioneered the scheme
                  in the early 1960s under former Chief Minister <strong>K. Kamaraj</strong>.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "0 0 50%", padding: "0 15px", marginBottom: "1.5rem" }}>
            <div style={{
              borderRadius: "12px",
              overflow: "hidden",
              height: "100%",
              transition: "transform 0.3s ease",
              background: isDarkMode ? "#343a40" : "white",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                borderBottom: `1px solid ${isDarkMode ? "#495057" : "#e9ecef"}`,
              }}>
                <i className="fas fa-chart-line" style={{ fontSize: "1.5rem", marginRight: "1rem", color: isDarkMode ? "#4dabf7" : "#339af0" }}></i>
                <h3 style={{ fontSize: "1.3rem", marginBottom: 0, color: isDarkMode ? "#f8f9fa" : "#343a40" }}>Current Reach</h3>
              </div>
              <div style={{ padding: "1.5rem" }}>
                <p style={{ color: isDarkMode ? "#ced4da" : "#495057", marginBottom: 0 }}>
                  Serving <strong>120 million children</strong> in over <strong>1.27 million schools</strong>,
                  it is the largest school meal program in the world. In 2022, <strong>24 lakh pre-primary students</strong>
                  were included in the scheme.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "0 0 50%", padding: "0 15px", marginBottom: "1.5rem" }}>
            <div style={{
              borderRadius: "12px",
              overflow: "hidden",
              height: "100%",
              transition: "transform 0.3s ease",
              background: isDarkMode ? "#343a40" : "white",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                borderBottom: `1px solid ${isDarkMode ? "#495057" : "#e9ecef"}`,
              }}>
                <i className="fas fa-gavel" style={{ fontSize: "1.5rem", marginRight: "1rem", color: isDarkMode ? "#4dabf7" : "#339af0" }}></i>
                <h3 style={{ fontSize: "1.3rem", marginBottom: 0, color: isDarkMode ? "#f8f9fa" : "#343a40" }}>Legal Framework</h3>
              </div>
              <div style={{ padding: "1.5rem" }}>
                <p style={{ color: isDarkMode ? "#ced4da" : "#495057" }}>
                  Under <strong>Article 24 of the Convention on the Rights of the Child</strong>,
                  India has committed to providing "adequate nutritious food" for children. The scheme is covered under the
                  <strong>National Food Security Act, 2013</strong>.
                </p>
              </div>
            </div>
          </div>

          <div style={{ flex: "0 0 50%", padding: "0 15px", marginBottom: "1.5rem" }}>
            <div style={{
              borderRadius: "12px",
              overflow: "hidden",
              height: "100%",
              transition: "transform 0.3s ease",
              background: isDarkMode ? "#343a40" : "white",
              boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.05)",
            }}>
              <div style={{
                padding: "1.5rem",
                display: "flex",
                alignItems: "center",
                borderBottom: `1px solid ${isDarkMode ? "#495057" : "#e9ecef"}`,
              }}>
                <i className="fas fa-users" style={{ fontSize: "1.5rem", marginRight: "1rem", color: isDarkMode ? "#4dabf7" : "#339af0" }}></i>
                <h3 style={{ fontSize: "1.3rem", marginBottom: 0, color: isDarkMode ? "#f8f9fa" : "#343a40" }}>Impact</h3>
              </div>
              <div style={{ padding: "1.5rem" }}>
                <p style={{ color: isDarkMode ? "#ced4da" : "#495057", marginBottom: 0 }}>
                  The program has shown significant improvement in school attendance,
                  particularly among girls, and has helped reduce classroom hunger while
                  improving nutritional status of children across India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  if (authLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#212529" : "#f4f7fa",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ border: "4px solid #007bff", borderRadius: "50%", borderTop: "4px solid transparent", width: "40px", height: "40px", animation: "spin 1s linear infinite" }}></div>
          <p style={{ marginTop: "1rem", color: isDarkMode ? "#f8f9fa" : "#343a40" }}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: isDarkMode ? "#212529" : "#f4f7fa",
    }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 sticky-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link className="navbar-brand d-flex align-items-center">
              <img
                src={Mid_day_logo}
                alt="Logo"
                style={{ height: "40px", marginRight: "10px" }}
              />
              <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Home</span>
            </Link>
            <ul className="navbar-nav d-flex flex-row">
              {role === "admin" && (
                <li className="nav-item mx-2">
                  <Link className="nav-link text-white" to="/admin_dashboard">
                    Admin
                  </Link>
                </li>
              )}
              <li className="nav-item mx-2">
                <Link className="nav-link text-white" to="/officer_dashboard">
                  Research Officer
                </Link>
              </li>
              <li className="nav-item mx-2">
                <span
                  className="nav-link text-white"
                  style={{ cursor: "pointer" }}
                  onClick={scrollToAboutUs}
                >
                  About Us
                </span>
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-light"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Logout"
              )}
            </button>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        <section style={{ padding: "3rem 0", textAlign: "center" }}>
          <div style={{ padding: "0 15px" }}>
            <div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem", color: isDarkMode ? "#f8f9fa" : "#343a40" }}>
                Welcome, {role === "admin" ? "Admin" : userData?.firstName || userName || "User"}!
              </h1>
              <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto", color: isDarkMode ? "#ced4da" : "#6c757d" }}>
                Managing the PM-POSHAN Scheme for a healthier, educated India
              </p>
            </div>
          </div>
        </section>

        <section style={{ padding: "2rem 0" }}>
          <div style={{ padding: "0 15px" }}>
            {/* CHANGE: Removed background color and adjusted container styles to avoid white background */}
            <div id="dashboardCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000" style={{ borderRadius: "12px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <div className="carousel-inner">
                {[slider1, slider2, slider3, slider4].map((img, index) => (
                  <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={img}>
                    {/* CHANGE: Set height: "auto", maxHeight: "100vh", and objectFit: "contain" to fit entire image within viewport without cropping or scrolling */}
                    <img
                      src={img}
                      style={{ width: "100%", height: "auto", maxHeight: "100vh", objectFit: "contain", display: "block" }}
                      alt={`Slide ${index + 1}`}
                    />
                    <div style={{ background: "rgba(0,0,0,0.6)", padding: "1rem", borderRadius: "8px", position: "absolute", bottom: "10px", left: "50%", transform: "translateX(-50%)" }}>
                      <h5 style={{ color: "#fff" }}>
                        {index === 0 ? "Supporting Education" :
                         index === 1 ? "Healthy Nutrition" :
                         index === 2 ? "Community Growth" : "Bright Futures"}
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
              {/* CHANGE: Added inline styles to make carousel navigation arrows black for better visibility */}
              <button className="carousel-control-prev" type="button" data-bs-target="#dashboardCarousel" data-bs-slide="prev" style={{ filter: "invert(100%)" }}>
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#dashboardCarousel" data-bs-slide="next" style={{ filter: "invert(100%)" }}>
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </section>

        <section style={{ padding: "3rem 0", margin: "2rem 0", backgroundColor: isDarkMode ? "#343a40" : "#e9ecef" }}>
          <div style={{ padding: "0 15px" }}>
            <blockquote style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", fontSize: "1.5rem", fontStyle: "italic", color: isDarkMode ? "#f8f9fa" : "#495057" }}>
              <i className="fas fa-quote-left" style={{ fontSize: "2rem", color: isDarkMode ? "#adb5bd" : "#6c757d", marginBottom: "1rem", display: "block" }}></i>
              <p>The Mid Day Meal Scheme nourishes both body and mind, empowering India's future.</p>
              <footer style={{ fontSize: "1rem", marginTop: "1rem", fontStyle: "normal", color: isDarkMode ? "#ced4da" : "#6c757d" }}>- Ministry of Education</footer>
            </blockquote>
          </div>
        </section>

        {renderAboutUs()}
      </main>

      <footer style={{ textAlign: "center", marginTop: "5rem", padding: "1rem 0", backgroundColor: "#6c757d", color: "#f8f9fa" }}>
        <p style={{ marginBottom: 0 }}>© 2025 PM-POSHAN Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;