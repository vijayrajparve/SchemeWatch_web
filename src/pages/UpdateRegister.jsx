import React, { useState, useEffect } from "react";
import { db } from "../components/Firebase";
import { doc, getDoc, updateDoc, setDoc, deleteDoc, serverTimestamp  } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function UpdateRegister() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [qualification, setQualification] = useState("");
  const [workExperience, setWorkExperience] = useState("");
  const [status, setStatus] = useState("active");

  const navigate = useNavigate();
  const { userId } = useParams();

  const roles = ["Admin", "Research Officer", "Field Officer", "Assistant Field Officer"];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("UpdateRegister: Fetching data for userId:", userId);
        const userDoc = doc(db, "Users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          console.log("UpdateRegister fetched user data:", data);
          setUserData(data);
          setRole(data.role || "Research Officer");
          setPhoneNumber(data.phoneNumber || "");
          setAge(data.age ? data.age.toString() : "");
          setQualification(data.qualification || "");
          setWorkExperience(data.workExperience || "");
          // **Modified**: Set status to "active" if not defined
          const newStatus = data.status || "active";
          setStatus(newStatus);
          console.log("Final status state:", newStatus);
        } else {
          console.warn("User not found for ID:", userId);
          toast.error("User not found!", { position: "top-center" });
          navigate("/admin_dashboard");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        toast.error("Failed to load user data.", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select a role!", { position: "top-center" });
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      toast.error("Phone number must be exactly 10 digits!", { position: "top-center" });
      return;
    }
    if (!/^\d{1,3}$/.test(age) || parseInt(age) < 18 || parseInt(age) > 100) {
      toast.error("Age must be between 18 and 100!", { position: "top-center" });
      return;
    }
    if (!qualification.trim()) {
      toast.error("Qualification is required!", { position: "top-center" });
      return;
    }
    if (!workExperience.trim()) {
      toast.error("Work experience is required!", { position: "top-center" });
      return;
    }

    try {
      const userDoc = doc(db, "Users", userId);
      const updatedData = {
        role,
        phoneNumber,
        age: Number(age),
        qualification: qualification.trim(),
        workExperience: workExperience.trim(),
        status,
      };
      console.log("Updating user data:", updatedData);
      await updateDoc(userDoc, updatedData);

      // **Modified**: Update activeUsers/inactiveUsers based on status
      if (status === "active") {
        await setDoc(
          doc(db, "activeUsers", userId),
          {
            ...userData,
            role,
            phoneNumber,
            age: Number(age),
            qualification: qualification.trim(),
            workExperience: workExperience.trim(),
            status: "active",
            lastActive: serverTimestamp(),
          },
          { merge: true }
        );
        const inactiveDocRef = doc(db, "inactiveUsers", userId);
        const inactiveDocSnap = await getDoc(inactiveDocRef);
        if (inactiveDocSnap.exists()) {
          await deleteDoc(inactiveDocRef);
          console.log("User removed from inactiveUsers");
        }
      } else {
        await setDoc(
          doc(db, "inactiveUsers", userId),
          {
            ...userData,
            role,
            phoneNumber,
            age: Number(age),
            qualification: qualification.trim(),
            workExperience: workExperience.trim(),
            status: "inactive",
            lastInactive: serverTimestamp(),
          },
          { merge: true }
        );
        const activeDocRef = doc(db, "activeUsers", userId);
        const activeDocSnap = await getDoc(activeDocRef);
        if (activeDocSnap.exists()) {
          await deleteDoc(activeDocRef);
          console.log("User removed from activeUsers");
        }
      }

      console.log("User data updated successfully");
      toast.success("User data updated successfully!", { position: "top-center" });
      navigate("/admin_dashboard");
    } catch (error) {
      console.error("Error updating user data:", error.message);
      toast.error("Failed to update user data. Please try again.", { position: "top-center" });
    }
  };

  const handleStatusToggle = async () => {
    const newStatus = status === "active" ? "inactive" : "active";
    try {
      const userDoc = doc(db, "Users", userId);
      await updateDoc(userDoc, { status: newStatus });

      // **Modified**: Move user between activeUsers and inactiveUsers
      if (newStatus === "active") {
        await setDoc(
          doc(db, "activeUsers", userId),
          {
            ...userData,
            role,
            phoneNumber,
            age: Number(age),
            qualification: qualification.trim(),
            workExperience: workExperience.trim(),
            status: "active",
            lastActive: serverTimestamp(),
          },
          { merge: true }
        );
        const inactiveDocRef = doc(db, "inactiveUsers", userId);
        const inactiveDocSnap = await getDoc(inactiveDocRef);
        if (inactiveDocSnap.exists()) {
          await deleteDoc(inactiveDocRef);
          console.log("User removed from inactiveUsers");
        }
      } else {
        await setDoc(
          doc(db, "inactiveUsers", userId),
          {
            ...userData,
            role,
            phoneNumber,
            age: Number(age),
            qualification: qualification.trim(),
            workExperience: workExperience.trim(),
            status: "inactive",
            lastInactive: serverTimestamp(),
          },
          { merge: true }
        );
        const activeDocRef = doc(db, "activeUsers", userId);
        const activeDocSnap = await getDoc(activeDocRef);
        if (activeDocSnap.exists()) {
          await deleteDoc(activeDocRef);
          console.log("User removed from activeUsers");
        }
      }

      setStatus(newStatus);
      toast.success(`User ${newStatus === "active" ? "enabled" : "disabled"} successfully!`, {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error updating user status:", error.message);
      toast.error("Failed to update user status.", { position: "top-center" });
    }
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 p-3">
      <div className="mb-3 w-100" style={{ maxWidth: "500px" }}>
        <button
          onClick={() => navigate("/admin_dashboard")}
          className="btn btn-outline-secondary btn-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
          Back
        </button>
      </div>
      <style>
        {`
          .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
          }

          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: 0.4s;
            border-radius: 34px;
          }

          .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: 0.4s;
            border-radius: 50%;
          }

          input:checked + .slider {
            background-color: #28a745;
          }

          input:checked + .slider:before {
            transform: translateX(26px);
          }

          .switch-label {
            display: flex;
            align-items: center;
            gap: 10px;
          }
        `}
      </style>
      <div className="card shadow-lg p-3 p-md-4 w-100" style={{ maxWidth: "500px" }}>
        <form onSubmit={handleUpdate}>
          <h3 className="text-center mb-4">Update User Details</h3>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select a role</option>
              {roles.map((roleOption) => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                value={userData?.firstName ? userData.firstName.toUpperCase() : "N/A"}
                readOnly
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={userData?.lastName ? userData.lastName.toUpperCase() : "N/A"}
                readOnly
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={userData?.email || "N/A"}
              readOnly
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter phone number (10 digits)"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) setPhoneNumber(value);
              }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter age"
              value={age}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 3) setAge(value);
              }}
              min="18"
              max="100"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Qualification</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter highest qualification"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Work Experience</label>
            <textarea
              className="form-control"
              placeholder="Describe work experience"
              value={workExperience}
              onChange={(e) => setWorkExperience(e.target.value)}
              rows="3"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">User Status</label>
            <div className="switch-label">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={status === "active"}
                  onChange={handleStatusToggle}
                />
                <span className="slider"></span>
              </label>
              <span>{status === "active" ? "Enabled" : "Disabled"}</span>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-block">
              Update Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateRegister;