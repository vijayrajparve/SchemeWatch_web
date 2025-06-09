import { useState, useEffect, createContext, useContext } from "react";
import { auth, db } from "../components/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("auth: [1] Setting up onAuthStateChanged listener");

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("auth: [2] onAuthStateChanged triggered:", { currentUser });

      try {
        setError(null);
        setLoading(true);

        if (currentUser) {
          console.log("auth: [3] User is signed in with UID:", currentUser.uid);

          const userDocRef = doc(db, "Users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef).catch((error) => {
            console.error("auth: [4] Error fetching user document:", error);
            throw new Error("Failed to fetch user document");
          });

          const currentTime = new Date().toISOString();

          // Default user data
          let fetchedUserData = {
            email: currentUser.email || null,
            firstName: null,
            lastName: null,
            role: "Research Officer",
            phoneNumber: null,
            age: null,
            qualification: null,
            workExperience: null,
            createdAt: currentTime,
            employeeId: null,
            status: "active",
          };

          if (userDocSnap?.exists()) {
            console.log("auth: [5] Existing user document found, merging data");
            const docData = userDocSnap.data();
            console.log("auth: [5.1] Firestore user document data:", docData);
          
            for (const key in fetchedUserData) {
              if (docData[key] !== undefined && docData[key] !== null && docData[key] !== "N/A") {
                fetchedUserData[key] = docData[key];
              }
            }
          
            if (fetchedUserData.status === "inactive") {
              console.log("auth: [5.2] User is inactive, signing out");
              // **Change**: Set lastInactive timestamp before signing out
              await setDoc(
                userDocRef,
                {
                  lastInactive: serverTimestamp(),
                },
                { merge: true }
              );
              await auth.signOut();
              setUser(null);
              setRole(null);
              setUserData(null);
              toast.error("Your account is disabled. Please contact the admin.", {
                position: "bottom-center",
              });
              setLoading(false);
              return;
            }
            console.log("auth: [5.3] Setting role from Firestore:", fetchedUserData.role);
          }
          
          setUser(currentUser);
          setRole(fetchedUserData.role);
          setUserData(fetchedUserData);
          console.log("auth: [6.1] State updated:", {
            user: currentUser,
            role: fetchedUserData.role,
            userData: fetchedUserData,
          });

          const batch = writeBatch(db);

          // Only write non-null fields
          const dataToWrite = {};
          Object.keys(fetchedUserData).forEach((key) => {
            if (fetchedUserData[key] !== null && fetchedUserData[key] !== undefined) {
              dataToWrite[key] = fetchedUserData[key];
            }
          });

          // **Modified**: Update status and lastActive
          dataToWrite.status = "active";
          dataToWrite.lastActive = serverTimestamp();

          // Skip write if no changes
          if (userDocSnap?.exists()) {
            const docData = userDocSnap.data();
            const hasChanges = Object.keys(dataToWrite).some(
              (key) => dataToWrite[key] !== docData[key]
            );
            if (!hasChanges) {
              console.log("auth: [7.1] No changes to user data, skipping write");
            } else {
              console.log("auth: [7] Writing user data to Firestore:", dataToWrite);
              batch.set(userDocRef, dataToWrite, { merge: true });
            }
          } else {
            console.log("auth: [7] Writing user data to Firestore:", dataToWrite);
            batch.set(userDocRef, dataToWrite, { merge: true });
          }

          // **Modified**: Manage active/inactive user collections
          console.log("auth: [8] Handling active/inactive user collections");
          const activeDocRef = doc(db, "activeUsers", currentUser.uid);
          const activeData = {
            email: fetchedUserData.email,
            firstName: fetchedUserData.firstName,
            lastName: fetchedUserData.lastName,
            role: fetchedUserData.role,
            employeeId: fetchedUserData.employeeId,
            status: "active",
            lastActive: serverTimestamp(),
          };

          const activeDataToWrite = {};
          Object.keys(activeData).forEach((key) => {
            if (activeData[key] !== null && activeData[key] !== undefined) {
              activeDataToWrite[key] = activeData[key];
            }
          });

          console.log("auth: [9] Adding user to activeUsers:", activeDataToWrite);
          batch.set(activeDocRef, activeDataToWrite, { merge: true });

          const inactiveUserDocRef = doc(db, "inactiveUsers", currentUser.uid);
          const inactiveUserSnap = await getDoc(inactiveUserDocRef).catch(() => null);

          if (inactiveUserSnap?.exists()) {
            console.log("auth: [10] Removing user from inactiveUsers");
            batch.delete(inactiveUserDocRef);
          }

          if (fetchedUserData.firstName && fetchedUserData.lastName && fetchedUserData.employeeId) {
            await batch.commit();
            console.log("auth: [11] Firestore batch commit successful");
          } else {
            console.warn("auth: [11] Skipping batch commit — incomplete user data");
          }
        } else {
          console.log("auth: [12] No user is signed in, clearing context state");
          setUser(null);
          setRole(null);
          setUserData(null);
        }
      } catch (error) {
        console.error("auth: [13] Error during onAuthStateChanged:", error.code, error.message);

        if (error.code === "permission-denied") {
          console.warn("auth: [14] Firestore permission denied - check rules");
        }

        setError(error.message);
        toast.error(`Failed to load user data: ${error.message}`, {
          position: "bottom-center",
        });

        setUser(null);
        setRole(null);
        setUserData(null);
      } finally {
        setLoading(false);
        console.log("auth: [15] Auth state loading completed");
      }
    });

    return () => {
      console.log("auth: [16] Cleaning up onAuthStateChanged listener");
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, userData, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};