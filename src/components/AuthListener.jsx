import React, { useEffect } from "react";
import { auth, db } from "./Firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function AuthListener({ children }) {
  useEffect(() => {
    console.log("AuthListener useEffect triggered");
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log(`User logged in: ${user.uid}, Email: ${user.email}`);
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          const currentTime = new Date().toISOString();

          let userData;
          if (docSnap.exists()) {
            userData = docSnap.data();
            console.log(`Fetched user data: ${JSON.stringify(userData)}`);
          } else {
            userData = {
              email: user.email,
              firstName: "N/A",
              lastName: "N/A",
              role: "N/A",
              createdAt: currentTime,
            };
            await setDoc(docRef, userData);
            console.log(`Created new user: ${JSON.stringify(userData)}`);
          }

          console.log(`Updating activeUsers for ${user.uid} with role: ${userData.role}`);
          await setDoc(doc(db, "activeUsers", user.uid), {
            email: user.email,
            firstName: userData.firstName || "N/A",
            lastName: userData.lastName || "N/A",
            role: userData.role || "N/A",
            lastActive: currentTime,
          }, { merge: true });
          console.log(`Successfully updated activeUsers for ${user.uid}`);
        } catch (error) {
          console.error(`Error updating activeUsers for ${user.uid}: ${error.message}`);
        }
      } else {
        console.log("No user logged in");
      }
    });
    return () => {
      console.log("Unsubscribing AuthListener");
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

export default AuthListener;