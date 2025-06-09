import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../components/Firebase";
import { setDoc, doc, runTransaction, collection, getDocs, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const sanitizeInput = (input) => input.replace(/<[^>]*>/g, "");

  const generateEmployeeIdAndSaveUser = async (user, userData) => {
    try {
      const usersRef = collection(db, "Users");
      const usersSnapshot = await getDocs(usersRef);

      const existingIds = usersSnapshot.docs
        .map((doc) => {
          const id = doc.data().employeeId;
          if (id && id.startsWith("SEVA")) {
            const number = parseInt(id.replace("SEVA", ""), 10);
            return isNaN(number) ? null : number;
          }
          return null;
        })
        .filter((num) => num !== null)
        .sort((a, b) => a - b);

      let nextNumber = 1;
      for (const id of existingIds) {
        if (id === nextNumber) {
          nextNumber++;
        } else if (id > nextNumber) {
          break;
        }
      }

      userData.employeeId = `SEVA${nextNumber.toString().padStart(5, "0")}`;

      await runTransaction(db, async (transaction) => {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await transaction.get(userDocRef);

        if (userDoc.exists()) return;

        transaction.set(userDocRef, {
          ...userData,
          createdAt: new Date().toISOString(),
          status: "active", // Set initial status to inactive
          // Remove lastLogin since user has not logged in yet
        });
      });
      return true;
    } catch (error) {
      toast.error(`Failed to save user data: ${error.message}`);
      throw error;
    }
  };

  const onSubmit = async (data) => {
    if (isLoading) return;

    setIsLoading(true);
    const { fname, lname, email, password, phoneNumber, age, qualification, workExperience } = data;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      const userData = {
        email: user.email,
        firstName: sanitizeInput(fname.trim()).toUpperCase(),
        lastName: sanitizeInput(lname.trim()).toUpperCase(),
        role: "Research Officer",
        phoneNumber: phoneNumber.toString(),
        age: Number(age),
        qualification: sanitizeInput(qualification.trim()),
        workExperience: Number(workExperience),
      };

      const saved = await generateEmployeeIdAndSaveUser(user, userData);

      if (saved) {
        console.log("✅ User data saved successfully. Proceeding to sign out.");
        await signOut(auth);
      } else {
        console.warn("⚠ User data not saved properly. Aborting sign out.");
      }

      toast.success("User registered successfully! Please log in.", {
        position: "top-center",
      });

      reset();
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      if (auth.currentUser) {
        try {
          await deleteDoc(doc(db, "Users", auth.currentUser.uid));
        } catch (deleteError) {
          console.error("Failed cleanup:", deleteError);
        }
      }

      toast.error(`Registration failed: ${error.message}`, {
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 p-3">
      <div className="card shadow-lg p-3 p-md-4 w-100" style={{ maxWidth: "500px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className="text-center mb-4">Sign Up</h3>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <input type="text" className="form-control" value="Research Officer" readOnly />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                className="form-control"
                {...register("fname", {
                  required: true,
                  pattern: /^[A-Za-z]+$/,
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                    return e;
                  },
                })}
              />
              {errors.fname && <small className="text-danger">Only letters allowed.</small>}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                className="form-control"
                {...register("lname", {
                  required: true,
                  pattern: /^[A-Za-z]+$/,
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                    return e;
                  },
                })}
              />
              {errors.lname && <small className="text-danger">Only letters allowed.</small>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="form-control"
              {...register("email", {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
              })}
            />
            {errors.email && <small className="text-danger">Use a valid Gmail address.</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="form-control"
                {...register("password", { required: true, minLength: 6 })}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🔓" : "🔒"}
              </button>
            </div>
            {errors.password && <small className="text-danger">Minimum 6 characters.</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              placeholder="Enter phone number(10 digits)"
              className="form-control"
              {...register("phoneNumber", {
                required: true,
                pattern: /^\d{10}$/,
              })}
            />
            {errors.phoneNumber && <small className="text-danger">Must be 10 digits.</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Age</label>
            <input
              type="number"
              placeholder="Enter your age"
              className="form-control"
              {...register("age", {
                required: true,
                min: 18,
                max: 99,
              })}
            />
            {errors.age && <small className="text-danger">Enter age between 18–99.</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Qualification</label>
            <input
              type="text"
              placeholder="Enter your qualification"
              className="form-control"
              {...register("qualification", { required: true })}
            />
            {errors.qualification && <small className="text-danger">Qualification required.</small>}
          </div>

          <div className="mb-3">
            <label className="form-label">Work Experience (years)</label>
            <input
              type="number"
              placeholder="Enter your work experience"
              className="form-control"
              {...register("workExperience", {
                required: true,
                min: 0,
              })}
            />
            {errors.workExperience && <small className="text-danger">Enter valid number.</small>}
          </div>

          <button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;