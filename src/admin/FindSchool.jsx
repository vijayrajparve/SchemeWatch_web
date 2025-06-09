import React, { useState, useEffect } from "react";
import { db, auth } from "../components/Firebase";
import { getDocs, collection, deleteDoc, query, where, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import { Accordion, Button, Form, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { onAuthStateChanged } from "firebase/auth";
// Added FontAwesomeIcon and faArrowLeft imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function FindSchool() {
  const [searchType, setSearchType] = useState("udise");
  const [searchValue, setSearchValue] = useState("");
  const [parentData, setParentData] = useState([]);
  const [schoolData, setSchoolData] = useState([]);
  const [observeData, setObserveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parentFilter, setParentFilter] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [observeFilter, setObserveFilter] = useState("");
  const [parentPage, setParentPage] = useState(1);
  const [schoolPage, setSchoolPage] = useState(1);
  const [observePage, setObservePage] = useState(1);
  const [user, setUser] = useState(null); // Track authenticated user
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Safe nested property accessor
  const getNestedValue = (obj, path) => {
    try {
      return path.split(/\.|\[|\]/).reduce((acc, part) => {
        if (!part) return acc;
        return acc && acc[part] !== undefined ? acc[part] : null;
      }, obj) || "N/A";
    } catch {
      return "N/A";
    }
  };

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        toast.error("Please log in to access school data.");
        navigate("/login"); // Redirect to your login page
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const displayValue = (value) => (value != null ? value : "N/A");

  const handleSearch = async () => {
    const trimmedSearchValue = searchValue.trim(); // Remove leading/trailing spaces
    if (!trimmedSearchValue) {
      toast.warn("Please enter a value to search!");
      return;
    }
    if (!user) {
      toast.error("You must be logged in to search for school data.");
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }
    setLoading(true);
    try {
      // Parent_Form Query
      const parentQuery = query(
        collection(db, "Parent_Form"),
        searchType === "udise" ? where("udiseNumber", "==", trimmedSearchValue) : where("schoolName", "==", trimmedSearchValue)
      );
      const parentSnap = await getDocs(parentQuery);
      console.log("Parent_Form - Docs found:", parentSnap.size, "Data:", parentSnap.docs.map((doc) => doc.data()));
      setParentData(parentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      // School_Forms Query
      const schoolQuery = query(
        collection(db, "School_Form"),
        searchType === "udise" ? where("udiseNumber", "==", trimmedSearchValue) : where("schoolName", "==", trimmedSearchValue)
      );
      const schoolSnap = await getDocs(schoolQuery);
      const schoolDocs = schoolSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("School_Form - Docs found:", schoolSnap.size, "Raw Data:", schoolDocs);
      setSchoolData(schoolDocs);

      const observeQuery = query(
        collection(db, "Observation_Form"),
        searchType === "udise" ? where("udiseNumber", "==", trimmedSearchValue) : where("schoolName", "==", trimmedSearchValue)
      );
      const observeSnap = await getDocs(observeQuery);
      console.log("Observation_Form - Docs found:", observeSnap.size, "Data:", observeSnap.docs.map((doc) => doc.data()));
      setObserveData(observeSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      if (parentSnap.empty && schoolSnap.empty && observeSnap.empty) {
        toast.info("No records found for this school!");
      }
    } catch (error) {
      console.error("Error fetching school data:", error);
      toast.error("Error fetching school data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collectionName, id, successMessage) => {
    if (!user) {
      toast.error("You must be logged in to delete data.");
      navigate("/login");
      return;
    }
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success(successMessage);
      handleSearch();
    } catch (error) {
      toast.error(`Error deleting entry: ${error.message}`);
    }
  };

  const parentFieldMappings = [
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

  const schoolFieldMappings = [
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

  const observeFieldMappings = [
    { label: "A", key: "district" },
    { label: "B", key: "taluka" },
    { label: "C", key: "udiseNumber" }, 
    { label: "अभिप्राय", key: "remarks" },
  ];

  const downloadExcel = (data, fieldMappings, sheetName, fileName) => {
    if (data.length === 0) return toast.warn(`No ${sheetName.toLowerCase()} data available to download!`);
    const headers = fieldMappings.map(field => field.label);
    const dataRows = data.map((record) =>
      fieldMappings.map((field) =>
        field.key.includes(".") || field.key.includes("[")
          ? getNestedValue(record, field.key)
          : record[field.key] != null ? record[field.key] : "N/A"
      )
    );
    const excelData = [headers, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    fieldMappings.forEach((_, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      ws[cellRef].s = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        }
      };
    });
    ws['!cols'] = fieldMappings.map(() => ({ wch: 20 }));
    ws['!rows'] = [{ hpx: 25 }, ...dataRows.map(() => ({ hpx: 20 }))];
    for (let r = 1; r <= dataRows.length; r++) {
      for (let c = 0; c < fieldMappings.length; c++) {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        if (!ws[cellRef]) ws[cellRef] = { v: "N/A" };
        ws[cellRef].s = {
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
      }
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const downloadAllExcel = () => {
    if (!user) {
      toast.error("You must be logged in to download data.");
      navigate("/login");
      return;
    }
    if (parentData.length === 0 && schoolData.length === 0 && observeData.length === 0)
      return toast.warn("No data available to download!");
    const wb = XLSX.utils.book_new();
    if (parentData.length > 0) {
      const headers = parentFieldMappings.map((field) => field.label);
      const dataRows = parentData.map((record) =>
        parentFieldMappings.map((field) =>
          record[field.key] != null ? record[field.key] : "N/A"
        )
      );
      const excelData = [headers, ...dataRows];
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      parentFieldMappings.forEach((_, index) => {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
        ws[cellRef].s = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center" },
          border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
        };
      });
      ws['!cols'] = parentFieldMappings.map(() => ({ wch: 20 }));
      ws['!rows'] = [{ hpx: 25 }, ...dataRows.map(() => ({ hpx: 20 }))];
      for (let r = 1; r <= dataRows.length; r++) {
        for (let c = 0; c < parentFieldMappings.length; c++) {
          const cellRef = XLSX.utils.encode_cell({ r, c });
          if (!ws[cellRef]) ws[cellRef] = { v: "N/A" };
          ws[cellRef].s = {
            alignment: { horizontal: "center", vertical: "center" },
            border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
          };
        }
      }
      XLSX.utils.book_append_sheet(wb, ws, "Parent Data");
    }
    if (schoolData.length > 0) {
      const headers = schoolFieldMappings.map(field => field.label);
      const dataRows = schoolData.map(record =>
        schoolFieldMappings.map(field => 
          field.key.includes(".") || field.key.includes("[")
            ? getNestedValue(record, field.key)
            : record[field.key] != null ? record[field.key] : "N/A"
        )
      );
      const excelData = [headers, ...dataRows];
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      schoolFieldMappings.forEach((_, index) => {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
        ws[cellRef].s = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center" },
          border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
        };
      });
      ws['!cols'] = schoolFieldMappings.map(() => ({ wch: 20 }));
      ws['!rows'] = [{ hpx: 25 }, ...dataRows.map(() => ({ hpx: 20 }))];
      for (let r = 1; r <= dataRows.length; r++) {
        for (let c = 0; c < schoolFieldMappings.length; c++) {
          const cellRef = XLSX.utils.encode_cell({ r, c });
          if (!ws[cellRef]) ws[cellRef] = { v: "N/A" };
          ws[cellRef].s = {
            alignment: { horizontal: "center", vertical: "center" },
            border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
          };
        }
      }
      XLSX.utils.book_append_sheet(wb, ws, "School Data");
    }
    if (observeData.length > 0) {
      const headers = observeFieldMappings.map((field) => field.label);
      const dataRows = observeData.map((record) =>
        observeFieldMappings.map((field) =>
          record[field.key] != null ? record[field.key] : "N/A"
        )
      );
      const excelData = [headers, ...dataRows];
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      observeFieldMappings.forEach((_, index) => {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
        ws[cellRef].s = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center" },
          border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
        };
      });
      ws['!cols'] = observeFieldMappings.map(() => ({ wch: 20 }));
      ws['!rows'] = [{ hpx: 25 }, ...dataRows.map(() => ({ hpx: 20 }))];
      for (let r = 1; r <= dataRows.length; r++) {
        for (let c = 0; c < observeFieldMappings.length; c++) {
          const cellRef = XLSX.utils.encode_cell({ r, c });
          if (!ws[cellRef]) ws[cellRef] = { v: "N/A" };
          ws[cellRef].s = {
            alignment: { horizontal: "center", vertical: "center" },
            border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } }
          };
        }
      }
      XLSX.utils.book_append_sheet(wb, ws, "Observation Data");
    }
    XLSX.writeFile(wb, "all_school_data.xlsx");
  };

  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const filteredParentData = parentData.filter((parent) =>
    (parent.parentName?.toLowerCase() || "").includes(parentFilter.toLowerCase()) ||
    (parent.schoolName?.toLowerCase() || "").includes(parentFilter.toLowerCase())
  );
  const filteredSchoolData = schoolData.filter((school) =>
    school.schoolName?.toLowerCase().includes(schoolFilter.toLowerCase()) ||
    school.udiseNumber?.toLowerCase().includes(schoolFilter.toLowerCase())
  );
  const filteredObserveData = observeData.filter((observe) =>
    observe.schoolName?.toLowerCase().includes(observeFilter.toLowerCase()) ||
    observe.udiseNumber?.toLowerCase().includes(observeFilter.toLowerCase())
  );

  return (
    <div className="container mt-4">
      {/* Added: Back button to navigate to admin_dashboard */}
      <div className="mb-3">
        <Button
          onClick={() => navigate("/admin_dashboard")}
          variant="outline-secondary"
          size="sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
          Back
        </Button>
      </div>
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title text-center mb-4">Find a School</h5>
          <div className="d-flex mb-4 align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Form.Select
                className="w-25 me-2"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="udise">UDISE Number</option>
              </Form.Select>
              <Form.Control
                type="text"
                className="w-50 me-2"
                placeholder={`Enter ${searchType === "udise" ? "UDISE Number" : "School Name"}`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button variant="primary" onClick={handleSearch} disabled={loading || !user}>
                {loading ? <Spinner as="span" animation="border" size="sm" /> : "Search"}
              </Button>
            </div>
          </div>
          <Accordion defaultActiveKey="0">
            {/* Parent Feedback Section */}
            <Accordion.Item eventKey="0">
              <Accordion.Header>Parent Feedback ({filteredParentData.length})</Accordion.Header>
              <Accordion.Body>
                <div className="d-flex justify-content-between mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Filter by parent or school name..."
                    value={parentFilter}
                    onChange={(e) => setParentFilter(e.target.value)}
                    className="w-25"
                  />
                  <div>
                    <Button variant="outline-success" className="me-2" onClick={() => downloadExcel(parentData, parentFieldMappings, "Parent Data", "parent_data")}>
                      Download Excel
                    </Button>
                  </div>
                </div>
                {loading ? (
                  <div className="text-center"><Spinner animation="border" /></div>
                ) : filteredParentData.length > 0 ? (
                  <>
                    <div className="table-responsive">
                      <table className="table table-striped text-center">
                        <thead>
                          <tr>
                            <th>#</th>
                            {parentFieldMappings.map((field, index) => (
                              <th key={index}>{field.label}</th>
                            ))}
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginate(filteredParentData, parentPage).map((parent, index) => (
                            <tr key={parent.id}>
                              <td>{(parentPage - 1) * itemsPerPage + index + 1}</td>
                              {parentFieldMappings.map((field, idx) => (
                                <td key={idx}>{displayValue(parent[field.key])}</td>
                              ))}
                              <td>
                                <OverlayTrigger overlay={<Tooltip>Edit Entry</Tooltip>}>
                                  <Button variant="primary" size="sm" className="me-2" onClick={() => navigate(`/update_parent_form/${parent.id}`)}>
                                    Edit
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Delete Entry</Tooltip>}>
                                  <Button variant="danger" size="sm" onClick={() => handleDelete("Parent_Form", parent.id, "Parent entry deleted successfully!")}>
                                    Delete
                                  </Button>
                                </OverlayTrigger>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                      <Button variant="outline-primary" disabled={parentPage === 1} onClick={() => setParentPage(parentPage - 1)} className="me-2">
                        Previous
                      </Button>
                      <span className="align-self-center">Page {parentPage} of {Math.ceil(filteredParentData.length / itemsPerPage)}</span>
                      <Button variant="outline-primary" disabled={parentPage === Math.ceil(filteredParentData.length / itemsPerPage)} onClick={() => setParentPage(parentPage + 1)} className="ms-2">
                        Next
                      </Button>
                    </div>
                  </>
                ) : (
                  <p>No parent feedback found for this school.</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
            {/* School Feedback Section */}
            <Accordion.Item eventKey="1">
              <Accordion.Header>School Feedback ({filteredSchoolData.length})</Accordion.Header>
              <Accordion.Body>
                <div className="d-flex justify-content-between mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Filter by school name or UDISE..."
                    value={schoolFilter}
                    onChange={(e) => setSchoolFilter(e.target.value)}
                    className="w-25"
                  />
                  <div>
                    <Button variant="outline-success" className="me-2" onClick={() => downloadExcel(schoolData, schoolFieldMappings, "School Data", "school_data")}>
                      Download Excel
                    </Button>
                  </div>
                </div>
                {loading ? (
                  <div className="text-center"><Spinner animation="border" /></div>
                ) : filteredSchoolData.length > 0 ? (
                  <>
                    <div className="table-responsive">
                      <table className="table table-striped text-center">
                        <thead>
                          <tr>
                            <th>#</th>
                            {schoolFieldMappings.map((field, index) => (
                              <th key={index}>{field.label}</th>
                            ))}
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginate(filteredSchoolData, schoolPage).map((school, index) => (
                            <tr key={school.id}>
                              <td>{(schoolPage - 1) * itemsPerPage + index + 1}</td>
                              {schoolFieldMappings.map((field, idx) => (
                                <td key={idx}>
                                  {displayValue(
                                    field.key.includes(".") || field.key.includes("[")
                                      ? getNestedValue(school, field.key)
                                      : school[field.key]
                                  )}
                                </td>
                              ))}
                              <td>
                                <OverlayTrigger overlay={<Tooltip>Edit Entry</Tooltip>}>
                                  <Button variant="primary" size="sm" className="me-2" onClick={() => navigate(`/update_school_form/${school.id}`)}>
                                    Edit
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Delete Entry</Tooltip>}>
                                  <Button variant="danger" size="sm" onClick={() => handleDelete("School_Form", school.id, "School entry deleted successfully!")}>
                                    Delete
                                  </Button>
                                </OverlayTrigger>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                      <Button variant="outline-primary" disabled={schoolPage === 1} onClick={() => setSchoolPage(schoolPage - 1)} className="me-2">
                        Previous
                      </Button>
                      <span className="align-self-center">Page {schoolPage} of {Math.ceil(filteredSchoolData.length / itemsPerPage)}</span>
                      <Button variant="outline-primary" disabled={schoolPage === Math.ceil(filteredSchoolData.length / itemsPerPage)} onClick={() => setSchoolPage(schoolPage + 1)} className="ms-2">
                        Next
                      </Button>
                    </div>
                  </>
                ) : (
                  <p>No school feedback found for this school.</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
            {/* Observation Feedback Section */}
            <Accordion.Item eventKey="2">
              <Accordion.Header>Observation Feedback ({filteredObserveData.length})</Accordion.Header>
              <Accordion.Body>
                <div className="d-flex justify-content-between mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Filter by school name or UDISE..."
                    value={observeFilter}
                    onChange={(e) => setObserveFilter(e.target.value)}
                    className="w-25"
                  />
                  <div>
                    <Button variant="outline-success" className="me-2" onClick={() => downloadExcel(observeData, observeFieldMappings, "Observation Data", "observation_data")}>
                      Download Excel
                    </Button>
                  </div>
                </div>
                {loading ? (
                  <div className="text-center"><Spinner animation="border" /></div>
                ) : filteredObserveData.length > 0 ? (
                  <>
                    <div className="table-responsive">
                      <table className="table table-striped text-center">
                        <thead>
                          <tr>
                            <th>#</th>
                            {observeFieldMappings.map((field, index) => (
                              <th key={index}>{field.label}</th>
                            ))}
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginate(filteredObserveData, observePage).map((observe, index) => (
                            <tr key={observe.id}>
                              <td>{(observePage - 1) * itemsPerPage + index + 1}</td>
                              {observeFieldMappings.map((field, idx) => (
                                <td key={idx}>{displayValue(observe[field.key])}</td>
                              ))}
                              <td>
                                <OverlayTrigger overlay={<Tooltip>Edit Entry</Tooltip>}>
                                  <Button variant="primary" size="sm" className="me-2" onClick={() => navigate(`/update_observation_form/${observe.id}`)}>
                                    Edit
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Delete Entry</Tooltip>}>
                                  <Button variant="danger" size="sm" onClick={() => handleDelete("Observation_Form", observe.id, "Observation entry deleted successfully!")}>
                                    Delete
                                  </Button>
                                </OverlayTrigger>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                      <Button variant="outline-primary" disabled={observePage === 1} onClick={() => setObservePage(observePage - 1)} className="me-2">
                        Previous
                      </Button>
                      <span className="align-self-center">Page {observePage} of {Math.ceil(filteredObserveData.length / itemsPerPage)}</span>
                      <Button variant="outline-primary" disabled={observePage === Math.ceil(filteredObserveData.length / itemsPerPage)} onClick={() => setObservePage(observePage + 1)} className="ms-2">
                        Next
                      </Button>
                    </div>
                  </>
                ) : (
                  <p>No observation feedback found for this school.</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default FindSchool;