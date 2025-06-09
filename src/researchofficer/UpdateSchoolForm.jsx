import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../components/Firebase";
import { toast } from "react-toastify";
import UpdateSchoolFormPage1 from "./UpdateSchoolFormPage1.jsx";
import UpdateSchoolFormPage2 from "./UpdateSchoolFormPage2.jsx";
import UpdateSchoolFormPage3 from "./UpdateSchoolFormPage3.jsx";
import UpdateSchoolFormPage4 from "./UpdateSchoolFormPage4.jsx";

const UpdateSchoolForm = ({ role }) => { // Added role prop
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize formData with the same structure as SchoolForm
  const [formData, setFormData] = useState({
    
    schoolName: "",
    inspectionDate: "",
    inspectionTime: "",
    inspectorName: "",
    schoolFullName: "",
    headmasterName: "",
    headmasterPhone: "",
    headmasterAddress: "",
    assistantTeacherName: "",
    assistantTeacherPhone: "",
    udiseNumber: "",
    teacherMale: "",
    teacherFemale: "",
    totalTeachers: "",
    totalBoys: "",
    totalGirls: "",
    totalStudents: "",
    gradeStudents: {
      grade1to4: { female: "", male: "", total: "" },
      grade5to7: { female: "", male: "", total: "" },
      grade8to10: { female: "", male: "", total: "" },
    },

    hasMiddayMealBoard: null,
    hasMiddayMealMenu: null,
    hasManagementBoard: null,
    hasPrincipalContact: null,
    hasOfficerContact: null,
    hasComplaintBox: null,
    hasEmergencyNumber: null,
    hasKitchenShed: null,
    hasFirstAidBox: null,
    hasWaterSource: null,
    waterSourceType: "",
    hasRegularWaterSupply: null,
    hasFireExtinguisher: null,
    hasFireExtinguisherCheck: null,
    hasFireExtinguisherRefill: null,
    fireExtinguisherDetails: "",
    hasKitchenGarden: null,
    usesGardenProduce: null,
    kitchenGardenDetails: "",
    innovativeInitiatives: "",
    

    hasDietCommittee: null,
    hasCommitteeBoard: null,
    cookingAgency: "",
    hasAgreementCopy: null,
    hasCookTraining: null,
    cookHelperCount: "",
    isCookedAtSchool: null,
    fuelType: "",
    hasWeighingScale: null,
    hasRiceWeighed: null,
    hasStorageUnits: null,
    hasPlates: null,
    teacherPresentDuringDistribution: null,
    mdmPortalUpdated: null,
    supplementaryDiet: null,
    sampleStored: null,
    cleaningDone: null,
    thirdPartySupport: null,
    basicFacilitiesAvailable: null,
    diningArrangement: "",
    followsGovtRecipe: null,
    eggsBananasRegular: null,
    usesSproutedGrains: null,
    labTestMonthly: null,
    tasteTestBeforeDistribution: null,
    smcParentVisits: null,
    hasTasteRegister: null,
    dailyTasteEntries: null,
    stockMatchesRegister: null,
    recipesDisplayed: null,
    monitoringCommitteeMeetings: null,
    meetingCount2024_25: "",
    emptySacksReturned: null,
    sackTransferRecorded: null,
    sackTransferCount: "",
    snehTithiProgram: null,
    fieldOfficerVisits: null,
    healthCheckupDone: null,
    healthCheckupStudentCount: "",
    bmiRecorded: null,
    weightHeightMeasured: null,
    cookHealthCheck: null,
    hasSmcResolution: null,
    hasHealthCertificate: null,
    helper1Name: "",
    helper2Name: "",
    beneficiaries: {
      "2022-23": { boys: 0, girls: 0, total: 0 },
      "2023-24": { boys: 0, girls: 0, total: 0 },
      "2024-25": { boys: 0, girls: 0, total: 0 },
    },
    grantReceived: {
      "2022-23": 0,
      "2023-24": 0,
      "2024-25": 0,
    },
    grantExpenditure: {
      "2022-23": 0,
      "2023-24": 0,
      "2024-25": 0,
    },
    grantBalance: {
      "2022-23": 0,
      "2023-24": 0,
      "2024-25": 0,
    },
    basicFacilities: {
      hasKitchen: null,
      hasStorageRoom: null,
      hasDiningHall: null,
      hasUtensils: null,
      hasGrainSafety: null,
      hasHandwashSoap: null,
      hasSeparateToilets: null,
      hasCctv: null,
    },
    quality: {
      kitchenCleanliness: null,
      diningHallCleanliness: null,
      storageCleanliness: null,
      servingAreaCleanliness: null,
      utensilCondition: null,
      waterSupply: null,
      handwashFacility: null,
      toiletCleanliness: null,
    },
    repairing: {
      cashBookUpdated: null,
      stockRegisterUpdated: null,
      attendanceRegisterUpdated: null,
      bankAccountUpdated: null,
      honorariumRegisterUpdated: null,
      tasteRegisterUpdated: null,
      snehTithiRegisterUpdated: null,
    },
    profitFromScheme: {
      enrollmentImprovement: null,
      attendanceIncrease: null,
      nutritionHealthImprovement: null,
      weightHeightIncrease: null,
      malnutritionReduction: null,
      junkFoodPrevention: null,
      unityBonding: null,
    },
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const docRef = doc(db, "School_Form", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Merge fetched data with default structure
          setFormData((prev) => ({
            ...prev,
            ...docSnap.data(),
          }));
        } else {
          toast.error("No such school form exists!");
          navigate("/officer_dashboard");
        }
      } catch (error) {
        toast.error("Error fetching school data: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSchoolData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Helper function to update nested objects (from SchoolFormPage4)
  const updateNestedObject = (obj, path, value) => {
    const [head, ...rest] = path.split(".");
    if (rest.length === 0) {
      return { ...obj, [head]: value };
    }
    return {
      ...obj,
      [head]: updateNestedObject(obj[head] || {}, rest.join("."), value),
    };
  };

  const handleBinaryChange = (field, value) => {
    const newValue = value === "होय" ? 1 : value === "नाही" ? 0 : null;
    setFormData((prev) => updateNestedObject(prev, field, newValue));
  };

  const handleQualityChange = (field, value) => {
    const qualityMap = { "निकृष्ट": "1", "बऱ्यापैकी": "2", "अतिउत्तम": "3" };
    const newValue = qualityMap[value] || "";
    setFormData((prev) => updateNestedObject(prev, field, newValue));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!formData.helper1Name) {
      toast.error("Helper 1 Name is required!");
      return;
    }
    try {
      const docRef = doc(db, "School_Form", id);
      await updateDoc(docRef, {
        ...formData,
        submissionDate: new Date().toISOString(),
      });
      toast.success("School Form updated successfully!");
      
      // Dynamic redirect based on role with a delay
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin_dashboard");
        } else if (role === "Research Officer") {
          navigate("/officer_dashboard"); // Adjust to "/dashboard" if needed
        } else {
          navigate("/school-feedback"); // Fallback if role is undefined
        }
      }, 1500); // 1.5s delay to show toast
    } catch (error) {
      console.error("Error updating form data:", error);
      toast.error("Error updating school form: " + error.message);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  const pageProps = {
    formData,
    setFormData,
    handleChange,
    handleBinaryChange,
    handleQualityChange,
    nextStep,
    prevStep,
  };

  return (
    <div className="container mt-4 p-4 border rounded bg-white">
      <h2 className="text-center border-bottom pb-2">Update School Form</h2>
      <div className="progress mb-4">
        <div
          className="progress-bar bg-primary"
          role="progressbar"
          style={{ width: `${(step / 4) * 100}%` }}
          aria-valuenow={step}
          aria-valuemin="1"
          aria-valuemax="4"
        >
          Step {step} of 4
        </div>
      </div>
      {step === 1 && <UpdateSchoolFormPage1 {...pageProps} />}
      {step === 2 && <UpdateSchoolFormPage2 {...pageProps} />}
      {step === 3 && <UpdateSchoolFormPage3 {...pageProps} />}
      {step === 4 && <UpdateSchoolFormPage4 {...pageProps} handleSubmit={handleSubmit} />}
    </div>
  );
};

export default UpdateSchoolForm;