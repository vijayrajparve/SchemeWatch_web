import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import React, { useState, useEffect } from "react";
import { auth, db } from "../components/Firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore"; // Added deleteDoc
import { useAuth } from "../hooks/useAuth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      console.log("Attempting login with email:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log("User signed in:", firebaseUser.uid);

      const userDoc = await getDoc(doc(db, "Users", firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const status = userData.status || "active";

        if (status === "inactive") {
          await auth.signOut();
          console.log("Inactive user, signed out");
          // **Modified**: Ensure toast is displayed with a delay to avoid timing issues
          setTimeout(() => {
            toast.error("Your login is disabled. Please contact the admin.", {
              position: "bottom-center",
              autoClose: 5000,
            });
          }, 100);
          setIsLoggingIn(false);
          return;
        }

        // Update Users collection with status and lastLogin timestamp
        await setDoc(
          doc(db, "Users", firebaseUser.uid),
          {
            status: "active",
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );

        // Add user to activeUsers collection with updated lastActive
        await setDoc(
          doc(db, "activeUsers", firebaseUser.uid),
          {
            ...userData,
            lastActive: serverTimestamp(),
            status: "active",
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );

        // Remove from inactiveUsers if exists
        const inactiveDocRef = doc(db, "inactiveUsers", firebaseUser.uid);
        const inactiveDocSnap = await getDoc(inactiveDocRef);
        if (inactiveDocSnap.exists()) {
          await deleteDoc(inactiveDocRef);
          console.log("User removed from inactiveUsers");
        }

        console.log("User role:", userData.role);
        toast.success("User logged in successfully!", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/dashboard");
      } else {
        await auth.signOut();
        console.log("User data not found, signed out");
        // **Modified**: Ensure toast is displayed with a delay
        setTimeout(() => {
          toast.error("User data not found. Please contact the admin.", {
            position: "bottom-center",
            autoClose: 5000,
          });
        }, 100);
      }
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      // **Modified**: Ensure toast is displayed with a delay
      setTimeout(() => {
        toast.error(`Login failed: ${error.message}`, {
          position: "bottom-center",
          autoClose: 5000,
        });
      }, 100);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Password reset email sent!", {
        position: "top-center",
        autoClose: 3000,
      });
      setForgotPassword(false);
      setResetEmail("");
    } catch (error) {
      console.error("Password reset error:", error.message);
      // **Modified**: Ensure toast is displayed with a delay
      setTimeout(() => {
        toast.error("Failed to send reset email. Try again later.", {
          position: "bottom-center",
          autoClose: 5000,
        });
      }, 100);
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
          transform: "none",
          transition: "none",
        }}
      >
        {forgotPassword ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePasswordReset();
            }}
          >
            <h3 className="text-center mb-4">Reset Password</h3>
            <div className="mb-3">
              <label className="form-label text-start d-block">
                Enter your email
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-block">
                Send Reset Email
              </button>
            </div>
            <p
              className="text-center text-muted mt-3"
              onClick={() => setForgotPassword(false)}
              style={{ cursor: "pointer" }}
            >
              Remember your password? Login
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="text-center mb-4">Login</h3>
            <div className="mb-3">
              <label className="form-label text-start d-block">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label text-start d-block">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p
              className="text-center text-muted mt-3"
              style={{ cursor: "pointer" }}
              onClick={() => setForgotPassword(true)}
            >
              Forgot password?
            </p>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
            </div>
            <p className="text-center text-muted mt-3">
              Don't have an account yet?{" "}
              <a href="/register" className="text-decoration-none">
                Register
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;