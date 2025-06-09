import React, { useEffect, useState } from "react";
import { auth, db } from "../components/Firebase";
import { doc, getDoc, getDocs, collection, updateDoc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore"; // Added updateDoc, deleteDoc, setDoc
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router-dom";
import MidDayMealLogo from "../images/Mid_day_logo.png";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { ToastContainer, toast } from "react-toastify"; // Added ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Added toastify CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function OfficerDash() {
  const [userDetails, setUserDetails] = useState(null);
  const [parentData, setParentData] = useState([]);
  const [observeData, setObserveData] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parentSearch, setParentSearch] = useState(""); // Search state for Parent Form
  const [observeSearch, setObserveSearch] = useState(""); // Search state for Observation Form
  const [schoolSearch, setSchoolSearch] = useState(""); // Search state for School Form
  const navigate = useNavigate();

 //Graph data states (unchanged)
  const [dailyParentData, setDailyParentData] = useState({});
  const [weeklyParentData, setWeeklyParentData] = useState({});
  const [monthlyParentData, setMonthlyParentData] = useState({});
  const [dailyObserveData, setDailyObserveData] = useState({});
  const [weeklyObserveData, setWeeklyObserveData] = useState({});
  const [monthlyObserveData, setMonthlyObserveData] = useState({});
  const [dailySchoolData, setDailySchoolData] = useState({});
  const [weeklySchoolData, setWeeklySchoolData] = useState({});
  const [monthlySchoolData, setMonthlySchoolData] = useState({});

  const displayValue = (value) => (value !== undefined && value !== null ? value : "N/A");

  const processFormData = (data, type) => {
    const daily = {};
    const weekly = {};
    const monthly = {};

    data.forEach((item) => {
      const date = new Date(item.submissionDate || Date.now());
      const dayKey = date.toISOString().split("T")[0];
      const weekKey = `${date.getFullYear()}-W${Math.ceil((date.getDate() + (date.getDay() === 0 ? 6 : date.getDay() - 1)) / 7)}`;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      daily[dayKey] = (daily[dayKey] || 0) + 1;
      weekly[weekKey] = (weekly[weekKey] || 0) + 1;
      monthly[monthKey] = (monthly[monthKey] || 0) + 1;
    });

    if (type === "parent") {
      setDailyParentData(daily);
      setWeeklyParentData(weekly);
      setMonthlyParentData(monthly);
    } else if (type === "observe") {
      setDailyObserveData(daily);
      setWeeklyObserveData(weekly);
      setMonthlyObserveData(monthly);
    } else if (type === "school") {
      setDailySchoolData(daily);
      setWeeklySchoolData(weekly);
      setMonthlySchoolData(monthly);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "Users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.log("User document not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setLoading(false);
      } else {
        console.log("User not logged in");
        navigate("/login");
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Updated handleLogout function to match Dashboard component
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
}

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collections = [
          { name: "Parent_Form", setter: setParentData, type: "parent" },
          { name: "Observation_Form", setter: setObserveData, type: "observe" },
          { name: "School_Form", setter: setSchoolData, type: "school" },
        ];

        await Promise.all(
          collections.map(async ({ name, setter, type }) => {
            const querySnapshot = await getDocs(collection(db, name));
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setter(data);
            processFormData(data, type);
            console.log(`${type} data:`, data);
            console.log(data);
          })
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateParentForm = (id) => navigate(`/research_update_parent_form/${id}`);
  const updateObservationForm = (id) => navigate(`/research_update_observation_form/${id}`);
  const updateSchoolForm = (id) => navigate(`/research_update_school_form/${id}`);

  const addParentEntry = () => navigate("/research_parent_form");
  const addObservationEntry = () => navigate("/research_observation_form");
  const addSchoolEntry = () => navigate("/research_school_form");

  const downloadParentExcel = () => {
    if (parentData.length === 0) {
      alert("No data available to download!");
      return;
    }
    const fieldMappings = [
      { label: "A", key: "district" },
      { label: "B", key: "taluka" },
      { label: "C", key: "udiseNumber" },
      { label: "D", key: "sendChildDaily" },
      { label: "E1", key: "weightGain" },
      { label: "E2", key: "sickFrequency" },
      { label: "E3", key: "studyProgress" },
      { label: "E4", key: "nutrition" },
      { label: "E5", key: "attendance" },
      { label: "E6", key: "impactOfNutritionScheme" },
      { label: "E7", key: "effectOnAfternoonAttendance" },
      { label: "E8", key: "effectOfNutritionDietPlan" },
    ];

    // Create header row
    const headers = fieldMappings.map((field) => field.label);

    // Create data rows
    const excelData = [
      headers, // Header row
      ...parentData.map((record) =>
        fieldMappings.map((field) => displayValue(record[field.key]))
      ),
    ];

    const ws = XLSX.utils.aoa_to_sheet(excelData);

    // Set column widths and center alignment
    ws["!cols"] = fieldMappings.map(() => ({ wch: 20 }));
    ws["!rows"] = excelData.map(() => ({ hpx: 25 }));

    // Apply center alignment to all cells
    for (let cell in ws) {
      if (cell[0] === "!") continue; // Skip special properties
      ws[cell].s = {
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parent Data");
    XLSX.writeFile(wb, "parent_data.xlsx");
  };

  const downloadObservationExcel = () => {
    if (observeData.length === 0) {
      alert("No data available to download!");
      return;
    }
    const fieldMappings = [
      { label: "A", key: "district" },
      { label: "B", key: "taluka" },
      { label: "C", key: "udiseNumber" },
      { label: "D", key: "remarks" },
    ];

    // Create header row
  const headers = fieldMappings.map((field) => field.label);

  // Create data rows
  const excelData = [
    headers, // Header row
    ...observeData.map((record) =>
      fieldMappings.map((field) => displayValue(record[field.key]))
    ),
  ];

  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Set column widths and center alignment
  ws["!cols"] = fieldMappings.map(() => ({ wch: 20 }));
  ws["!rows"] = excelData.map(() => ({ hpx: 25 }));

  // Apply center alignment to all cells
  for (let cell in ws) {
    if (cell[0] === "!") continue; // Skip special properties
    ws[cell].s = {
      alignment: { horizontal: "center", vertical: "center" },
    };
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Observation Data");
  XLSX.writeFile(wb, "observation_data.xlsx");
};

  const downloadSchoolExcel = () => {
    if (schoolData.length === 0) {
      alert("No data available to download!");
      return;
    }
    const fieldMappings = [
      { label: "A", key: "district" },
      { label: "B", key: "taluka" },
      { label: "C", key: "udiseNumber" },
      { label: "D-1", key: "teacherMale" },
      { label: "D-2", key: "teacherFemale" },
      { label: "D-3", key: "totalTeachers" },
      { label: "E-1", key: "totalBoys" },
      { label: "E-2", key: "totalGirls" },
      { label: "E-3", key: "totalStudents" },
      { label: "F-1", key: "gradeStudents.grade1to4.female" },
      { label: "F-2", key: "gradeStudents.grade1to4.male" },
      { label: "F-3", key: "gradeStudents.grade1to4.total" },
      { label: "G-1", key: "gradeStudents.grade5to7.female" },
      { label: "G-2", key: "gradeStudents.grade5to7.male" },
      { label: "G-3", key: "gradeStudents.grade5to7.total" },
      { label: "H-1", key: "gradeStudents.grade8to10.female" },
      { label: "H-2", key: "gradeStudents.grade8to10.male" },
      { label: "H-3", key: "gradeStudents.grade8to10.total" },
      { label: "SP-1", key: "hasMiddayMealBoard" },
      { label: "SP-2", key: "hasMiddayMealMenu" },
      { label: "SP-3", key: "hasManagementBoard" },
      { label: "SP-4", key: "hasPrincipalContact" },
      { label: "SP-5", key: "hasOfficerContact" },
      { label: "SP-6", key: "hasComplaintBox" },
      { label: "SP-7", key: "hasEmergencyNumber" },
      { label: "SP-8", key: "hasKitchenShed" },
      { label: "SP-9", key: "hasFirstAidBox" },
      { label: "SP-10", key: "hasWaterSource" },
      { label: "SP-10.1", key: "waterSourceType" },
      { label: "SP-10.2", key: "hasRegularWaterSupply" },
      { label: "SP-11", key: "hasFireExtinguisher" },
      { label: "SP-11.1", key: "hasFireExtinguisherCheck" },
      { label: "SP-11.2", key: "hasFireExtinguisherRefill" },
      { label: "SP-12", key: "hasKitchenGarden" },
      { label: "SP-12.1", key: "usesGardenProduce" },
      { label: "SP-13", key: "innovativeInitiatives" },
      { label: "ND-1", key: "hasDietCommittee" },
      { label: "ND-1.1", key: "hasCommitteeBoard" },
      { label: "ND-2", key: "cookingAgency" },
      { label: "ND-3", key: "hasAgreementCopy" },
      { label: "ND-4", key: "hasCookTraining" },
      { label: "ND-5", key: "cookHelperCount" },
      { label: "ND-6", key: "isCookedAtSchool" },
      { label: "ND-6.1", key: "fuelType" },
      { label: "ND-7", key: "hasWeighingScale" },
      { label: "ND-7.1", key: "hasRiceWeighed" },
      { label: "ND-8", key: "hasStorageUnits" },
      { label: "ND-9", key: "hasPlates" },
      { label: "ND-10", key: "teacherPresentDuringDistribution" },
      { label: "ND-11", key: "mdmPortalUpdated" },
      { label: "ND-12", key: "supplementaryDiet" },
      { label: "ND-13", key: "sampleStored" },
      { label: "ND-14", key: "cleaningDone" },
      { label: "ND-15", key: "thirdPartySupport" },
      { label: "ND-16", key: "basicFacilitiesAvailable" },
      { label: "ND-17", key: "diningArrangement" },
      { label: "ND-18", key: "followsGovtRecipe" },
      { label: "ND-19", key: "eggsBananasRegular" },
      { label: "ND-20", key: "usesSproutedGrains" },
      { label: "ND-21", key: "labTestMonthly" },
      { label: "ND-22", key: "tasteTestBeforeDistribution" },
      { label: "ND-23", key: "smcParentVisits" },
      { label: "ND-24", key: "hasTasteRegister" },
      { label: "ND-24.1", key: "dailyTasteEntries" },
      { label: "ND-25", key: "stockMatchesRegister" },
      { label: "ND-26", key: "recipesDisplayed" },
      { label: "ND-27", key: "monitoringCommitteeMeetings" },
      { label: "ND-27.1", key: "meetingCount2024_25" },
      { label: "ND-28", key: "emptySacksReturned" },
      { label: "ND-28.1", key: "sackTransferRecorded" },
      { label: "ND-28.2", key: "sackTransferCount" },
      { label: "ND-29", key: "snehTithiProgram" },
      { label: "ND-30", key: "fieldOfficerVisits" },
      { label: "HC-1", key: "healthCheckupDone" },
      { label: "HC-1.1", key: "healthCheckupStudentCount" },
      { label: "HC-2", key: "bmiRecorded" },
      { label: "HC-3", key: "weightHeightMeasured" },
      { label: "HC-4", key: "cookHealthCheck" },
      { label: "HC-5", key: "hasSmcResolution" },
      { label: "HC-6", key: "hasHealthCertificate" },
      { label: "SB-1", key: "beneficiaries.2022-23.boys" },
      { label: "SB-1.1", key: "beneficiaries.2022-23.girls" },
      { label: "SB-1.3", key: "beneficiaries.2022-23.total" },
      { label: "SB-2", key: "beneficiaries.2023-24.boys" },
      { label: "SB-2.1", key: "beneficiaries.2023-24.girls" },
      { label: "SB-2.2", key: "beneficiaries.2023-24.total" },
      { label: "SB-3", key: "beneficiaries.2024-25.boys" },
      { label: "SB-3.1", key: "beneficiaries.2024-25.girls" },
      { label: "SB-3.2", key: "beneficiaries.2024-25.total" },
      { label: "GA-1", key: "grantReceived.2022-23" },
      { label: "GA-1.1", key: "grantReceived.2023-24" },
      { label: "GA-1.3", key: "grantReceived.2024-25" },
      { label: "GA-2", key: "grantExpenditure.2022-23" },
      { label: "GA-2.1", key: "grantExpenditure.2023-24" },
      { label: "GA-2.2", key: "grantExpenditure.2024-25" },
      { label: "GA-3", key: "grantBalance.2022-23" },
      { label: "GA-3.1", key: "grantBalance.2023-24" },
      { label: "GA-3.2", key: "grantBalance.2024-25" },
      { label: "BS-1", key: "basicFacilities.hasKitchen" },
      { label: "BS-2", key: "basicFacilities.hasStorageRoom" },
      { label: "BS-3", key: "basicFacilities.hasDiningHall" },
      { label: "BS-4", key: "basicFacilities.hasUtensils" },
      { label: "BS-5", key: "basicFacilities.hasGrainSafety" },
      { label: "BS-6", key: "basicFacilities.hasHandwashSoap" },
      { label: "BS-7", key: "basicFacilities.hasSeparateToilets" },
      { label: "BS-8", key: "basicFacilities.hasCctv" },
      { label: "Q1", key: "quality.kitchenCleanliness" },
      { label: "Q2", key: "quality.diningHallCleanliness" },
      { label: "Q3", key: "quality.storageCleanliness" },
      { label: "Q4", key: "quality.servingAreaCleanliness" },
      { label: "Q5", key: "quality.utensilCondition" },
      { label: "Q6", key: "quality.waterSupply" },
      { label: "Q7", key: "quality.handwashFacility" },
      { label: "Q8", key: "quality.toiletCleanliness" },
      { label: "R-1", key: "repairing.cashBookUpdated" },
      { label: "R-2", key: "repairing.stockRegisterUpdated" },
      { label: "R-3", key: "repairing.attendanceRegisterUpdated" },
      { label: "R-4", key: "repairing.bankAccountUpdated" },
      { label: "R-5", key: "repairing.honorariumRegisterUpdated" },
      { label: "R-6", key: "repairing.tasteRegisterUpdated" },
      { label: "R-7", key: "repairing.snehTithiRegisterUpdated" },
      { label: "PS-1", key: "profitFromScheme.enrollmentImprovement" },
      { label: "PS-2", key: "profitFromScheme.attendanceIncrease" },
      { label: "PS-3", key: "profitFromScheme.nutritionHealthImprovement" },
      { label: "PS-4", key: "profitFromScheme.weightHeightIncrease" },
      { label: "PS-5", key: "profitFromScheme.malnutritionReduction" },
      { label: "PS-6", key: "profitFromScheme.junkFoodPrevention" },
      { label: "PS-7", key: "profitFromScheme.unityBonding" },
    ];

    // CHANGE: Create row-wise data starting with headers
  const excelData = [
    fieldMappings.map((field) => field.label), // Header row
    ...schoolData.map((record) =>
      fieldMappings.map(({ key }) => {
        const keys = key.split(".");
        let value = record;
        for (const k of keys) {
          value = value ? value[k] : undefined;
        }
        return displayValue(value);
      })
    ),
  ];

  // CHANGE: Create worksheet with centered alignment
  const ws = XLSX.utils.aoa_to_sheet(excelData);
  ws["!cols"] = [{ wch: 25 }, ...fieldMappings.map(() => ({ wch: 30 }))]; // Adjust column widths
  ws["!rows"] = excelData.map(() => ({ hpx: 25 })); // Set row heights

  // CHANGE: Apply center alignment to all cells
  for (const cell in ws) {
    if (cell[0] === "!") continue; // Skip metadata
    ws[cell].s = { alignment: { horizontal: "center" } };
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "School Data");
  XLSX.writeFile(wb, "school_data.xlsx");
};

  // Filtering logic for each form
  const filteredParentData = parentData.filter((parent) =>
  (parent.region?.toLowerCase().includes(parentSearch.toLowerCase()) ||
    parent.district?.toLowerCase().includes(parentSearch.toLowerCase()) ||
    parent.taluka?.toLowerCase().includes(parentSearch.toLowerCase()) ||
    parent.udiseNumber?.toLowerCase().includes(parentSearch.toLowerCase()))
  );

  const filteredObserveData = observeData.filter((observe) =>
  (observe.region?.toLowerCase().includes(observeSearch.toLowerCase()) ||
    observe.district?.toLowerCase().includes(observeSearch.toLowerCase()) ||
    observe.taluka?.toLowerCase().includes(observeSearch.toLowerCase()) ||
    observe.schoolUdiseNumber?.toLowerCase().includes(observeSearch.toLowerCase()) ||
    observe.remarks?.toLowerCase().includes(observeSearch.toLowerCase()))
  );

  const filteredSchoolData = schoolData.filter((school) =>
  (school.region?.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    school.district?.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    school.taluka?.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    school.udiseNumber?.toLowerCase().includes(schoolSearch.toLowerCase()))
  );

  // Chart options and data (unchanged)
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Form Submission Trends" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Number of Forms" } },
      x: { title: { display: true, text: "Time" } },
    },
  };

  const prepareChartData = (daily, weekly, monthly, label) => ({
    labels: Object.keys(daily).sort(),
    datasets: [
      {
        label: `${label} (Daily)`,
        data: Object.keys(daily).sort().map((key) => daily[key]),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: `${label} (Weekly)`,
        data: Object.keys(weekly).sort().map((key) => weekly[key]),
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
      {
        label: `${label} (Monthly)`,
        data: Object.keys(monthly).sort().map((key) => monthly[key]),
        borderColor: "rgb(54, 162, 235)",
        tension: 0.1,
      },
    ],
  });

  const parentChartData = prepareChartData(dailyParentData, weeklyParentData, monthlyParentData, "Parent Forms");
  const observeChartData = prepareChartData(dailyObserveData, weeklyObserveData, monthlyObserveData, "Observation Forms");
  const schoolChartData = prepareChartData(dailySchoolData, weeklySchoolData, monthlySchoolData, "School Forms");

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary" style={{ padding: "10px 20px", borderBottom: "1px solid #ddd" }}>
        <div className="d-flex align-items-center">
          <img src={MidDayMealLogo} alt="Mid Day Meal Logo" style={{ height: "40px", marginRight: "10px" }} />
          <a className="navbar-brand text-white ms-2 fs-4 fw-bold" href="/officer_dashboard" style={{ fontSize: "24px" }}>
            Research Officer
          </a>
          <div className="d-flex align-items-center ms-3">
            <Link to="/dashboard" className="nav-link text-white mx-2">Home</Link>
            <Link to="/profile" className="nav-link text-white mx-2">Profile</Link>
            <Link to="/about_us" className="nav-link text-white mx-2">About Us</Link>
          </div>
        </div>
        <div className="ms-auto">
          <button className="btn btn-outline-light" onClick={handleLogout} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : "Logout"}
          </button>
        </div>
      </nav>

      {/* Graphs Section (unchanged) 
      <div className="row mt-4 justify-content-center">
        <div className="col-lg-11 col-md-12 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-center">Form Submission Trends</h5>
              <div className="row">
                <div className="col-md-4">
                  <h6 className="text-center">Parent Forms</h6>
                  <Line data={parentChartData} options={chartOptions} />
                </div>
                <div className="col-md-4">
                  <h6 className="text-center">Observation Forms</h6>
                  <Line data={observeChartData} options={chartOptions} />
                </div>
                <div className="col-md-4">
                  <h6 className="text-center">School Forms</h6>
                  <Line data={schoolChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>*/}
    
    <div className="mb-3 mt-3" style={{ padding: '0 15px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-outline-secondary btn-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
          Back
        </button>
      </div>

      {/* Parent Feedback Form */}
      <div className="row mt-4 justify-content-center">
        <div className="col-lg-11 col-md-12 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Parent Feedback Form</h5>
              <div className="d-flex justify-content-between mb-3">
                <input
                  type="text"
                  className="form-control w-25"
                  placeholder="UDISE क्रमांक शोधा..."
                  value={parentSearch}
                  onChange={(e) => setParentSearch(e.target.value)}
                />
                <div className="d-flex gap-3">
                  <button className="btn btn-outline-success px-4" onClick={addParentEntry}>Add Entry</button>
                  <button className="btn btn-outline-success px-4" onClick={downloadParentExcel}>Download Excel</button>
                </div>
              </div>
              <div className="table-responsive overflow-x-auto">
                <table className="table table-striped text-center">
                  <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8f9fa", zIndex: 1 }}>
                    <tr>
                      <th>#</th>
                      <th>A</th>
                      <th>B</th>
                      <th>C</th>
                      <th>D</th>
                      <th>E1</th>
                      <th>E2</th>
                      <th>E3</th>
                      <th>E4</th>
                      <th>E5</th>
                      <th>E6</th>
                      <th>E7</th>
                      <th>E8</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParentData.length > 0 ? (
                      filteredParentData.map((parent, index) => (
                        <tr key={parent.id}>
                          <td>{index + 1}</td>
                          <td>{displayValue(parent.district)}</td>
                          <td>{displayValue(parent.taluka)}</td>
                          <td>{displayValue(parent.udiseNumber)}</td>
                          <td>{displayValue(parent.sendChildDaily)}</td>
                          <td>{displayValue(parent.weightGain)}</td>
                          <td>{displayValue(parent.sickFrequency)}</td>
                          <td>{displayValue(parent.studyProgress)}</td>
                          <td>{displayValue(parent.nutrition)}</td>
                          <td>{displayValue(parent.attendance)}</td>
                          <td>{displayValue(parent.impactOfNutritionScheme)}</td>
                          <td>{displayValue(parent.effectOnAfternoonAttendance)}</td>
                          <td>{displayValue(parent.effectOfNutritionDietPlan)}</td>
                          <td>
                            <button className="btn btn-primary btn-sm px-3 py-1" onClick={() => updateParentForm(parent.id)}>
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="15" className="text-center">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Observation Form */}
      <div className="row mt-4 justify-content-center">
        <div className="col-lg-11 col-md-12 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">Observation Form</h5>
              <div className="d-flex justify-content-between mb-3">
                <input
                  type="text"
                  className="form-control w-25"
                  placeholder="UDISE क्रमांक शोधा..."
                  value={observeSearch}
                  onChange={(e) => setObserveSearch(e.target.value)}
                />
                <div className="d-flex gap-3">
                  <button className="btn btn-outline-success px-4" onClick={addObservationEntry}>Add Entry</button>
                  <button className="btn btn-outline-success px-4" onClick={downloadObservationExcel}>Download Excel</button>
                </div>
              </div>
              <div className="table-responsive overflow-x-auto">
                <table className="table table-striped text-center">
                  <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8f9fa", zIndex: 1 }}>
                    <tr>
                      <th>#</th>
                      <th>A</th>
                      <th>B</th>
                      <th>C</th>
                      <th>D</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredObserveData.length > 0 ? (
                      filteredObserveData.map((observer, index) => (
                        <tr key={observer.id}>
                          <td>{index + 1}</td>
                          <td>{displayValue(observer.district)}</td>
                          <td>{displayValue(observer.taluka)}</td>
                          <td>{displayValue(observer.udiseNumber)}</td>
                          <td>{displayValue(observer.remarks)}</td>
                          <td>
                            <button className="btn btn-primary btn-sm px-3 py-1" onClick={() => updateObservationForm(observer.id)}>
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* School Feedback Form */}
      <div className="row mt-4 justify-content-center">
        <div className="col-lg-11 col-md-12 mb-4">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">School Feedback Form</h5>
              <div className="d-flex justify-content-between mb-3">
                <input
                  type="text"
                  className="form-control w-25"
                  placeholder="UDISE क्रमांक शोधा..."
                  value={schoolSearch}
                  onChange={(e) => setSchoolSearch(e.target.value)}
                />
                <div className="d-flex gap-3">
                  <button className="btn btn-outline-success px-4" onClick={addSchoolEntry}>Add Entry</button>
                  <button className="btn btn-outline-success px-4" onClick={downloadSchoolExcel}>Download Excel</button>
                </div>
              </div>
              <div className="table-responsive overflow-x-auto">
                <table className="table table-striped text-center">
                <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8f9fa", zIndex: 1 }}>
  <tr>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>#</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>A</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>B</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>C</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>D-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>D-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>D-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>E-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>E-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>E-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>F-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>F-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>F-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>G-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>G-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>G-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>H-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>H-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>H-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-4</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-5</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-6</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-7</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-8</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-9</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-10</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-10.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-10.2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-11</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-11.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-11.2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-12</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-12.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SP-13</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-1.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-4</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-5</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-6</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-6.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-7</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-7.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-8</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-9</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-10</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-11</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-12</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-13</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-14</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-15</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-16</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-17</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-18</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-19</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-20</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-21</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-22</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-23</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-24</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-24.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-25</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-26</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-27</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-27.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-28</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-28.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-28.2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-29</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>ND-30</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>HC-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>HC-1.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>HC-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>HC-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>HC-4</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>HC-5</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>HC-6</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SB-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SB-1.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SB-1.3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SB-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SB-2.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SB-2.2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SB-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SB-3.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>SB-3.2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>GA-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>GA-1.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>GA-1.3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>GA-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>GA-2.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>GA-2.2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>GA-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>GA-3.1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>GA-3.2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>BS-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>BS-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>BS-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>BS-4</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>BS-5</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>BS-6</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>BS-7</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>BS-8</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>Q1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>Q2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>Q3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>Q4</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>Q5</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>Q6</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>Q7</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>Q8</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>R-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>R-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>R-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>R-4</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>R-5</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>R-6</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>R-7</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>PS-1</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>PS-2</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>PS-3</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>PS-4</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>PS-5</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>PS-6</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>PS-7</th>
    <th style={{ whiteSpace: "nowrap", minWidth: "60px", padding: "10px" }}>Actions</th>
  </tr>
</thead>
                  <tbody>
                    {filteredSchoolData.length > 0 ? (
                      filteredSchoolData.map((school, index) => (
                        <tr key={school.id}>
                          <td>{index + 1}</td>
                          <td>{displayValue(school.district)}</td>
                          <td>{displayValue(school.taluka)}</td>
                          <td>{displayValue(school.udiseNumber)}</td>
                          <td>{displayValue(school.teacherMale)}</td>
                          <td>{displayValue(school.teacherFemale)}</td>
                          <td>{displayValue(school.totalTeachers)}</td>
                          <td>{displayValue(school.totalBoys)}</td>
                          <td>{displayValue(school.totalGirls)}</td>
                          <td>{displayValue(school.totalStudents)}</td>
                          <td>{displayValue(school.gradeStudents?.grade1to4?.female)}</td>
                          <td>{displayValue(school.gradeStudents?.grade1to4?.male)}</td>
                          <td>{displayValue(school.gradeStudents?.grade1to4?.total)}</td>
                          <td>{displayValue(school.gradeStudents?.grade5to7?.female)}</td>
                          <td>{displayValue(school.gradeStudents?.grade5to7?.male)}</td>
                          <td>{displayValue(school.gradeStudents?.grade5to7?.total)}</td>
                          <td>{displayValue(school.gradeStudents?.grade8to10?.female)}</td>
                          <td>{displayValue(school.gradeStudents?.grade8to10?.male)}</td>
                          <td>{displayValue(school.gradeStudents?.grade8to10?.total)}</td>
                          <td>{displayValue(school.hasMiddayMealBoard)}</td>
                          <td>{displayValue(school.hasMiddayMealMenu)}</td>
                          <td>{displayValue(school.hasManagementBoard)}</td>
                          <td>{displayValue(school.hasPrincipalContact)}</td>
                          <td>{displayValue(school.hasOfficerContact)}</td>
                          <td>{displayValue(school.hasComplaintBox)}</td>
                          <td>{displayValue(school.hasEmergencyNumber)}</td>
                          <td>{displayValue(school.hasKitchenShed)}</td>
                          <td>{displayValue(school.hasFirstAidBox)}</td>
                          <td>{displayValue(school.hasWaterSource)}</td>
                          <td>{displayValue(school.waterSourceType)}</td>
                          <td>{displayValue(school.hasRegularWaterSupply)}</td>
                          <td>{displayValue(school.hasFireExtinguisher)}</td>
                          <td>{displayValue(school.hasFireExtinguisherCheck)}</td>
                          <td>{displayValue(school.hasFireExtinguisherRefill)}</td>
                          <td>{displayValue(school.hasKitchenGarden)}</td>
                          <td>{displayValue(school.usesGardenProduce)}</td>
                          <td>{displayValue(school.innovativeInitiatives)}</td>
                          <td>{displayValue(school.hasDietCommittee)}</td>
                          <td>{displayValue(school.hasCommitteeBoard)}</td>
                          <td>{displayValue(school.cookingAgency)}</td>
                          <td>{displayValue(school.hasAgreementCopy)}</td>
                          <td>{displayValue(school.hasCookTraining)}</td>
                          <td>{displayValue(school.cookHelperCount)}</td>
                          <td>{displayValue(school.isCookedAtSchool)}</td>
                          <td>{displayValue(school.fuelType)}</td>
                          <td>{displayValue(school.hasWeighingScale)}</td>
                          <td>{displayValue(school.hasRiceWeighed)}</td>
                          <td>{displayValue(school.hasStorageUnits)}</td>
                          <td>{displayValue(school.hasPlates)}</td>
                          <td>{displayValue(school.teacherPresentDuringDistribution)}</td>
                          <td>{displayValue(school.mdmPortalUpdated)}</td>
                          <td>{displayValue(school.supplementaryDiet)}</td>
                          <td>{displayValue(school.sampleStored)}</td>
                          <td>{displayValue(school.cleaningDone)}</td>
                          <td>{displayValue(school.thirdPartySupport)}</td>
                          <td>{displayValue(school.basicFacilitiesAvailable)}</td>
                          <td>{displayValue(school.diningArrangement)}</td>
                          <td>{displayValue(school.followsGovtRecipe)}</td>
                          <td>{displayValue(school.eggsBananasRegular)}</td>
                          <td>{displayValue(school.usesSproutedGrains)}</td>
                          <td>{displayValue(school.labTestMonthly)}</td>
                          <td>{displayValue(school.tasteTestBeforeDistribution)}</td>
                          <td>{displayValue(school.smcParentVisits)}</td>
                          <td>{displayValue(school.hasTasteRegister)}</td>
                          <td>{displayValue(school.dailyTasteEntries)}</td>
                          <td>{displayValue(school.stockMatchesRegister)}</td>
                          <td>{displayValue(school.recipesDisplayed)}</td>
                          <td>{displayValue(school.monitoringCommitteeMeetings)}</td>
                          <td>{displayValue(school.meetingCount2024_25)}</td>
                          <td>{displayValue(school.emptySacksReturned)}</td>
                          <td>{displayValue(school.sackTransferRecorded)}</td>
                          <td>{displayValue(school.sackTransferCount)}</td>
                          <td>{displayValue(school.snehTithiProgram)}</td>
                          <td>{displayValue(school.fieldOfficerVisits)}</td>
                          <td>{displayValue(school.healthCheckupDone)}</td>
                          <td>{displayValue(school.healthCheckupStudentCount)}</td>
                          <td>{displayValue(school.bmiRecorded)}</td>
                          <td>{displayValue(school.weightHeightMeasured)}</td>
                          <td>{displayValue(school.cookHealthCheck)}</td>
                          <td>{displayValue(school.hasSmcResolution)}</td>
                          <td>{displayValue(school.hasHealthCertificate)}</td>
                          <td>{displayValue(school.beneficiaries?.["2022-23"]?.boys)}</td>
                          <td>{displayValue(school.beneficiaries?.["2022-23"]?.girls)}</td>
                          <td>{displayValue(school.beneficiaries?.["2022-23"]?.total)}</td>
                          <td>{displayValue(school.beneficiaries?.["2023-24"]?.boys)}</td>
                          <td>{displayValue(school.beneficiaries?.["2023-24"]?.girls)}</td>
                          <td>{displayValue(school.beneficiaries?.["2023-24"]?.total)}</td>
                          <td>{displayValue(school.beneficiaries?.["2024-25"]?.boys)}</td>
                          <td>{displayValue(school.beneficiaries?.["2024-25"]?.girls)}</td>
                          <td>{displayValue(school.beneficiaries?.["2024-25"]?.total)}</td>
                          <td>{displayValue(school.grantReceived?.["2022-23"])}</td>
                          <td>{displayValue(school.grantReceived?.["2023-24"])}</td>
                          <td>{displayValue(school.grantReceived?.["2024-25"])}</td>
                          <td>{displayValue(school.grantExpenditure?.["2022-23"])}</td>
                          <td>{displayValue(school.grantExpenditure?.["2023-24"])}</td>
                          <td>{displayValue(school.grantExpenditure?.["2024-25"])}</td>
                          <td>{displayValue(school.grantBalance?.["2022-23"])}</td>
                          <td>{displayValue(school.grantBalance?.["2023-24"])}</td>
                          <td>{displayValue(school.grantBalance?.["2024-25"])}</td>
                          <td>{displayValue(school.basicFacilities?.hasKitchen)}</td>
                          <td>{displayValue(school.basicFacilities?.hasStorageRoom)}</td>
                          <td>{displayValue(school.basicFacilities?.hasDiningHall)}</td>
                          <td>{displayValue(school.basicFacilities?.hasUtensils)}</td>
                          <td>{displayValue(school.basicFacilities?.hasGrainSafety)}</td>
                          <td>{displayValue(school.basicFacilities?.hasHandwashSoap)}</td>
                          <td>{displayValue(school.basicFacilities?.hasSeparateToilets)}</td>
                          <td>{displayValue(school.basicFacilities?.hasCctv)}</td>
                          <td>{displayValue(school.quality?.kitchenCleanliness)}</td>
                          <td>{displayValue(school.quality?.diningHallCleanliness)}</td>
                          <td>{displayValue(school.quality?.storageCleanliness)}</td>
                          <td>{displayValue(school.quality?.servingAreaCleanliness)}</td>
                          <td>{displayValue(school.quality?.utensilCondition)}</td>
                          <td>{displayValue(school.quality?.waterSupply)}</td>
                          <td>{displayValue(school.quality?.handwashFacility)}</td>
                          <td>{displayValue(school.quality?.toiletCleanliness)}</td>
                          <td>{displayValue(school.repairing?.cashBookUpdated)}</td>
                          <td>{displayValue(school.repairing?.stockRegisterUpdated)}</td>
                          <td>{displayValue(school.repairing?.attendanceRegisterUpdated)}</td>
                          <td>{displayValue(school.repairing?.bankAccountUpdated)}</td>
                          <td>{displayValue(school.repairing?.honorariumRegisterUpdated)}</td>
                          <td>{displayValue(school.repairing?.tasteRegisterUpdated)}</td>
                          <td>{displayValue(school.repairing?.snehTithiRegisterUpdated)}</td>
                          <td>{displayValue(school.profitFromScheme?.enrollmentImprovement)}</td>
                          <td>{displayValue(school.profitFromScheme?.attendanceIncrease)}</td>
                          <td>{displayValue(school.profitFromScheme?.nutritionHealthImprovement)}</td>
                          <td>{displayValue(school.profitFromScheme?.weightHeightIncrease)}</td>
                          <td>{displayValue(school.profitFromScheme?.malnutritionReduction)}</td>
                          <td>{displayValue(school.profitFromScheme?.junkFoodPrevention)}</td>
                          <td>{displayValue(school.profitFromScheme?.unityBonding)}</td>
                          <td>
                            <button className="btn btn-primary btn-sm px-3 py-1" onClick={() => updateSchoolForm(school.id)}>
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} /> {/* Added ToastContainer */}
    </div>
  );
}

export default OfficerDash;