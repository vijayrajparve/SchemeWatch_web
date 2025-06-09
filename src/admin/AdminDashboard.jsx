import React, { useEffect, useState } from "react";
import { db, auth } from "../components/Firebase";
import {
  doc,
  getDoc,
  deleteDoc,
  onSnapshot,
  collection,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Card,
  Table,
  Form,
  Badge,
  Pagination,
  Accordion,
  Alert,
  Modal,
} from "react-bootstrap";
import MidDayMealLogo from "../images/Mid_day_logo.png";
import { InfoCircle } from "react-bootstrap-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

ChartJS.register(ArcElement, ChartTooltip, Legend);

function AdminDashboard() {
  const [userDetails, setUserDetails] = useState(null);
  const [activeFieldOfficers, setActiveFieldOfficers] = useState([]);
  const [inactiveFieldOfficers, setInactiveFieldOfficers] = useState([]);
  const [activeAssistantFOs, setActiveAssistantFOs] = useState([]);
  const [inactiveAssistantFOs, setInactiveAssistantFOs] = useState([]);
  const [activeResearchOfficers, setActiveResearchOfficers] = useState([]);
  const [inactiveResearchOfficers, setInactiveResearchOfficers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [searchFO, setSearchFO] = useState("");
  const [searchAFO, setSearchAFO] = useState("");
  const [searchRO, setSearchRO] = useState("");
  const [searchInactiveFO, setSearchInactiveFO] = useState("");
  const [searchInactiveAFO, setSearchInactiveAFO] = useState("");
  const [searchInactiveRO, setSearchInactiveRO] = useState("");
  const [searchAllUsers, setSearchAllUsers] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState({
    FO: 1,
    AFO: 1,
    RO: 1,
    InactiveFO: 1,
    InactiveAFO: 1,
    InactiveRO: 1,
    All: 1,
  });
  const usersPerPage = 10;
  const navigate = useNavigate();
  const [excelFile, setExcelFile] = useState(null);
  const [excelError, setExcelError] = useState("");
  const [excelSuccess, setExcelSuccess] = useState("");
  const [dataExists, setDataExists] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [inactiveUserList, setInactiveUserList] = useState([]);
  useEffect(() => {
    const checkDataExists = async () => {
      try {
        const docRef = doc(db, "districtTalukas", "singleDocument");
        const docSnap = await getDoc(docRef);
        setDataExists(docSnap.exists());
      } catch (error) {
        console.error("Error checking existing data:", error);
        toast.error("Error checking existing data: " + error.message);
      }
    };
    checkDataExists();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
          // **Update 1**: Removed lastActive update; keep user active on login
          try {
            await updateDoc(docRef, {
              status: "active", // Ensure user is marked active on login
            });
            await setDoc(
              doc(db, "activeUsers", user.uid),
              {
                ...docSnap.data(),
                status: "active",
              },
              { merge: true }
            );
            // Remove from inactiveUsers if present
            const inactiveDocRef = doc(db, "inactiveUsers", user.uid);
            const inactiveDocSnap = await getDoc(inactiveDocRef);
            if (inactiveDocSnap.exists()) {
              await deleteDoc(inactiveDocRef);
              console.log("User removed from inactiveUsers on login");
            }
          } catch (error) {
            console.error("Error updating user status on login:", error);
          }
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let dataLoading = true;

    // **Change**: Store active and inactive user IDs for status checking
    let activeUserIds = new Set();
    let inactiveUserIds = new Set();

    const unsubscribeActive = onSnapshot(
      collection(db, "activeUsers"),
      (snapshot) => {
        const activeUserList = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Active user data:", doc.id, data); // **Added**: Debug log
          return { id: doc.id, ...data };
        });
        activeUserIds = new Set(activeUserList.map((user) => user.id));
        setActiveFieldOfficers(
          activeUserList.filter((user) => user.role === "Field Officer")
        );
        setActiveAssistantFOs(
          activeUserList.filter((user) => user.role === "Assistant Field Officer")
        );
        setActiveResearchOfficers(
          activeUserList.filter((user) => user.role === "Research Officer")
        );
        dataLoading = false;
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching active users:", error);
        toast.error("Error fetching active users: " + error.message);
        dataLoading = false;
        setLoading(false);
      }
    );

    const unsubscribeInactive = onSnapshot(
      collection(db, "inactiveUsers"),
      (snapshot) => {
        const userList = snapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("Inactive user data:", doc.id, data);
          return { id: doc.id, ...data };
        });
        // **Changed**: Store inactiveUserList in state and update inactiveUserIds
        setInactiveUserList(userList);
        inactiveUserIds = new Set(userList.map((user) => user.id));
        setInactiveFieldOfficers(
          userList.filter((user) => user.role === "Field Officer")
        );
        setInactiveAssistantFOs(
          userList.filter((user) => user.role === "Assistant Field Officer")
        );
        setInactiveResearchOfficers(
          userList.filter((user) => user.role === "Research Officer")
        );
        dataLoading = false;
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching inactive users:", error);
        toast.error("Error fetching inactive users: " + error.message);
        dataLoading = false;
        setLoading(false);
      }
    );

    const unsubscribeUsers = onSnapshot(
      collection(db, "Users"),
      (snapshot) => {
        const allUsers = snapshot.docs.map((doc) => {
          const userData = doc.data();
          console.log("Fetched user:", doc.id, userData);

          // Fetch lastInactive from inactiveUsers if user is in inactiveUsers
          let lastInactive = userData.lastInactive || "Not Available";
          const isInactive = inactiveUserIds.has(doc.id);
          if (isInactive) {
            // **Changed**: Use state variable inactiveUserList
            const inactiveUser = inactiveUserList.find((u) => u.id === doc.id);
            if (inactiveUser && inactiveUser.lastInactive) {
              lastInactive = inactiveUser.lastInactive;
            }
          }

          if (!userData.firstName || !userData.lastName) {
            console.warn(`Missing name fields for user ${doc.id}:`, {
              firstName: userData.firstName,
              lastName: userData.lastName,
            });
          }

          return {
            id: doc.id,
            firstName: userData.firstName?.trim() || "N/A",
            lastName: userData.lastName?.trim() || "N/A",
            email: userData.email?.trim() || "N/A",
            role: userData.role?.trim() || "N/A",
            employeeId: userData.employeeId?.trim() || "Not Assigned",
            lastLogin: userData.lastLogin || "Registered",
            lastLogout: userData.lastLogout || "Never Logged Out",
            lastInactive: userData.lastInactive || "Never Inactive",
            status: userData.status || "active",
            isActive: activeUserIds.has(doc.id),
            ...userData,
          };
        });
        setRegisteredUsers(allUsers);
        dataLoading = false;
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users: " + error.message);
        dataLoading = false;
        setLoading(false);
      }
    );

    return () => {
      unsubscribeActive();
      unsubscribeInactive();
      unsubscribeUsers();
    };
  }, []);

  // Updated handleLogout function to match Dashboard component
  async function handleLogout() {
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

      // **Update 3**: Simplified inactiveUsers update, removed lastActive reference
      if (!inactiveDocSnap.exists()) {
        await setDoc(inactiveDocRef, {
          ...userData,
          lastInactive: serverTimestamp(),
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

  async function handleDeleteUser(userId) {
    try {
      await Promise.all([
        deleteDoc(doc(db, "Users", userId)),
        deleteDoc(doc(db, "activeUsers", userId)),
        deleteDoc(doc(db, "inactiveUsers", userId)),
      ]);
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Error deleting user: " + error.message);
    }
  }

  async function handleDeleteData() {
    try {
      const docRef = doc(db, "districtTalukas", "singleDocument");
      await deleteDoc(docRef);
      setDataExists(false);
      setExcelSuccess("Existing data deleted successfully!");
      setExcelError("");
      toast.success("Existing data deleted successfully!");
    } catch (error) {
      console.error("Error deleting data:", error);
      setExcelError("Error deleting data: " + error.message);
      toast.error("Error deleting data: " + error.message);
    }
  }

  const handleDownloadTemplate = () => {
    try {
      const wsData = [
        ["Code", "Districts", "Taluka", "Code"],
        ["D001", "District Name", "Taluka Name", "T001"],
      ];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Excel_Format_Template.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating Excel template:", error);
      toast.error("Failed to download template: " + error.message);
    }
  };

  const chartData = {
    labels: [
      "Active FOs",
      "Active AFOs",
      "Active ROs",
      "Inactive FOs",
      "Inactive AFOs",
      "Inactive ROs",
      "Registered Users",
    ],
    datasets: [
      {
        data: [
          activeFieldOfficers.length,
          activeAssistantFOs.length,
          activeResearchOfficers.length,
          inactiveFieldOfficers.length,
          inactiveAssistantFOs.length,
          inactiveResearchOfficers.length,
          registeredUsers.length,
        ],
        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#9C27B0",
          "#FF5722",
          "#FFC107",
          "#607D8B",
          "#E91E63",
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { font: { size: 14, family: "Arial" }, padding: 20 },
      },
      title: {
        display: true,
        text: "User Activity Overview",
        font: { size: 20, weight: "bold" },
        padding: 20,
      },
      tooltip: {
        backgroundColor: "#333",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
    animation: { animateScale: true, animateRotate: true },
  };

  const paginateData = (data, page, search = "") => {
    const filtered = data.filter((user) =>
      `${user.firstName || ""} ${user.lastName || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    const startIndex = (page - 1) * usersPerPage;
    return {
      paginated: filtered.slice(startIndex, startIndex + usersPerPage),
      totalPages: Math.ceil(filtered.length / usersPerPage),
    };
  };

  const filteredActiveFOs = paginateData(activeFieldOfficers, currentPage.FO, searchFO);
  const filteredActiveAFOs = paginateData(activeAssistantFOs, currentPage.AFO, searchAFO);
  const filteredActiveROs = paginateData(activeResearchOfficers, currentPage.RO, searchRO);
  const filteredInactiveFOs = paginateData(inactiveFieldOfficers, currentPage.InactiveFO, searchInactiveFO);
  const filteredInactiveAFOs = paginateData(inactiveAssistantFOs, currentPage.InactiveAFO, searchInactiveAFO);
  const filteredInactiveROs = paginateData(inactiveResearchOfficers, currentPage.InactiveRO, searchInactiveRO);
  const filteredAllUsers = registeredUsers
    .filter((user) =>
      `${user.firstName || ""} ${user.lastName || ""}`
        .toLowerCase()
        .includes(searchAllUsers.toLowerCase())
    )
    .sort((a, b) => {
      const idA = a.employeeId?.trim() || "Not Assigned";
      const idB = b.employeeId?.trim() || "Not Assigned";
      if (idA === "Not Assigned" && idB === "Not Assigned") return 0;
      if (idA === "Not Assigned") return 1;
      if (idB === "Not Assigned") return -1;
      const numA = idA.match(/\d+$/)?.[0] || null;
      const numB = idB.match(/\d+$/)?.[0] || null;
      if (!numA || !numB) {
        return idA.localeCompare(idB, undefined, { sensitivity: "base" });
      }
      return parseInt(numA, 10) - parseInt(numB, 10);
    });

  const renderPagination = (totalPages, current, section) => (
    <Pagination className="justify-content-center mt-3">
      <Pagination.Prev
        onClick={() =>
          setCurrentPage((prev) => ({
            ...prev,
            [section]: Math.max(1, current - 1),
          }))
        }
        disabled={current === 1}
      />
      {[...Array(totalPages)].map((_, idx) => (
        <Pagination.Item
          key={idx}
          active={idx + 1 === current}
          onClick={() =>
            setCurrentPage((prev) => ({ ...prev, [section]: idx + 1 }))
          }
        >
          {idx + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() =>
          setCurrentPage((prev) => ({
            ...prev,
            [section]: Math.min(totalPages, current + 1),
          }))
        }
        disabled={current === totalPages}
      />
    </Pagination>
  );

  const handleExcelFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setExcelFile(selectedFile);
      setExcelError("");
    } else {
      setExcelError("Please upload a valid Excel (.xlsx) file.");
      setExcelFile(null);
    }
  };

  const handleExcelUpload = async () => {
    if (!excelFile) {
      setExcelError("No file selected.");
      return;
    }

    try {
      console.log("Starting Excel file processing...");
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          console.log("Excel headers:", jsonData[0]);
          const headers = jsonData[0].map((header) => header.toLowerCase());
          const districtCodeIndex = headers.indexOf("code");
          const districtNameIndex = headers.indexOf("districts");
          const talukaNameIndex = headers.indexOf("taluka");
          const talukaCodeIndex = headers.lastIndexOf("code");

          if (
            districtCodeIndex === -1 ||
            districtNameIndex === -1 ||
            talukaCodeIndex === -1 ||
            talukaNameIndex === -1
          ) {
            setExcelError(
              'Excel file must contain "Code", "Districts", "Taluka", and "Code" (for taluka) columns.'
            );
            return;
          }

          const districts = {};
          let lastDistrictCode = null;
          let lastDistrictName = null;

          jsonData.slice(1).forEach((row, index) => {
            const districtCode = row[districtCodeIndex]?.toString().trim();
            const districtName = row[districtNameIndex]?.toString().trim();
            const talukaCode = row[talukaCodeIndex]?.toString().trim();
            const talukaName = row[talukaNameIndex]?.toString().trim();

            if (districtCode && districtName) {
              lastDistrictCode = districtCode;
              lastDistrictName = districtName;
            }

            if (
              lastDistrictCode &&
              lastDistrictName &&
              talukaCode &&
              talukaName
            ) {
              if (!districts[lastDistrictCode]) {
                districts[lastDistrictCode] = {
                  name: lastDistrictName,
                  talukas: {},
                };
              }
              districts[lastDistrictCode].talukas[talukaCode] = talukaName;
            } else {
              console.warn(`Skipping invalid row ${index + 2}:`, row);
            }
          });

          if (Object.keys(districts).length === 0) {
            setExcelError(
              "Excel file must contain valid data in all required columns."
            );
            return;
          }

          console.log("Prepared districts:", districts);
          console.log("Uploading to Firestore...");
          await setDoc(
            doc(db, "districtTalukas", "singleDocument"),
            {
              districts,
              createdAt: new Date(),
            },
            { merge: true }
          );
          console.log("Successfully uploaded single document");

          setDataExists(true);
          setExcelSuccess("Data uploaded successfully!");
          setExcelError("");
          setExcelFile(null);
        } catch (innerErr) {
          console.error("Error processing Excel file:", innerErr);
          setExcelError(`Failed to process Excel file: ${innerErr.message}`);
        }
      };
      reader.readAsArrayBuffer(excelFile);
    } catch (err) {
      console.error("Error uploading Excel data:", err);
      setExcelError(`Failed to upload data: ${err.message}`);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      console.log("Timestamp is missing or null"); // **Added**: Debug log
      return "Not Available";
    }
    if (timestamp.toDate) {
      const date = timestamp.toDate();
      console.log("Formatted timestamp:", date.toLocaleString()); // **Added**: Debug log
      return date.toLocaleString();
    }
    if (typeof timestamp === "string") {
      const date = new Date(timestamp);
      const result = isNaN(date.getTime()) ? "Not Available" : date.toLocaleString();
      console.log("Formatted string timestamp:", result); // **Added**: Debug log
      return result;
    }
    console.log("Timestamp format unrecognized:", timestamp); // **Added**: Debug log
    return "Not Available";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <Navbar bg="primary" variant="dark" expand="lg" sticky="top" className="shadow-sm">
        <Container fluid>
          <Navbar.Brand href="/admin_dashboard" className="d-flex align-items-center">
            <img
              src={MidDayMealLogo}
              alt="Mid Day Meal Logo"
              style={{ height: "40px", marginRight: "10px" }}
            />
            <span className="fs-4 fw-bold">Admin Dashboard</span>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard" className="text-white">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/profile" className="text-white">
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/about_us" className="text-white">
              About Us
            </Nav.Link>
          </Nav>
          <Button
            variant="outline-light"
            onClick={handleLogout}
            className="fw-bold"
          >
            Logout
          </Button>
        </Container>
      </Navbar>

      <Container className="mt-4 mb-1 w-100">
        <div className="mb-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn btn-outline-secondary btn-sm"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
            Back
          </button>
        </div>
        
        <Card className="shadow-lg mb-4 border-0" style={{ borderRadius: "15px", background: "white" }}>
          <Card.Body className="p-4">
            <div className="d-flex align-items-center justify-content-center mb-4">
              <h3 className="fw-bold m-0" style={{ color: "#333" }}>
                Upload District & Taluka Data
              </h3>
              <InfoCircle
                size={24}
                className="ms-2 text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => setShowExcelModal(true)}
                title="View Excel Format"
              />
            </div>
            <Form.Group className="mb-3">
              <Form.Control
                type="file"
                accept=".xlsx"
                onChange={handleExcelFileChange}
                className="mb-3"
                disabled={dataExists}
              />
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  onClick={handleExcelUpload}
                  disabled={!excelFile || dataExists}
                  className="fw-bold"
                  style={{ borderRadius: "8px" }}
                >
                  Upload Excel
                </Button>
                {dataExists && (
                  <Button
                    variant="danger"
                    onClick={handleDeleteData}
                    className="fw-bold"
                    style={{ borderRadius: "8px" }}
                  >
                    Delete Existing Data
                  </Button>
                )}
              </div>
            </Form.Group>
            {excelError && <Alert variant="danger">{excelError}</Alert>}
            {excelSuccess && <Alert variant="success">{excelSuccess}</Alert>}
          </Card.Body>
        </Card>

        <Modal show={showExcelModal} onHide={() => setShowExcelModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Excel File Format</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>The Excel file must contain the following columns in this order:</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Code (District)</th>
                  <th>Districts</th>
                  <th>Taluka</th>
                  <th>Code (Taluka)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>D001</td>
                  <td>District Name</td>
                  <td>Taluka Name</td>
                  <td>T001</td>
                </tr>
              </tbody>
            </Table>
            <p>
              <strong>Instructions:</strong>
              <ul>
                <li>First column: Unique district code (e.g., D001).</li>
                <li>Second column: District name.</li>
                <li>Third column: Taluka name.</li>
                <li>Fourth column: Unique taluka code (e.g., T001).</li>
                <li>Ensure no empty rows or missing values in required columns.</li>
              </ul>
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowExcelModal(false)}
              style={{ borderRadius: "8px" }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={handleDownloadTemplate}
              style={{ borderRadius: "8px" }}
            >
              Download Template
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      <Container className="py-4">
        <Card className="shadow-lg mb-4 border-0" style={{ borderRadius: "15px", background: "white" }}>
          <Card.Body className="p-4">
            <h3 className="text-center mb-4 fw-bold" style={{ color: "#333" }}>
              Quick Navigation
            </h3>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {[
                { to: "/parent-feedback", text: "Parent Feedback", color: "info" },
                { to: "/school-feedback", text: "School Feedback", color: "warning" },
                { to: "/observation-feedback", text: "Observation Feedback", color: "success" },
                { to: "/find-school", text: "Find School", color: "primary" },
              ].map((nav, idx) => (
                <Button
                  key={idx}
                  variant={nav.color}
                  size="lg"
                  onClick={() => navigate(nav.to)}
                  className="w-25 fw-bold text-white"
                  style={{ borderRadius: "10px", padding: "12px" }}
                >
                  {nav.text}
                </Button>
              ))}
            </div>
          </Card.Body>
        </Card>

        <Card className="shadow-lg mb-4 border-0" style={{ borderRadius: "15px", background: "white" }}>
          <Card.Body className="p-4 d-flex justify-content-around text-center flex-wrap">
            {[
              { label: "Active FOs", count: activeFieldOfficers.length, color: "success" },
              { label: "Active AFOs", count: activeAssistantFOs.length, color: "info" },
              { label: "Active ROs", count: activeResearchOfficers.length, color: "primary" },
              { label: "Inactive FOs", count: inactiveFieldOfficers.length, color: "danger" },
              { label: "Inactive AFOs", count: inactiveAssistantFOs.length, color: "warning" },
              { label: "Inactive ROs", count: inactiveResearchOfficers.length, color: "secondary" },
              { label: "Registered Users", count: registeredUsers.length, color: "dark" },
            ].map((stat, idx) => (
              <div key={idx} className="p-2">
                <Badge bg={stat.color} className="p-2 fs-6">
                  {stat.label}: <strong>{stat.count}</strong>
                </Badge>
              </div>
            ))}
          </Card.Body>
        </Card>

        <Card className="shadow-lg mb-4 border-0" style={{ borderRadius: "15px", background: "white" }}>
          <Card.Body style={{ height: "400px" }}>
            {loading ? (
              <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <Doughnut data={chartData} options={chartOptions} />
            )}
          </Card.Body>
        </Card>

        {[
          {
            title: "Active Field Officers",
            data: filteredActiveFOs.paginated,
            search: searchFO,
            setSearch: setSearchFO,
            color: "success",
            page: "FO",
            totalPages: filteredActiveFOs.totalPages,
            isActive: true,
          },
          {
            title: "Active Assistant FOs",
            data: filteredActiveAFOs.paginated,
            search: searchAFO,
            setSearch: setSearchAFO,
            color: "info",
            page: "AFO",
            totalPages: filteredActiveAFOs.totalPages,
            isActive: true,
          },
          {
            title: "Active Research Officers",
            data: filteredActiveROs.paginated,
            search: searchRO,
            setSearch: setSearchRO,
            color: "primary",
            page: "RO",
            totalPages: filteredActiveROs.totalPages,
            isActive: true,
          },
          {
            title: "Inactive Field Officers",
            data: filteredInactiveFOs.paginated,
            search: searchInactiveFO,
            setSearch: setSearchInactiveFO,
            color: "danger",
            page: "InactiveFO",
            totalPages: filteredInactiveFOs.totalPages,
            isActive: false,
          },
          {
            title: "Inactive Assistant FOs",
            data: filteredInactiveAFOs.paginated,
            search: searchInactiveAFO,
            setSearch: setSearchInactiveAFO,
            color: "warning",
            page: "InactiveAFO",
            totalPages: filteredInactiveAFOs.totalPages,
            isActive: false,
          },
          {
            title: "Inactive Research Officers",
            data: filteredInactiveROs.paginated,
            search: searchInactiveRO,
            setSearch: setSearchInactiveRO,
            color: "secondary",
            page: "InactiveRO",
            totalPages: filteredInactiveROs.totalPages,
            isActive: false,
          },
        ].map((section, idx) => (
          <Card
            key={idx}
            className="shadow-lg mb-4 border-0"
            style={{ borderRadius: "15px", background: "white" }}
          >
            <Card.Body className="p-4">
              <Accordion defaultActiveKey={null}>
                <Accordion.Item eventKey={idx.toString()}>
                  <Accordion.Header>
                    <h4 className={`fw-bold mb-0 text-${section.color}`}>
                      {section.title}
                    </h4>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Form.Control
                      type="text"
                      placeholder="Search by name..."
                      value={section.search}
                      onChange={(e) => section.setSearch(e.target.value)}
                      className="mb-3 w-50"
                      style={{ borderRadius: "8px" }}
                    />
                    <Table striped hover responsive className="rounded">
                      <thead style={{ background: "#f8f9fa" }}>
                        <tr>
                          <th>Status</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>{section.isActive ? "Last Active" : "Last Inactive"}</th>
                          {!section.isActive && <th>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {section.data.length > 0 ? (
                          section.data.map((user) => (
                            <tr key={user.id}>
                              <td>
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: section.isActive ? "#4CAF50" : "#FF5722",
                                    marginRight: "10px",
                                  }}
                                />
                              </td>
                              <td>{`${user.firstName || "N/A"} ${user.lastName || "N/A"}`}</td>
                              <td>{user.email || "N/A"}</td>
                              <td>
                                {section.isActive
                                  ? formatTimestamp(user.lastActive)
                                  : formatTimestamp(user.lastInactive)}
                              </td>
                              {!section.isActive && (
                                <td>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => {
                                      if (window.confirm("Are you sure you want to delete this user?")) {
                                        handleDeleteUser(user.id);
                                      }
                                    }}
                                    style={{ borderRadius: "8px" }}
                                  >
                                    Delete
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={section.isActive ? 4 : 5} className="text-center">
                              No {section.title.toLowerCase()} found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    {section.data.length > 0 &&
                      renderPagination(section.totalPages, currentPage[section.page], section.page)}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        ))}

        <Card className="shadow-lg mb-4 border-0" style={{ borderRadius: "15px", background: "white" }}>
          <Card.Body className="p-4">
            <h4 className="fw-bold mb-3 text-dark">All Registered Users</h4>
            <Form.Control
              type="text"
              placeholder="Search by name..."
              value={searchAllUsers}
              onChange={(e) => setSearchAllUsers(e.target.value)}
              className="mb-3 w-50"
              style={{ borderRadius: "8px" }}
            />
            <Table striped hover responsive className="rounded">
              <thead style={{ background: "#f8f9fa" }}>
                <tr>
                  <th>Status</th>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Inactive</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllUsers.length > 0 ? (
                  filteredAllUsers.map((user) => {
                    console.log("Rendering user:", user);
                    
                    return (
                      <tr key={user.id}>
                        <td>
                          <span
                            style={{
                              display: "inline-block",
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              backgroundColor: user.isActive ? "#4CAF50" : "#FF5722",
                              marginRight: "10px",
                            }}
                          />
                        </td>
                        <td>{user.employeeId}</td>
                        <td>{(`${user.firstName} ${user.lastName}`.trim() || "N/A").toUpperCase()}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                        {user.isActive ? "N/A" : formatTimestamp(user.lastInactive)}
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => navigate(`/update-register/${user.id}`)}
                            style={{ borderRadius: "8px", marginRight: "5px" }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this user?")) {
                                handleDeleteUser(user.id);
                              }
                            }}
                            style={{ borderRadius: "8px" }}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No registered users found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default AdminDashboard;