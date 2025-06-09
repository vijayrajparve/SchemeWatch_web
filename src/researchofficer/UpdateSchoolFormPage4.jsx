import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "react-bootstrap";

const UpdateSchoolFormPage4 = ({
  formData,
  setFormData,
  prevStep,
  handleSubmit,
  loading,
}) => {
  const navigate = useNavigate();
  const [fieldMessages, setFieldMessages] = useState({});
  const [highlightedField, setHighlightedField] = useState(null);
  const [message, setMessage] = useState("");
  const fieldRefs = useRef({});

  // Initialize formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      basicFacilities: {
        hasKitchen: prev.basicFacilities?.hasKitchen ?? null,
        hasStorageRoom: prev.basicFacilities?.hasStorageRoom ?? null,
        hasDiningHall: prev.basicFacilities?.hasDiningHall ?? null,
        hasUtensils: prev.basicFacilities?.hasUtensils ?? null,
        hasGrainSafety: prev.basicFacilities?.hasGrainSafety ?? null,
        hasHandwashSoap: prev.basicFacilities?.hasHandwashSoap ?? null,
        hasSeparateToilets: prev.basicFacilities?.hasSeparateToilets ?? null,
        hasCctv: prev.basicFacilities?.hasCctv ?? null,
      },
      quality: {
        kitchenCleanliness: prev.quality?.kitchenCleanliness ?? null,
        diningHallCleanliness: prev.quality?.diningHallCleanliness ?? null,
        storageCleanliness: prev.quality?.storageCleanliness ?? null,
        servingAreaCleanliness: prev.quality?.servingAreaCleanliness ?? null,
        utensilCondition: prev.quality?.utensilCondition ?? null,
        waterSupply: prev.quality?.waterSupply ?? null,
        handwashFacility: prev.quality?.handwashFacility ?? null,
        toiletCleanliness: prev.quality?.toiletCleanliness ?? null,
      },
      repairing: {
        cashBookUpdated: prev.repairing?.cashBookUpdated ?? null,
        stockRegisterUpdated: prev.repairing?.stockRegisterUpdated ?? null,
        attendanceRegisterUpdated: prev.repairing?.attendanceRegisterUpdated ?? null,
        bankAccountUpdated: prev.repairing?.bankAccountUpdated ?? null,
        honorariumRegisterUpdated: prev.repairing?.honorariumRegisterUpdated ?? null,
        tasteRegisterUpdated: prev.repairing?.tasteRegisterUpdated ?? null,
        snehTithiRegisterUpdated: prev.repairing?.snehTithiRegisterUpdated ?? null,
      },
      profitFromScheme: {
        enrollmentImprovement: prev.profitFromScheme?.enrollmentImprovement ?? null,
        attendanceIncrease: prev.profitFromScheme?.attendanceIncrease ?? null,
        nutritionHealthImprovement: prev.profitFromScheme?.nutritionHealthImprovement ?? null,
        weightHeightIncrease: prev.profitFromScheme?.weightHeightIncrease ?? null,
        malnutritionReduction: prev.profitFromScheme?.malnutritionReduction ?? null,
        junkFoodPrevention: prev.profitFromScheme?.junkFoodPrevention ?? null,
        unityBonding: prev.profitFromScheme?.unityBonding ?? null,
      },
    }));
  }, [setFormData]);

  // Define required fields
  const requiredFields = [
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

  // Validate form
  const validateForm = () => {
    const missingFields = [];
    requiredFields.forEach(({ key }) => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], formData);
      if (value === null) {
        missingFields.push({ key, label: requiredFields.find(f => f.key === key).label });
      }
    });
    return missingFields;
  };

  // Find first empty field
  const findFirstEmptyField = () => {
    for (const { key } of requiredFields) {
      const value = key.split('.').reduce((obj, k) => obj?.[k], formData);
      if (value === null) {
        return key;
      }
    }
    return null;
  };

  // Update nested objects
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

  // Handlers
  const handleBinaryChange = (field, value) => {
    const newValue = value === "होय" ? 1 : value === "नाही" ? 0 : null;
    setFormData((prev) => updateNestedObject(prev, field, newValue));
    setFieldMessages((prev) => ({ ...prev, [field]: "" }));
    setTimeout(() => {
      setHighlightedField(findFirstEmptyField());
    }, 0);
  };

  const handleQualityChange = (field, value) => {
    const qualityMap = { "निकृष्ट": 1, "बऱ्यापैकी": 2, "अतिउत्तम": 3 };
    const newValue = qualityMap[value];
    setFormData((prev) => updateNestedObject(prev, `quality.${field}`, newValue));
    setFieldMessages((prev) => ({ ...prev, [`quality.${field}`]: "" }));
    setTimeout(() => {
      setHighlightedField(findFirstEmptyField());
    }, 0);
  };

  const handleFocus = (field) => {
    const value = field.split('.').reduce((obj, k) => obj?.[k], formData);
    if (value === null) {
      setFieldMessages((prev) => ({
        ...prev,
        [field]: "कृपया हे फील्ड भरा",
      }));
    }
  };

  const handleBlur = (field) => {
    setFieldMessages((prev) => ({ ...prev, [field]: "" }));
  };

  // Form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      const firstEmptyField = missingFields[0].key;
      setHighlightedField(firstEmptyField);
      if (fieldRefs.current[firstEmptyField]) {
        fieldRefs.current[firstEmptyField].scrollIntoView({ behavior: "smooth", block: "center" });
        setFieldMessages((prev) => ({
          ...prev,
          [firstEmptyField]: "कृपया हे फील्ड भरा",
        }));
      }
      return;
    }
    try {
      await handleSubmit(formData);
      setMessage("फॉर्म यशस्वीरित्या अपडेट झाला!");
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
      setTimeout(() => {
        navigate("/officer_dashboard");
      }, 3000);
    } catch (error) {
      console.error("Error during form submission:", error);
      setMessage("फॉर्म अपडेट करताना त्रुटी: " + error.message);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
    }
  };

  // Cancel handler
  const handleCancel = () => {
    navigate("/officer_dashboard");
  };

  return (
    <>
      <style>
        {`
          .empty-field {
            border: 2px solid #007bff !important;
          }
          .field-message {
            color: #007bff;
            font-size: 0.85rem;
            margin-top: 2px;
          }
        `}
      </style>
      <div className="container mt-4">
        {message && (
          <Alert
            variant={message.includes("यशस्वी") ? "success" : "danger"}
            className="mt-3 text-center"
          >
            {message}
          </Alert>
        )}

        {/* Basic Facilities */}
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
              {[
                { id: "1", key: "basicFacilities.hasKitchen", label: "स्वयंपाकगृह" },
                { id: "2", key: "basicFacilities.hasStorageRoom", label: "धान्यासाठी खोली" },
                { id: "3", key: "basicFacilities.hasDiningHall", label: "भोजन हॉल" },
                { id: "4", key: "basicFacilities.hasUtensils", label: "भांड्याची उपलब्धता" },
                { id: "5", key: "basicFacilities.hasGrainSafety", label: "धान्याची मालाची सुरक्षितता" },
                { id: "6", key: "basicFacilities.hasHandwashSoap", label: "हात स्वच्छ करण्यासाठी हँडवॉश, साबण" },
                { id: "7", key: "basicFacilities.hasSeparateToilets", label: "स्वतंत्र शौचालय" },
                { id: "8", key: "basicFacilities.hasCctv", label: "CCTV उपलब्धता" },
              ].map(({ id, key, label }) => (
                <tr key={id}>
                  <td className="text-start">{id}</td>
                  <td className="text-start">{label}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={key.split('.').reduce((obj, k) => obj?.[k], formData) === 1}
                      onChange={() => handleBinaryChange(key, "होय")}
                      onFocus={() => handleFocus(key)}
                      onBlur={() => handleBlur(key)}
                      ref={(el) => (fieldRefs.current[key] = el)}
                      className={highlightedField === key ? "empty-field" : ""}
                    />
                    {fieldMessages[key] && (
                      <div className="field-message">{fieldMessages[key]}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={key.split('.').reduce((obj, k) => obj?.[k], formData) === 0}
                      onChange={() => handleBinaryChange(key, "नाही")}
                      onFocus={() => handleFocus(key)}
                      onBlur={() => handleBlur(key)}
                      className={highlightedField === key ? "empty-field" : ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quality Section */}
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
              {[
                { id: "1", key: "kitchenCleanliness", label: "स्वयंपाकगृहाची स्वच्छता" },
                { id: "2", key: "diningHallCleanliness", label: "भोजन हॉल स्वच्छता" },
                { id: "3", key: "storageCleanliness", label: "धान्यादी साठा खोलीची स्वच्छता" },
                { id: "4", key: "servingAreaCleanliness", label: "शिजवलेला आहार वितरित करण्याची जागा" },
                { id: "5", key: "utensilCondition", label: "भांड्यांची स्थिती आणि स्वच्छता" },
                { id: "6", key: "waterSupply", label: "पिण्याच्या शुद्ध पाण्याचा नियमित पुरवठा" },
                { id: "7", key: "handwashFacility", label: "विद्यार्थ्यांसाठी हात धुण्याची सुविधा" },
                { id: "8", key: "toiletCleanliness", label: "स्वतंत्र शौचालय स्वच्छता" },
              ].map(({ id, key, label }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{label}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={formData.quality?.[key] === 1}
                      onChange={() => handleQualityChange(key, "निकृष्ट")}
                      onFocus={() => handleFocus(`quality.${key}`)}
                      onBlur={() => handleBlur(`quality.${key}`)}
                      ref={(el) => (fieldRefs.current[`quality.${key}`] = el)}
                      className={highlightedField === `quality.${key}` ? "empty-field" : ""}
                    />
                    {fieldMessages[`quality.${key}`] && (
                      <div className="field-message">{fieldMessages[`quality.${key}`]}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={formData.quality?.[key] === 2}
                      onChange={() => handleQualityChange(key, "बऱ्यापैकी")}
                      onFocus={() => handleFocus(`quality.${key}`)}
                      onBlur={() => handleBlur(`quality.${key}`)}
                      className={highlightedField === `quality.${key}` ? "empty-field" : ""}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={formData.quality?.[key] === 3}
                      onChange={() => handleQualityChange(key, "अतिउत्तम")}
                      onFocus={() => handleFocus(`quality.${key}`)}
                      onBlur={() => handleBlur(`quality.${key}`)}
                      className={highlightedField === `quality.${key}` ? "empty-field" : ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Repairing Section */}
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
              {[
                { id: "1", key: "repairing.cashBookUpdated", label: "कॅशबुक अद्ययावत" },
                { id: "2", key: "repairing.stockRegisterUpdated", label: "साठा नोंदवही अद्ययावत" },
                { id: "3", key: "repairing.attendanceRegisterUpdated", label: "उपस्थिती रजिस्टर अद्ययावत" },
                { id: "4", key: "repairing.bankAccountUpdated", label: "बँक खाते अद्ययावत" },
                { id: "5", key: "repairing.honorariumRegisterUpdated", label: "मानधन नोंदवही अद्ययावत" },
                { id: "6", key: "repairing.tasteRegisterUpdated", label: "चव नोंदवही अद्ययावत" },
                { id: "7", key: "repairing.snehTithiRegisterUpdated", label: "स्नेह भोजन/तिथी भोजन नोंदवही" },
              ].map(({ id, key, label }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{label}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={key.split('.').reduce((obj, k) => obj?.[k], formData) === 1}
                      onChange={() => handleBinaryChange(key, "होय")}
                      onFocus={() => handleFocus(key)}
                      onBlur={() => handleBlur(key)}
                      ref={(el) => (fieldRefs.current[key] = el)}
                      className={highlightedField === key ? "empty-field" : ""}
                    />
                    {fieldMessages[key] && (
                      <div className="field-message">{fieldMessages[key]}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={key.split('.').reduce((obj, k) => obj?.[k], formData) === 0}
                      onChange={() => handleBinaryChange(key, "नाही")}
                      onFocus={() => handleFocus(key)}
                      onBlur={() => handleBlur(key)}
                      className={highlightedField === key ? "empty-field" : ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Profit From Scheme */}
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
              {[
                { id: "1", key: "profitFromScheme.enrollmentImprovement", label: "पटनोंदणी मध्ये सुधारणा" },
                { id: "2", key: "profitFromScheme.attendanceIncrease", label: "दैनंदिन उपस्थितीमध्ये वाढ" },
                { id: "3", key: "profitFromScheme.nutritionHealthImprovement", label: "पोषण आणि आरोग्य सुधारणा" },
                { id: "4", key: "profitFromScheme.weightHeightIncrease", label: "वजन उंची यामध्ये वाढ" },
                { id: "5", key: "profitFromScheme.malnutritionReduction", label: "कुपोषण मुक्त होण्यासाठी मदत" },
                { id: "6", key: "profitFromScheme.junkFoodPrevention", label: "जंक फूड प्रतिबंध" },
                { id: "7", key: "profitFromScheme.unityBonding", label: "एकता आणि बंधुभाव जोपासना" },
              ].map(({ id, key, label }) => (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{label}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={key.split('.').reduce((obj, k) => obj?.[k], formData) === 1}
                      onChange={() => handleBinaryChange(key, "होय")}
                      onFocus={() => handleFocus(key)}
                      onBlur={() => handleBlur(key)}
                      ref={(el) => (fieldRefs.current[key] = el)}
                      className={highlightedField === key ? "empty-field" : ""}
                    />
                    {fieldMessages[key] && (
                      <div className="field-message">{fieldMessages[key]}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={key.split('.').reduce((obj, k) => obj?.[k], formData) === 0}
                      onChange={() => handleBinaryChange(key, "नाही")}
                      onFocus={() => handleFocus(key)}
                      onBlur={() => handleBlur(key)}
                      className={highlightedField === key ? "empty-field" : ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Navigation Buttons */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={prevStep}
            disabled={loading}
          >
            मागे जा
          </button>
          <Button
            type="button"
            variant="primary"
            className="me-2"
            onClick={handleFormSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              "अपडेट करा"
            )}            
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
      </div>
    </>
  );
};

export default UpdateSchoolFormPage4;