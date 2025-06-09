import React, { useState } from "react";
import { Button, Spinner, Alert } from "react-bootstrap"; // CHANGED: Added Button, Spinner, and Alert imports
import { ToastContainer, toast } from "react-toastify"; // CHANGED: Added react-toastify import
import "react-toastify/dist/ReactToastify.css"; // CHANGED: Added react-toastify CSS import
import { useNavigate } from "react-router-dom"; // CHANGED: Added useNavigate import for navigation

const SchoolFormPage4 = ({ formData, setFormData, prevStep, handleSubmit }) => {
  const [highlightedField, setHighlightedField] = useState(null);
  const [focusMessage, setFocusMessage] = useState("");
  const [loading, setLoading] = useState(false); // CHANGED: Added loading state
  const [message, setMessage] = useState(""); // CHANGED: Added message state for success/error feedback
  const navigate = useNavigate(); // CHANGED: Added navigate hook for redirection

  // Helper function to update nested objects
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
    if (highlightedField === field && newValue !== null) {
      setHighlightedField(null);
      setFocusMessage("");
    }
  };

  const handleQualityChange = (field, value) => {
    const qualityMap = { "निकृष्ट": "1", "बऱ्यापैकी": "2", "अतिउत्तम": "3" };
    const newValue = qualityMap[value] || "";
    setFormData((prev) => updateNestedObject(prev, field, newValue));
    if (highlightedField === field && newValue) {
      setHighlightedField(null);
      setFocusMessage("");
    }
  };

  // Validation function
  const validateForm = () => {
    console.log("Validating formData:", JSON.stringify(formData, null, 2));

    const fields = [
      { key: "basicFacilities.hasKitchen", label: "स्वयंपाकगृह" },
      { key: "basicFacilities.hasStorageRoom", label: "धान्यासाठी खोली" },
      { key: "basicFacilities.hasDiningHall", label: "भोजन हॉल" },
      { key: "basicFacilities.hasUtensils", label: "भांड्याची उपलब्धता" },
      { key: "basicFacilities.hasGrainSafety", label: "धान्याची मालाची सुरक्षितता" },
      { key: "basicFacilities.hasHandwashSoap", label: "हात स्वच्छ करण्यासाठी हँडवॉश, साबण" },
      { key: "basicFacilities.hasSeparateToilets", label: "स्वतंत्र शौचालय" },
      { key: "basicFacilities.hasCctv", label: "CCTV उपलब्धता" },
      { key: "quality.kitchenCleanliness", label: "स्वयंपाकगृहाची स्वच्छता" },
      { key: "quality.diningHallCleanliness", label: "भोजन हॉल स्वच्छता" },
      { key: "quality.storageCleanliness", label: "धान्यादी साठा खोलीची स्वच्छता" },
      { key: "quality.servingAreaCleanliness", label: "शिजवलेला आहार वितरित करण्याची जागा" },
      { key: "quality.utensilCondition", label: "भांड्यांची स्थिती आणि स्वच्छता" },
      { key: "quality.waterSupply", label: "पिण्याच्या शुद्ध पाण्याचा नियमित पुरवठा" },
      { key: "quality.handwashFacility", label: "विद्यार्थ्यांसाठी हात धुण्याची सुविधा" },
      { key: "quality.toiletCleanliness", label: "स्वतंत्र शौचालय स्वच्छता" },
      { key: "repairing.cashBookUpdated", label: "कॅशबुक अद्ययावत" },
      { key: "repairing.stockRegisterUpdated", label: "साठा नोंदवही अद्ययावत" },
      { key: "repairing.attendanceRegisterUpdated", label: "उपस्थिती रजिस्टर अद्ययावत" },
      { key: "repairing.bankAccountUpdated", label: "बँक खाते अद्ययावत" },
      { key: "repairing.honorariumRegisterUpdated", label: "मानधन नोंदवही अद्ययावत" },
      { key: "repairing.tasteRegisterUpdated", label: "चव नोंदवही अद्ययावत" },
      { key: "repairing.snehTithiRegisterUpdated", label: "स्नेह भोजन/तिथी भोजन नोंदवही" },
      { key: "profitFromScheme.enrollmentImprovement", label: "पटनोंदणी मध्ये सुधारणा" },
      { key: "profitFromScheme.attendanceIncrease", label: "दैनंदिन उपस्थितीमध्ये वाढ" },
      { key: "profitFromScheme.nutritionHealthImprovement", label: "पोषण आणि आरोग्य सुधारणा" },
      { key: "profitFromScheme.weightHeightIncrease", label: "वजन उंची यामध्ये वाढ" },
      { key: "profitFromScheme.malnutritionReduction", label: "कुपोषण मुक्त होण्यासाठी मदत" },
      { key: "profitFromScheme.junkFoodPrevention", label: "जंक फूड प्रतिबंध" },
      { key: "profitFromScheme.unityBonding", label: "एकता आणि बंधुभाव जोपासना" },
    ];

    for (const { key, label } of fields) {
      const [section, field] = key.split(".");
      const value = formData[section]?.[field];
      if (section === "quality") {
        if (value !== "1" && value !== "2" && value !== "3") {
          console.log(`Validation failed: ${key} is empty or invalid`);
          return { key, label };
        }
      } else {
        if (value !== 0 && value !== 1) {
          console.log(`Validation failed: ${key} is empty or invalid`);
          return { key, label };
        }
      }
    }

    console.log("Validation passed");
    return null;
  };

  // Modified submit handler
  const handleFormSubmit = async () => {
    console.log("handleFormSubmit triggered, formData:", JSON.stringify(formData, null, 2));
    setLoading(true); // CHANGED: Set loading to true at the start
    setMessage(""); // CHANGED: Clear previous messages

    const validationError = validateForm();
    if (validationError) {
      console.log("Validation error:", validationError);
      setHighlightedField(validationError.key);
      setFocusMessage(`कृपया ${validationError.label} भरा`);
      toast.error(`कृपया ${validationError.label} भरा`); // CHANGED: Added toast notification for validation error
      const element = document.getElementById(validationError.key);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      } else {
        console.warn(`Element with id ${validationError.key} not found`);
      }
      setLoading(false); // CHANGED: Reset loading state on validation failure
      return;
    }

    try {
      console.log("Form data before submission:", formData);
      console.log("Calling handleSubmit...");
      
      await handleSubmit({
        ...formData,
        submittedAt: new Date() // CHANGED: Added submittedAt timestamp to match ObservationForm
      });
      console.log("Form submission successful!");
      setMessage("डेटा यशस्वीरित्या सबमिट झाला!"); // CHANGED: Set success message
      toast.success("फॉर्म यशस्वीरित्या सबमिट झाला!"); // CHANGED: Added toast notification for success
      setHighlightedField(null);
      setFocusMessage("");
      setTimeout(() => navigate("/officer_dashboard"), 3000); // CHANGED: Navigate to /observation-feedback after 3 seconds
    } catch (error) {
      console.error("Error during form submission:", error);
      let errorMessage = "डेटा सबमिट करताना त्रुटी आली: ";
      if (error.code === "permission-denied") {
        errorMessage += "आपल्याला या डेटा मध्ये प्रवेश नाही. (Permission denied)";
      } else {
        errorMessage += error.message;
      }
      setMessage(errorMessage); // CHANGED: Set error message
      toast.error(errorMessage); // CHANGED: Added toast notification for error
    } finally {
      setLoading(false); // CHANGED: Ensure loading is reset after submission attempt
    }
  };

  // Focus and blur handlers
  const handleFocus = (fieldName, label) => {
    if (highlightedField === fieldName) {
      setFocusMessage(`कृपया ${label} भरा`);
    }
  };

  const handleBlur = () => {
    setFocusMessage("");
  };

  return (
    <div className="container mt-4">
      <style>
        {`
          .unfilled-field {
            outline: 2px solid blue !important;
          }
          .focus-message {
            color: #007bff;
            font-size: 0.875rem;
            margin-top: 10px;
            text-align: center;
          }
        `}
      </style>

      <div className="card p-4 shadow-lg w-80 mx-auto">
        <div className="card-header bg-primary text-white">
          <h3>पायाभूत सुविधा (होय/नाही)</h3>
        </div>
        <table className="table table-bordered mt-3">
          <thead className="table-secondary">
            <tr>
              <th className="text-start">अ.क्र.</th>
              <th className="text-start">तपशील</th>
              <th className="text-start">होय</th>
              <th className="text-start">नाही</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-start">1</td>
              <td className="text-start">स्वयंपाकगृह</td>
              <td>
                <input
                  type="checkbox"
                  id="basicFacilities.hasKitchen"
                  className={highlightedField === "basicFacilities.hasKitchen" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasKitchen === 1}
                  onChange={() => handleBinaryChange("basicFacilities.hasKitchen", formData.basicFacilities?.hasKitchen === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("basicFacilities.hasKitchen", "स्वयंपाकगृह")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "basicFacilities.hasKitchen" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasKitchen === 0}
                  onChange={() => handleBinaryChange("basicFacilities.hasKitchen", formData.basicFacilities?.hasKitchen === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("basicFacilities.hasKitchen", "स्वयंपाकगृह")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td className="text-start">2</td>
              <td className="text-start">धान्यासाठी खोली</td>
              <td>
                <input
                  type="checkbox"
                  id="basicFacilities.hasStorageRoom"
                  className={highlightedField === "basicFacilities.hasStorageRoom" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasStorageRoom === 1}
                  onChange={() => handleBinaryChange("basicFacilities.hasStorageRoom", formData.basicFacilities?.hasStorageRoom === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("basicFacilities.hasStorageRoom", "धान्यासाठी खोली")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "basicFacilities.hasStorageRoom" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasStorageRoom === 0}
                  onChange={() => handleBinaryChange("basicFacilities.hasStorageRoom", formData.basicFacilities?.hasStorageRoom === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("basicFacilities.hasStorageRoom", "धान्यासाठी खोली")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td className="text-start">3</td>
              <td className="text-start">भोजन हॉल</td>
              <td>
                <input
                  type="checkbox"
                  id="basicFacilities.hasDiningHall"
                  className={highlightedField === "basicFacilities.hasDiningHall" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasDiningHall === 1}
                  onChange={() => handleBinaryChange("basicFacilities.hasDiningHall", formData.basicFacilities?.hasDiningHall === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("basicFacilities.hasDiningHall", "भोजन हॉल")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "basicFacilities.hasDiningHall" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasDiningHall === 0}
                  onChange={() => handleBinaryChange("basicFacilities.hasDiningHall", formData.basicFacilities?.hasDiningHall === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("basicFacilities.hasDiningHall", "भोजन हॉल")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td className="text-start">4</td>
              <td className="text-start">भांड्याची उपलब्धता</td>
              <td>
                <input
                  type="checkbox"
                  id="basicFacilities.hasUtensils"
                  className={highlightedField === "basicFacilities.hasUtensils" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasUtensils === 1}
                  onChange={() => handleBinaryChange("basicFacilities.hasUtensils", formData.basicFacilities?.hasUtensils === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("basicFacilities.hasUtensils", "भांड्याची उपलब्धता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "basicFacilities.hasUtensils" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasUtensils === 0}
                  onChange={() => handleBinaryChange("basicFacilities.hasUtensils", formData.basicFacilities?.hasUtensils === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("basicFacilities.hasUtensils", "भांड्याची उपलब्धता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td className="text-start">5</td>
              <td className="text-start">धान्याची मालाची सुरक्षितता</td>
              <td>
                <input
                  type="checkbox"
                  id="basicFacilities.hasGrainSafety"
                  className={highlightedField === "basicFacilities.hasGrainSafety" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasGrainSafety === 1}
                  onChange={() => handleBinaryChange("basicFacilities.hasGrainSafety", formData.basicFacilities?.hasGrainSafety === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("basicFacilities.hasGrainSafety", "धान्याची मालाची सुरक्षितता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "basicFacilities.hasGrainSafety" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasGrainSafety === 0}
                  onChange={() => handleBinaryChange("basicFacilities.hasGrainSafety", formData.basicFacilities?.hasGrainSafety === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("basicFacilities.hasGrainSafety", "धान्याची मालाची सुरक्षितता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td className="text-start">6</td>
              <td className="text-start">हात स्वच्छ करण्यासाठी हँडवॉश, साबण</td>
              <td>
                <input
                  type="checkbox"
                  id="basicFacilities.hasHandwashSoap"
                  className={highlightedField === "basicFacilities.hasHandwashSoap" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasHandwashSoap === 1}
                  onChange={() => handleBinaryChange("basicFacilities.hasHandwashSoap", formData.basicFacilities?.hasHandwashSoap === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("basicFacilities.hasHandwashSoap", "हात स्वच्छ करण्यासाठी हँडवॉश, साबण")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "basicFacilities.hasHandwashSoap" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasHandwashSoap === 0}
                  onChange={() => handleBinaryChange("basicFacilities.hasHandwashSoap", formData.basicFacilities?.hasHandwashSoap === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("basicFacilities.hasHandwashSoap", "हात स्वच्छ करण्यासाठी हँडवॉश, साबण")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td className="text-start">7</td>
              <td className="text-start">स्वतंत्र शौचालय</td>
              <td>
                <input
                  type="checkbox"
                  id="basicFacilities.hasSeparateToilets"
                  className={highlightedField === "basicFacilities.hasSeparateToilets" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasSeparateToilets === 1}
                  onChange={() => handleBinaryChange("basicFacilities.hasSeparateToilets", formData.basicFacilities?.hasSeparateToilets === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("basicFacilities.hasSeparateToilets", "स्वतंत्र शौचालय")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "basicFacilities.hasSeparateToilets" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasSeparateToilets === 0}
                  onChange={() => handleBinaryChange("basicFacilities.hasSeparateToilets", formData.basicFacilities?.hasSeparateToilets === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("basicFacilities.hasSeparateToilets", "स्वतंत्र शौचालय")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td className="text-start">8</td>
              <td className="text-start">CCTV उपलब्धता</td>
              <td>
                <input
                  type="checkbox"
                  id="basicFacilities.hasCctv"
                  className={highlightedField === "basicFacilities.hasCctv" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasCctv === 1}
                  onChange={() => handleBinaryChange("basicFacilities.hasCctv", formData.basicFacilities?.hasCctv === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("basicFacilities.hasCctv", "CCTV उपलब्धता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "basicFacilities.hasCctv" ? "unfilled-field" : ""}
                  checked={formData.basicFacilities?.hasCctv === 0}
                  onChange={() => handleBinaryChange("basicFacilities.hasCctv", formData.basicFacilities?.hasCctv === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("basicFacilities.hasCctv", "CCTV उपलब्धता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card p-4 shadow-lg w-80 mx-auto mt-4">
        <div className="card-header bg-primary text-white">
          <h3>शाळा गुणवत्ता, स्वच्छता व इत्यादी :- निकृष्ट, बऱ्यापैकी, अतिउत्तम</h3>
        </div>
        <table className="table table-bordered mt-3">
          <thead className="table-secondary">
            <tr>
              <th className="text-start">अ.क्र.</th>
              <th className="text-start">तपशील</th>
              <th className="text-start">निकृष्ट</th>
              <th className="text-start">बऱ्यापैकी</th>
              <th className="text-start">अतिउत्तम</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>स्वयंपाकगृहाची स्वच्छता</td>
              <td>
                <input
                  type="checkbox"
                  id="quality.kitchenCleanliness"
                  className={highlightedField === "quality.kitchenCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.kitchenCleanliness === "1"}
                  onChange={() => handleQualityChange("quality.kitchenCleanliness", "निकृष्ट")}
                  onFocus={() => handleFocus("quality.kitchenCleanliness", "स्वयंपाकगृहाची स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.kitchenCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.kitchenCleanliness === "2"}
                  onChange={() => handleQualityChange("quality.kitchenCleanliness", "बऱ्यापैकी")}
                  onFocus={() => handleFocus("quality.kitchenCleanliness", "स्वयंपाकगृहाची स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.kitchenCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.kitchenCleanliness === "3"}
                  onChange={() => handleQualityChange("quality.kitchenCleanliness", "अतिउत्तम")}
                  onFocus={() => handleFocus("quality.kitchenCleanliness", "स्वयंपाकगृहाची स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>भोजन हॉल स्वच्छता</td>
              <td>
                <input
                  type="checkbox"
                  id="quality.diningHallCleanliness"
                  className={highlightedField === "quality.diningHallCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.diningHallCleanliness === "1"}
                  onChange={() => handleQualityChange("quality.diningHallCleanliness", "निकृष्ट")}
                  onFocus={() => handleFocus("quality.diningHallCleanliness", "भोजन हॉल स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.diningHallCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.diningHallCleanliness === "2"}
                  onChange={() => handleQualityChange("quality.diningHallCleanliness", "बऱ्यापैकी")}
                  onFocus={() => handleFocus("quality.diningHallCleanliness", "भोजन हॉल स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.diningHallCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.diningHallCleanliness === "3"}
                  onChange={() => handleQualityChange("quality.diningHallCleanliness", "अतिउत्तम")}
                  onFocus={() => handleFocus("quality.diningHallCleanliness", "भोजन हॉल स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>धान्यादी साठा खोलीची स्वच्छता</td>
              <td>
                <input
                  type="checkbox"
                  id="quality.storageCleanliness"
                  className={highlightedField === "quality.storageCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.storageCleanliness === "1"}
                  onChange={() => handleQualityChange("quality.storageCleanliness", "निकृष्ट")}
                  onFocus={() => handleFocus("quality.storageCleanliness", "धान्यादी साठा खोलीची स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.storageCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.storageCleanliness === "2"}
                  onChange={() => handleQualityChange("quality.storageCleanliness", "बऱ्यापैकी")}
                  onFocus={() => handleFocus("quality.storageCleanliness", "धान्यादी साठा खोलीची स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.storageCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.storageCleanliness === "3"}
                  onChange={() => handleQualityChange("quality.storageCleanliness", "अतिउत्तम")}
                  onFocus={() => handleFocus("quality.storageCleanliness", "धान्यादी साठा खोलीची स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>शिजवलेला आहार वितरित करण्याची जागा</td>
              <td>
                <input
                  type="checkbox"
                  id="quality.servingAreaCleanliness"
                  className={highlightedField === "quality.servingAreaCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.servingAreaCleanliness === "1"}
                  onChange={() => handleQualityChange("quality.servingAreaCleanliness", "निकृष्ट")}
                  onFocus={() => handleFocus("quality.servingAreaCleanliness", "शिजवलेला आहार वितरित करण्याची जागा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.servingAreaCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.servingAreaCleanliness === "2"}
                  onChange={() => handleQualityChange("quality.servingAreaCleanliness", "बऱ्यापैकी")}
                  onFocus={() => handleFocus("quality.servingAreaCleanliness", "शिजवलेला आहार वितरित करण्याची जागा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.servingAreaCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.servingAreaCleanliness === "3"}
                  onChange={() => handleQualityChange("quality.servingAreaCleanliness", "अतिउत्तम")}
                  onFocus={() => handleFocus("quality.servingAreaCleanliness", "शिजवलेला आहार वितरित करण्याची जागा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>भांड्यांची स्थिती आणि स्वच्छता</td>
              <td>
                <input
                  type="checkbox"
                  id="quality.utensilCondition"
                  className={highlightedField === "quality.utensilCondition" ? "unfilled-field" : ""}
                  checked={formData.quality?.utensilCondition === "1"}
                  onChange={() => handleQualityChange("quality.utensilCondition", "निकृष्ट")}
                  onFocus={() => handleFocus("quality.utensilCondition", "भांड्यांची स्थिती आणि स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.utensilCondition" ? "unfilled-field" : ""}
                  checked={formData.quality?.utensilCondition === "2"}
                  onChange={() => handleQualityChange("quality.utensilCondition", "बऱ्यापैकी")}
                  onFocus={() => handleFocus("quality.utensilCondition", "भांड्यांची स्थिती आणि स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  id="quality.utensilCondition"
                  className={highlightedField === "quality.utensilCondition" ? "unfilled-field" : ""}
                  checked={formData.quality?.utensilCondition === "3"}
                  onChange={() => handleQualityChange("quality.utensilCondition", "अतिउत्तम")}
                  onFocus={() => handleFocus("quality.utensilCondition", "भांड्यांची स्थिती आणि स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>6</td>
              <td>पिण्याच्या शुद्ध पाण्याचा नियमित पुरवठा</td>
              <td>
                <input
                  type="checkbox"
                  id="quality.waterSupply"
                  className={highlightedField === "quality.waterSupply" ? "unfilled-field" : ""}
                  checked={formData.quality?.waterSupply === "1"}
                  onChange={() => handleQualityChange("quality.waterSupply", "निकृष्ट")}
                  onFocus={() => handleFocus("quality.waterSupply", "पिण्याच्या शुद्ध पाण्याचा नियमित पुरवठा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.waterSupply" ? "unfilled-field" : ""}
                  checked={formData.quality?.waterSupply === "2"}
                  onChange={() => handleQualityChange("quality.waterSupply", "बऱ्यापैकी")}
                  onFocus={() => handleFocus("quality.waterSupply", "पिण्याच्या शुद्ध पाण्याचा नियमित पुरवठा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.waterSupply" ? "unfilled-field" : ""}
                  checked={formData.quality?.waterSupply === "3"}
                  onChange={() => handleQualityChange("quality.waterSupply", "अतिउत्तम")}
                  onFocus={() => handleFocus("quality.waterSupply", "पिण्याच्या शुद्ध पाण्याचा नियमित पुरवठा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>7</td>
              <td>विद्यार्थ्यांसाठी हात धुण्याची सुविधा</td>
              <td>
                <input
                  type="checkbox"
                  id="quality.handwashFacility"
                  className={highlightedField === "quality.handwashFacility" ? "unfilled-field" : ""}
                  checked={formData.quality?.handwashFacility === "1"}
                  onChange={() => handleQualityChange("quality.handwashFacility", "निकृष्ट")}
                  onFocus={() => handleFocus("quality.handwashFacility", "विद्यार्थ्यांसाठी हात धुण्याची सुविधा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.handwashFacility" ? "unfilled-field" : ""}
                  checked={formData.quality?.handwashFacility === "2"}
                  onChange={() => handleQualityChange("quality.handwashFacility", "बऱ्यापैकी")}
                  onFocus={() => handleFocus("quality.handwashFacility", "विद्यार्थ्यांसाठी हात धुण्याची सुविधा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.handwashFacility" ? "unfilled-field" : ""}
                  checked={formData.quality?.handwashFacility === "3"}
                  onChange={() => handleQualityChange("quality.handwashFacility", "अतिउत्तम")}
                  onFocus={() => handleFocus("quality.handwashFacility", "विद्यार्थ्यांसाठी हात धुण्याची सुविधा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>8</td>
              <td>स्वतंत्र शौचालय स्वच्छता</td>
              <td>
                <input
                  type="checkbox"
                  id="quality.toiletCleanliness"
                  className={highlightedField === "quality.toiletCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.toiletCleanliness === "1"}
                  onChange={() => handleQualityChange("quality.toiletCleanliness", "निकृष्ट")}
                  onFocus={() => handleFocus("quality.toiletCleanliness", "स्वतंत्र शौचालय स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.toiletCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.toiletCleanliness === "2"}
                  onChange={() => handleQualityChange("quality.toiletCleanliness", "बऱ्यापैकी")}
                  onFocus={() => handleFocus("quality.toiletCleanliness", "स्वतंत्र शौचालय स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "quality.toiletCleanliness" ? "unfilled-field" : ""}
                  checked={formData.quality?.toiletCleanliness === "3"}
                  onChange={() => handleQualityChange("quality.toiletCleanliness", "अतिउत्तम")}
                  onFocus={() => handleFocus("quality.toiletCleanliness", "स्वतंत्र शौचालय स्वच्छता")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card p-4 shadow-lg w-80 mx-auto mt-4">
        <div className="card-header bg-primary text-white">
          <h3>पुस्तके नोंदवहया रजिस्टर वापर आणि दुरुस्ती</h3>
        </div>
        <table className="table table-bordered mt-3">
          <thead className="table-secondary">
            <tr>
              <th className="text-start">अ.क्र.</th>
              <th className="text-start">तपशील</th>
              <th className="text-start">होय</th>
              <th className="text-start">नाही</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>कॅशबुक अद्ययावत</td>
              <td>
                <input
                  type="checkbox"
                  id="repairing.cashBookUpdated"
                  className={highlightedField === "repairing.cashBookUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.cashBookUpdated === 1}
                  onChange={() => handleBinaryChange("repairing.cashBookUpdated", formData.repairing?.cashBookUpdated === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("repairing.cashBookUpdated", "कॅशबुक अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "repairing.cashBookUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.cashBookUpdated === 0}
                  onChange={() => handleBinaryChange("repairing.cashBookUpdated", formData.repairing?.cashBookUpdated === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("repairing.cashBookUpdated", "कॅशबुक अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>साठा नोंदवही अद्ययावत</td>
              <td>
                <input
                  type="checkbox"
                  id="repairing.stockRegisterUpdated"
                  className={highlightedField === "repairing.stockRegisterUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.stockRegisterUpdated === 1}
                  onChange={() => handleBinaryChange("repairing.stockRegisterUpdated", formData.repairing?.stockRegisterUpdated === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("repairing.stockRegisterUpdated", "साठा नोंदवही अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "repairing.stockRegisterUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.stockRegisterUpdated === 0}
                  onChange={() => handleBinaryChange("repairing.stockRegisterUpdated", formData.repairing?.stockRegisterUpdated === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("repairing.stockRegisterUpdated", "साठा नोंदवही अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>उपस्थिती रजिस्टर अद्ययावत</td>
              <td>
                <input
                  type="checkbox"
                  id="repairing.attendanceRegisterUpdated"
                  className={highlightedField === "repairing.attendanceRegisterUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.attendanceRegisterUpdated === 1}
                  onChange={() => handleBinaryChange("repairing.attendanceRegisterUpdated", formData.repairing?.attendanceRegisterUpdated === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("repairing.attendanceRegisterUpdated", "उपस्थिती रजिस्टर अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "repairing.attendanceRegisterUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.attendanceRegisterUpdated === 0}
                  onChange={() => handleBinaryChange("repairing.attendanceRegisterUpdated", formData.repairing?.attendanceRegisterUpdated === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("repairing.attendanceRegisterUpdated", "उपस्थिती रजिस्टर अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>बँक खाते अद्ययावत</td>
              <td>
                <input
                  type="checkbox"
                  id="repairing.bankAccountUpdated"
                  className={highlightedField === "repairing.bankAccountUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.bankAccountUpdated === 1}
                  onChange={() => handleBinaryChange("repairing.bankAccountUpdated", formData.repairing?.bankAccountUpdated === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("repairing.bankAccountUpdated", "बँक खाते अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "repairing.bankAccountUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.bankAccountUpdated === 0}
                  onChange={() => handleBinaryChange("repairing.bankAccountUpdated", formData.repairing?.bankAccountUpdated === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("repairing.bankAccountUpdated", "बँक खाते अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>मानधन नोंदवही अद्ययावत</td>
              <td>
                <input
                  type="checkbox"
                  id="repairing.honorariumRegisterUpdated"
                  className={highlightedField === "repairing.honorariumRegisterUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.honorariumRegisterUpdated === 1}
                  onChange={() => handleBinaryChange("repairing.honorariumRegisterUpdated", formData.repairing?.honorariumRegisterUpdated === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("repairing.honorariumRegisterUpdated", "मानधन नोंदवही अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "repairing.honorariumRegisterUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.honorariumRegisterUpdated === 0}
                  onChange={() => handleBinaryChange("repairing.honorariumRegisterUpdated", formData.repairing?.honorariumRegisterUpdated === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("repairing.honorariumRegisterUpdated", "मानधन नोंदवही अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>6</td>
              <td>चव नोंदवही अद्ययावत</td>
              <td>
                <input
                  type="checkbox"
                  id="repairing.tasteRegisterUpdated"
                  className={highlightedField === "repairing.tasteRegisterUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.tasteRegisterUpdated === 1}
                  onChange={() => handleBinaryChange("repairing.tasteRegisterUpdated", formData.repairing?.tasteRegisterUpdated === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("repairing.tasteRegisterUpdated", "चव नोंदवही अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "repairing.tasteRegisterUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.tasteRegisterUpdated === 0}
                  onChange={() => handleBinaryChange("repairing.tasteRegisterUpdated", formData.repairing?.tasteRegisterUpdated === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("repairing.tasteRegisterUpdated", "चव नोंदवही अद्ययावत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>7</td>
              <td>स्नेह भोजन/तिथी भोजन नोंदवही</td>
              <td>
                <input
                  type="checkbox"
                  id="repairing.snehTithiRegisterUpdated"
                  className={highlightedField === "repairing.snehTithiRegisterUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.snehTithiRegisterUpdated === 1}
                  onChange={() => handleBinaryChange("repairing.snehTithiRegisterUpdated", formData.repairing?.snehTithiRegisterUpdated === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("repairing.snehTithiRegisterUpdated", "स्नेह भोजन/तिथी भोजन नोंदवही")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "repairing.snehTithiRegisterUpdated" ? "unfilled-field" : ""}
                  checked={formData.repairing?.snehTithiRegisterUpdated === 0}
                  onChange={() => handleBinaryChange("repairing.snehTithiRegisterUpdated", formData.repairing?.snehTithiRegisterUpdated === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("repairing.snehTithiRegisterUpdated", "स्नेह भोजन/तिथी भोजन नोंदवही")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card p-4 shadow-lg w-80 mx-auto mt-4">
        <div className="card-header bg-primary text-white">
          <h3>योजनांची फलनिष्पत्ती (होय/नाही)</h3>
        </div>
        <table className="table table-bordered mt-3">
          <thead className="table-secondary">
            <tr>
              <th className="text-start">अ.क्र.</th>
              <th className="text-start">तपशील</th>
              <th className="text-center">होय</th>
              <th className="text-center">नाही</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>पटनोंदणी मध्ये सुधारणा</td>
              <td>
                <input
                  type="checkbox"
                  id="profitFromScheme.enrollmentImprovement"
                  className={highlightedField === "profitFromScheme.enrollmentImprovement" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.enrollmentImprovement === 1}
                  onChange={() => handleBinaryChange("profitFromScheme.enrollmentImprovement", formData.profitFromScheme?.enrollmentImprovement === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("profitFromScheme.enrollmentImprovement", "पटनोंदणी मध्ये सुधारणा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "profitFromScheme.enrollmentImprovement" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.enrollmentImprovement === 0}
                  onChange={() => handleBinaryChange("profitFromScheme.enrollmentImprovement", formData.profitFromScheme?.enrollmentImprovement === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("profitFromScheme.enrollmentImprovement", "पटनोंदणी मध्ये सुधारणा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>दैनंदिन उपस्थितीमध्ये वाढ</td>
              <td>
                <input
                  type="checkbox"
                  id="profitFromScheme.attendanceIncrease"
                  className={highlightedField === "profitFromScheme.attendanceIncrease" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.attendanceIncrease === 1}
                  onChange={() => handleBinaryChange("profitFromScheme.attendanceIncrease", formData.profitFromScheme?.attendanceIncrease === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("profitFromScheme.attendanceIncrease", "दैनंदिन उपस्थितीमध्ये वाढ")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "profitFromScheme.attendanceIncrease" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.attendanceIncrease === 0}
                  onChange={() => handleBinaryChange("profitFromScheme.attendanceIncrease", formData.profitFromScheme?.attendanceIncrease === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("profitFromScheme.attendanceIncrease", "दैनंदिन उपस्थितीमध्ये वाढ")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>पोषण आणि आरोग्य सुधारणा</td>
              <td>
                <input
                  type="checkbox"
                  id="profitFromScheme.nutritionHealthImprovement"
                  className={highlightedField === "profitFromScheme.nutritionHealthImprovement" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.nutritionHealthImprovement === 1}
                  onChange={() => handleBinaryChange("profitFromScheme.nutritionHealthImprovement", formData.profitFromScheme?.nutritionHealthImprovement === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("profitFromScheme.nutritionHealthImprovement", "पोषण आणि आरोग्य सुधारणा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "profitFromScheme.nutritionHealthImprovement" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.nutritionHealthImprovement === 0}
                  onChange={() => handleBinaryChange("profitFromScheme.nutritionHealthImprovement", formData.profitFromScheme?.nutritionHealthImprovement === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("profitFromScheme.nutritionHealthImprovement", "पोषण आणि आरोग्य सुधारणा")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>4</td>
              <td>वजन उंची यामध्ये वाढ</td>
              <td>
                <input
                  type="checkbox"
                  id="profitFromScheme.weightHeightIncrease"
                  className={highlightedField === "profitFromScheme.weightHeightIncrease" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.weightHeightIncrease === 1}
                  onChange={() => handleBinaryChange("profitFromScheme.weightHeightIncrease", formData.profitFromScheme?.weightHeightIncrease === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("profitFromScheme.weightHeightIncrease", "वजन उंची यामध्ये वाढ")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "profitFromScheme.weightHeightIncrease" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.weightHeightIncrease === 0}
                  onChange={() => handleBinaryChange("profitFromScheme.weightHeightIncrease", formData.profitFromScheme?.weightHeightIncrease === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("profitFromScheme.weightHeightIncrease", "वजन उंची यामध्ये वाढ")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>5</td>
              <td>कुपोषण मुक्त होण्यासाठी मदत</td>
              <td>
                <input
                  type="checkbox"
                  id="profitFromScheme.malnutritionReduction"
                  className={highlightedField === "profitFromScheme.malnutritionReduction" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.malnutritionReduction === 1}
                  onChange={() => handleBinaryChange("profitFromScheme.malnutritionReduction", formData.profitFromScheme?.malnutritionReduction === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("profitFromScheme.malnutritionReduction", "कुपोषण मुक्त होण्यासाठी मदत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "profitFromScheme.malnutritionReduction" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.malnutritionReduction === 0}
                  onChange={() => handleBinaryChange("profitFromScheme.malnutritionReduction", formData.profitFromScheme?.malnutritionReduction === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("profitFromScheme.malnutritionReduction", "कुपोषण मुक्त होण्यासाठी मदत")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>6</td>
              <td>जंक फूड प्रतिबंध</td>
              <td>
                <input
                  type="checkbox"
                  id="profitFromScheme.junkFoodPrevention"
                  className={highlightedField === "profitFromScheme.junkFoodPrevention" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.junkFoodPrevention === 1}
                  onChange={() => handleBinaryChange("profitFromScheme.junkFoodPrevention", formData.profitFromScheme?.junkFoodPrevention === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("profitFromScheme.junkFoodPrevention", "जंक फूड प्रतिबंध")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "profitFromScheme.junkFoodPrevention" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.junkFoodPrevention === 0}
                  onChange={() => handleBinaryChange("profitFromScheme.junkFoodPrevention", formData.profitFromScheme?.junkFoodPrevention === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("profitFromScheme.junkFoodPrevention", "जंक फूड प्रतिबंध")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
            <tr>
              <td>7</td>
              <td>एकता आणि बंधुभाव जोपासना</td>
              <td>
                <input
                  type="checkbox"
                  id="profitFromScheme.unityBonding"
                  className={highlightedField === "profitFromScheme.unityBonding" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.unityBonding === 1}
                  onChange={() => handleBinaryChange("profitFromScheme.unityBonding", formData.profitFromScheme?.unityBonding === 1 ? "नाही" : "होय")}
                  onFocus={() => handleFocus("profitFromScheme.unityBonding", "एकता आणि बंधुभाव जोपासना")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  className={highlightedField === "profitFromScheme.unityBonding" ? "unfilled-field" : ""}
                  checked={formData.profitFromScheme?.unityBonding === 0}
                  onChange={() => handleBinaryChange("profitFromScheme.unityBonding", formData.profitFromScheme?.unityBonding === 0 ? "होय" : "नाही")}
                  onFocus={() => handleFocus("profitFromScheme.unityBonding", "एकता आणि बंधुभाव जोपासना")}
                  onBlur={handleBlur}
                  disabled={loading} // CHANGED: Disable input during loading
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {focusMessage && <p className="focus-message">{focusMessage}</p>}
      {message && (
        <Alert variant={message.includes("त्रुटी") ? "danger" : "success"} className="mt-3">
          {message}
        </Alert>
      )} {/* CHANGED: Added Alert for success/error messages */}

      <div className="text-center mt-4">
        <Button
          variant="primary"
          size="lg"
          className="me-2"
          onClick={prevStep}
          disabled={loading} // CHANGED: Disable back button during loading
        >
          मागे जा
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleFormSubmit}
          disabled={loading} // CHANGED: Disable submit button during loading
        >
          {loading ? <Spinner animation="border" size="sm" /> : "सबमिट करा"} {/* CHANGED: Show spinner during loading */}
        </Button>
        <Button
                              type="button"
                              variant="secondary"
                              onClick={() => navigate("/officer_dashboard")}
                              disabled={loading}
                            >
                              रद्द करा
                            </Button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} /> {/* CHANGED: Added ToastContainer for notifications */}
    </div>
  );
};

export default SchoolFormPage4;