import React, { useState, useMemo, useRef, useEffect } from "react";

const UpdateSchoolFormPage2 = ({
  formData,
  setFormData,
  handleChange,
  handleBinaryChange,
  nextStep,
  prevStep,
}) => {
  const [fieldMessages, setFieldMessages] = useState({});
  const [highlightedField, setHighlightedField] = useState(null);
  const fieldRefs = useRef({});

  const requiredFields = [
    { key: "hasDietCommittee", label: "शालेय आहार व्यवस्थापन समिती स्थापन", type: "binary" },
    { key: "hasCommitteeBoard", label: "समिती सभासदांचा फलक", condition: formData.hasDietCommittee === 1, type: "binary" },
    { key: "cookingAgency", label: "अन्न शिजवणाऱ्या यंत्रणा", type: "text" },
    { key: "hasAgreementCopy", label: "करारनाम्याची प्रत", type: "binary" },
    { key: "hasCookTraining", label: "स्वयंपाकी/मदतनीस प्रशिक्षण", type: "binary" },
    { key: "cookHelperCount", label: "स्वयंपाकी मदतनीस संख्या", type: "number" },
    { key: "isCookedAtSchool", label: "आहार शाळेमध्ये शिजवला", type: "binary" },
    { key: "fuelType", label: "इंधनाचा वापर", condition: formData.isCookedAtSchool === 1, type: "select" },
    { key: "hasWeighingScale", label: "वजनकाटा उपलब्ध", type: "binary" },
    { key: "hasRiceWeighed", label: "तांदूळ वजन", condition: formData.hasWeighingScale === 1, type: "binary" },
    { key: "hasStorageUnits", label: "धान्य साठवण कोठ्या", type: "binary" },
    { key: "hasPlates", label: "ताटे/प्लेट्स", type: "binary" },
    { key: "teacherPresentDuringDistribution", label: "आहार वितरणावेळी शिक्षक उपस्थिती", type: "binary" },
    { key: "mdmPortalUpdated", label: "एमडीएम पोर्टल नोंद", type: "binary" },
    { key: "supplementaryDiet", label: "पूरक आहार", type: "binary" },
    { key: "supplementaryDietDetails", label: "पूरक आहार तपशील", condition: formData.supplementaryDiet === 1, type: "text" },
    { key: "sampleStored", label: "आहार नमुना जतन", type: "binary" },
    { key: "cleaningDone", label: "जेवणानंतर स्वच्छता", type: "binary" },
    { key: "headmasterFoodOpinion", label: "मुख्याध्यापकाचे अन्न मत", type: "text" },
    { key: "thirdPartySupport", label: "त्रयस्थ संस्था सहकार्य", type: "binary" },
    { key: "basicFacilitiesAvailable", label: "पायाभूत सुविधा", type: "binary" },
    { key: "basicFacilitiesDetails", label: "मूलभूत सुविधा तपशील", condition: formData.basicFacilitiesAvailable === 1, type: "text" },
    { key: "diningArrangement", label: "भोजन व्यवस्था", type: "text" },
    { key: "followsGovtRecipe", label: "शासनाच्या पाककृतीनुसार आहार", type: "binary" },
    { key: "eggsBananasRegular", label: "अंडी/केळी नियमित", type: "binary" },
    { key: "usesSproutedGrains", label: "मोड आलेल्या कडधान्याचा वापर", type: "binary" },
    { key: "labTestMonthly", label: "दरमहा प्रयोगशाळा तपासणी", type: "binary" },
    { key: "tasteTestBeforeDistribution", label: "आहार वितरणापूर्वी चव तपासणी", type: "binary" },
    { key: "smcParentVisits", label: "शालेय व्यवस्थापन समिती भेटी", type: "binary" },
    { key: "hasTasteRegister", label: "चव रजिस्टर", type: "binary" },
    { key: "dailyTasteEntries", label: "दैनंदिन चव नोंदी", condition: formData.hasTasteRegister === 1, type: "binary" },
    { key: "stockMatchesRegister", label: "नोंदवहीतील साठा", type: "binary" },
    { key: "stockDiscrepancyDetails", label: "साठा विसंगती तपशील", condition: formData.stockMatchesRegister === 0, type: "text" },
    { key: "recipesDisplayed", label: "दैनंदिन आहार पाककृती प्रदर्शन", type: "binary" },
    { key: "monitoringCommitteeMeetings", label: "समिती बैठका", type: "binary" },
    { key: "meetingCount2024_25", label: "सन २०२४-२५ मधील बैठकांची संख्या", condition: formData.monitoringCommitteeMeetings === 1, type: "number" },
    { key: "emptySacksReturned", label: "रिकाम्या गोण्या परत", type: "binary" },
    { key: "sackTransferRecorded", label: "हस्तांतरित गोण्यांची नोंद", condition: formData.emptySacksReturned === 1, type: "binary" },
    { key: "sackTransferCount", label: "हस्तांतरित गोण्यांची संख्या", condition: formData.emptySacksReturned === 1, type: "text" },
    { key: "currentFoodMaterials", label: "सध्याचे अन्न साहित्य", type: "text" },
    { key: "snehTithiProgram", label: "स्नेहभोजन/तिथीभोजन कार्यक्रम", type: "binary" },
    { key: "snehTithiProgramDetails", label: "स्नेह तिथी कार्यक्रम तपशील", condition: formData.snehTithiProgram === 1, type: "text" },
    { key: "corruptionDetails", label: "भ्रष्टाचार तपशील", type: "text" },
    { key: "corruptionActionDetails", label: "भ्रष्टाचार कारवाई तपशील", type: "text" },
    { key: "fieldOfficerVisits", label: "क्षेत्रीय अधिकाऱ्यांच्या भेटी", type: "binary" },
    { key: "fieldOfficerVisitDetails", label: "फील्ड अधिकारी भेट तपशील", condition: formData.fieldOfficerVisits === 1, type: "text" },
    { key: "schemeSuggestions", label: "योजनेच्या सूचना", type: "text" },
  ];

  const validateForm = useMemo(() => (formData) => {
    const missingFields = [];
    requiredFields.forEach(({ key, label, condition, type }) => {
      if (condition === undefined || condition) {
        if (
          (type === "binary" && formData[key] === null) ||
          (type === "text" && !formData[key]) ||
          (type === "number" && (formData[key] === "" || formData[key] === undefined || isNaN(Number(formData[key])) || Number(formData[key]) < 0)) ||
          (type === "select" && !formData[key])
        ) {
          missingFields.push({ key, label });
        }
      }
    });
    return missingFields;
  }, []);

  const findFirstEmptyField = useMemo(() => (formData) => {
    for (const field of requiredFields) {
      if (field.condition === undefined || field.condition) {
        if (
          (field.type === "binary" && formData[field.key] === null) ||
          (field.type === "text" && !formData[field.key]) ||
          (field.type === "number" && (formData[field.key] === "" || formData[field.key] === undefined || isNaN(Number(formData[field.key])))) ||
          (field.type === "select" && !formData[field.key])
        ) {
          return field.key;
        }
      }
    }
    return null;
  }, []);

  const handleLocalBinaryChange = (e) => {
    const { name, value } = e.target;
    const newValue = value === "" ? null : Number(value);
    setFormData((prev) => {
      let updates = { ...prev, [name]: newValue };
      if (name === "hasDietCommittee" && newValue !== 1) {
        updates.hasCommitteeBoard = null;
      }
      if (name === "isCookedAtSchool" && newValue !== 1) {
        updates.fuelType = "";
      }
      if (name === "hasWeighingScale" && newValue !== 1) {
        updates.hasRiceWeighed = null;
      }
      if (name === "hasTasteRegister" && newValue !== 1) {
        updates.dailyTasteEntries = null;
      }
      if (name === "monitoringCommitteeMeetings" && newValue !== 1) {
        updates.meetingCount2024_25 = "";
      }
      if (name === "emptySacksReturned" && newValue !== 1) {
        updates.sackTransferRecorded = null;
        updates.sackTransferCount = "";
      }
      if (name === "supplementaryDiet" && newValue !== 1) {
        updates.supplementaryDietDetails = "";
      }
      if (name === "basicFacilitiesAvailable" && newValue !== 1) {
        updates.basicFacilitiesDetails = "";
      }
      if (name === "stockMatchesRegister" && newValue !== 0) {
        updates.stockDiscrepancyDetails = "";
      }
      if (name === "snehTithiProgram" && newValue !== 1) {
        updates.snehTithiProgramDetails = "";
      }
      if (name === "fieldOfficerVisits" && newValue !== 1) {
        updates.fieldOfficerVisitDetails = "";
      }
      return updates;
    });
    setFieldMessages((prev) => ({ ...prev, [name]: "" }));
    setTimeout(() => {
      const updatedFormData = { ...formData, [name]: newValue };
      setHighlightedField(findFirstEmptyField(updatedFormData));
    }, 0);
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setFieldMessages((prev) => ({ ...prev, [name]: "" }));
      setTimeout(() => {
        const updatedFormData = { ...formData, [name]: value };
        setHighlightedField(findFirstEmptyField(updatedFormData));
      }, 0);
    }
  };

  const handleTextChange = (e) => {
    handleChange(e);
    setFieldMessages((prev) => ({ ...prev, [e.target.name]: "" }));
    setTimeout(() => {
      const updatedFormData = { ...formData, [e.target.name]: e.target.value };
      setHighlightedField(findFirstEmptyField(updatedFormData));
    }, 0);
  };

  const handleSelectChange = (e) => {
    handleChange(e);
    setFieldMessages((prev) => ({ ...prev, [e.target.name]: "" }));
    setTimeout(() => {
      const updatedFormData = { ...formData, [e.target.name]: e.target.value };
      setHighlightedField(findFirstEmptyField(updatedFormData));
    }, 0);
  };

  const handleFocus = (e) => {
    const { name, value } = e.target;
    const fieldName = name;
    if (!value && value !== "0") {
      setFieldMessages((prev) => ({
        ...prev,
        [fieldName]: "Please fill this field",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const fieldName = name;
    setFieldMessages((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const handleNext = () => {
    const missingFields = validateForm(formData);
    if (missingFields.length > 0) {
      const firstEmptyField = missingFields[0].key;
      setHighlightedField(firstEmptyField);
      if (fieldRefs.current[firstEmptyField]) {
        fieldRefs.current[firstEmptyField].focus();
        setFieldMessages((prev) => ({
          ...prev,
          [firstEmptyField]: "Please fill this field",
        }));
      }
      return;
    }
    setHighlightedField(null);
    nextStep();
  };

  useEffect(() => {
    const firstEmpty = findFirstEmptyField(formData);
    setHighlightedField(firstEmpty);
  }, [formData, findFirstEmptyField]);

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
      <div className="container-xxl">
        <div className="container my-5">
          <div className="card p-4 shadow-lg w-100 mx-auto">
            <div className="card-header bg-primary text-white">
              <h3>पोषण आहाराबद्दल माहिती</h3>
            </div>
            <br />
            <form>
              {/* Row 1 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "32px" }} htmlFor="hasDietCommittee">
                    १. शालेय आहार व्यवस्थापन समिती स्थापन आहे काय? 
                  </label>
                  <select
                    name="hasDietCommittee"
                    id="hasDietCommittee"
                    className={`form-control ${highlightedField === "hasDietCommittee" ? "empty-field" : ""}`}
                    value={formData.hasDietCommittee === null ? "" : formData.hasDietCommittee}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["hasDietCommittee"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.hasDietCommittee && (
                    <div className="field-message">{fieldMessages.hasDietCommittee}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="hasCommitteeBoard">
                    १.१. समिती सभासदांचा फलक लावला आहे का? 
                  </label>
                  <select
                    name="hasCommitteeBoard"
                    id="hasCommitteeBoard"
                    className={`form-control ${highlightedField === "hasCommitteeBoard" ? "empty-field" : ""}`}
                    value={formData.hasCommitteeBoard === null ? "" : formData.hasCommitteeBoard}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.hasDietCommittee !== 1}
                    ref={(el) => (fieldRefs.current["hasCommitteeBoard"] = el)}
                    required={formData.hasDietCommittee === 1}
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.hasCommitteeBoard && (
                    <div className="field-message">{fieldMessages.hasCommitteeBoard}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="cookingAgency">
                    २. अन्न शिजवणाऱ्या यंत्रणा 
                  </label>
                  <textarea
                    name="cookingAgency"
                    id="cookingAgency"
                    className={`form-control ${highlightedField === "cookingAgency" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.cookingAgency || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["cookingAgency"] = el)}
                    required
                  ></textarea>
                  {fieldMessages.cookingAgency && (
                    <div className="field-message">{fieldMessages.cookingAgency}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="hasAgreementCopy">
                    ३. करारनाम्याची प्रत उपलब्ध आहे काय 
                  </label>
                  <select
                    name="hasAgreementCopy"
                    id="hasAgreementCopy"
                    className={`form-control ${highlightedField === "hasAgreementCopy" ? "empty-field" : ""}`}
                    value={formData.hasAgreementCopy === null ? "" : formData.hasAgreementCopy}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["hasAgreementCopy"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.hasAgreementCopy && (
                    <div className="field-message">{fieldMessages.hasAgreementCopy}</div>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "32px" }} htmlFor="hasCookTraining">
                    ४. स्वयंपाकी/मदतनीस यांना प्रशिक्षण देण्यात आले आहे का? 
                  </label>
                  <select
                    name="hasCookTraining"
                    id="hasCookTraining"
                    className={`form-control ${highlightedField === "hasCookTraining" ? "empty-field" : ""}`}
                    value={formData.hasCookTraining === null ? "" : formData.hasCookTraining}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["hasCookTraining"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.hasCookTraining && (
                    <div className="field-message">{fieldMessages.hasCookTraining}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="cookHelperCount">
                    ५. स्वयंपाकी मदतनीस संख्या 
                  </label>
                  <input
                    type="text"
                    name="cookHelperCount"
                    id="cookHelperCount"
                    className={`form-control ${highlightedField === "cookHelperCount" ? "empty-field" : ""}`}
                    value={formData.cookHelperCount || ""}
                    onChange={handleNumberChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["cookHelperCount"] = el)}
                    required
                  />
                  {fieldMessages.cookHelperCount && (
                    <div className="field-message">{fieldMessages.cookHelperCount}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="isCookedAtSchool">
                    ६. आहार शाळेमध्ये शिजवला जातो काय? 
                  </label>
                  <select
                    name="isCookedAtSchool"
                    id="isCookedAtSchool"
                    className={`form-control ${highlightedField === "isCookedAtSchool" ? "empty-field" : ""}`}
                    value={formData.isCookedAtSchool === null ? "" : formData.isCookedAtSchool}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["isCookedAtSchool"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.isCookedAtSchool && (
                    <div className="field-message">{fieldMessages.isCookedAtSchool}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="fuelType">
                    ६.१ इंधनाचा वापर 
                  </label>
                  <select
                    name="fuelType"
                    id="fuelType"
                    className={`form-control ${highlightedField === "fuelType" ? "empty-field" : ""}`}
                    value={formData.fuelType || ""}
                    onChange={handleSelectChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.isCookedAtSchool !== 1}
                    ref={(el) => (fieldRefs.current["fuelType"] = el)}
                    required={formData.isCookedAtSchool === 1}
                  >
                    <option value="">निवडा</option>
                    <option value="1">एलपीजी गँस</option>
                    <option value="2">चुल</option>
                    <option value="3">स्टोव्ह</option>
                    <option value="4">इतर</option>
                  </select>
                  {fieldMessages.fuelType && (
                    <div className="field-message">{fieldMessages.fuelType}</div>
                  )}
                </div>
              </div>

              {/* Row 3 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="hasWeighingScale">
                    ७. वजनकाटा उपलब्ध आहे काय? 
                  </label>
                  <select
                    name="hasWeighingScale"
                    id="hasWeighingScale"
                    className={`form-control ${highlightedField === "hasWeighingScale" ? "empty-field" : ""}`}
                    value={formData.hasWeighingScale === null ? "" : formData.hasWeighingScale}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["hasWeighingScale"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.hasWeighingScale && (
                    <div className="field-message">{fieldMessages.hasWeighingScale}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "7px" }} htmlFor="hasRiceWeighed">
                    ७.१. तांदूळ वजन करून वापरल्या जातात काय? 
                  </label>
                  <select
                    name="hasRiceWeighed"
                    id="hasRiceWeighed"
                    className={`form-control ${highlightedField === "hasRiceWeighed" ? "empty-field" : ""}`}
                    value={formData.hasRiceWeighed === null ? "" : formData.hasRiceWeighed}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.hasWeighingScale !== 1}
                    ref={(el) => (fieldRefs.current["hasRiceWeighed"] = el)}
                    required={formData.hasWeighingScale === 1}
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.hasRiceWeighed && (
                    <div className="field-message">{fieldMessages.hasRiceWeighed}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "32px" }} htmlFor="hasStorageUnits">
                    ८. धान्य साठविण्याकरीता कोठ्या आहेत का?
                  </label>
                  <select
                    name="hasStorageUnits"
                    id="hasStorageUnits"
                    className={`form-control ${highlightedField === "hasStorageUnits" ? "empty-field" : ""}`}
                    value={formData.hasStorageUnits === null ? "" : formData.hasStorageUnits}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["hasStorageUnits"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.hasStorageUnits && (
                    <div className="field-message">{fieldMessages.hasStorageUnits}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="hasPlates">
                    ९. ताटे/प्लेट्स उपलब्ध आहेत काय? 
                  </label>
                  <select
                    name="hasPlates"
                    id="hasPlates"
                    className={`form-control ${highlightedField === "hasPlates" ? "empty-field" : ""}`}
                    value={formData.hasPlates === null ? "" : formData.hasPlates}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["hasPlates"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.hasPlates && (
                    <div className="field-message">{fieldMessages.hasPlates}</div>
                  )}
                </div>
              </div>

              {/* Row 4 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "30px" }} htmlFor="teacherPresentDuringDistribution">
                    १०. आहार वितरीत करतेवेळी शिक्षक उपस्थित असतात का? 
                  </label>
                  <select
                    name="teacherPresentDuringDistribution"
                    id="teacherPresentDuringDistribution"
                    className={`form-control ${highlightedField === "teacherPresentDuringDistribution" ? "empty-field" : ""}`}
                    value={formData.teacherPresentDuringDistribution === null ? "" : formData.teacherPresentDuringDistribution}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["teacherPresentDuringDistribution"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.teacherPresentDuringDistribution && (
                    <div className="field-message">{fieldMessages.teacherPresentDuringDistribution}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="mdmPortalUpdated">
                    ११. एमडीएम पोर्टलवर नोंदवली जाते काय? 
                  </label>
                  <select
                    name="mdmPortalUpdated"
                    id="mdmPortalUpdated"
                    className={`form-control ${highlightedField === "mdmPortalUpdated" ? "empty-field" : ""}`}
                    value={formData.mdmPortalUpdated === null ? "" : formData.mdmPortalUpdated}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["mdmPortalUpdated"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.mdmPortalUpdated && (
                    <div className="field-message">{fieldMessages.mdmPortalUpdated}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "7px" }} htmlFor="supplementaryDiet">
                    १२. पूरक आहार दिला जातो काय? 
                  </label>
                  <select
                    name="supplementaryDiet"
                    id="supplementaryDiet"
                    className={`form-control ${highlightedField === "supplementaryDiet" ? "empty-field" : ""}`}
                    value={formData.supplementaryDiet === null ? "" : formData.supplementaryDiet}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["supplementaryDiet"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.supplementaryDiet && (
                    <div className="field-message">{fieldMessages.supplementaryDiet}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="supplementaryDietDetails">
                    १२.१ पूरक आहार तपशील 
                  </label>
                  <textarea
                    name="supplementaryDietDetails"
                    id="supplementaryDietDetails"
                    className={`form-control ${highlightedField === "supplementaryDietDetails" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.supplementaryDietDetails || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.supplementaryDiet !== 1}
                    ref={(el) => (fieldRefs.current["supplementaryDietDetails"] = el)}
                    required={formData.supplementaryDiet === 1}
                  ></textarea>
                  {fieldMessages.supplementaryDietDetails && (
                    <div className="field-message">{fieldMessages.supplementaryDietDetails}</div>
                  )}
                </div>
              </div>

              {/* Row 5 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="sampleStored">
                    १३. आहाराचा नमुना जतन केला जातो काय? 
                  </label>
                  <select
                    name="sampleStored"
                    id="sampleStored"
                    className={`form-control ${highlightedField === "sampleStored" ? "empty-field" : ""}`}
                    value={formData.sampleStored === null ? "" : formData.sampleStored}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["sampleStored"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.sampleStored && (
                    <div className="field-message">{fieldMessages.sampleStored}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="cleaningDone">
                    १४. जेवणानंतर स्वच्छता केली जाते काय? 
                  </label>
                  <select
                    name="cleaningDone"
                    id="cleaningDone"
                    className={`form-control ${highlightedField === "cleaningDone" ? "empty-field" : ""}`}
                    value={formData.cleaningDone === null ? "" : formData.cleaningDone}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["cleaningDone"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.cleaningDone && (
                    <div className="field-message">{fieldMessages.cleaningDone}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="headmasterFoodOpinion">
                    १५. मुख्याध्यापकाचे अन्न मत 
                  </label>
                  <textarea
                    name="headmasterFoodOpinion"
                    id="headmasterFoodOpinion"
                    className={`form-control ${highlightedField === "headmasterFoodOpinion" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.headmasterFoodOpinion || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["headmasterFoodOpinion"] = el)}
                    required
                  ></textarea>
                  {fieldMessages.headmasterFoodOpinion && (
                    <div className="field-message">{fieldMessages.headmasterFoodOpinion}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="thirdPartySupport">
                    १६. त्रयस्थ संस्थांकडून सहकार्य मिळते का? 
                  </label>
                  <select
                    name="thirdPartySupport"
                    id="thirdPartySupport"
                    className={`form-control ${highlightedField === "thirdPartySupport" ? "empty-field" : ""}`}
                    value={formData.thirdPartySupport === null ? "" : formData.thirdPartySupport}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["thirdPartySupport"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.thirdPartySupport && (
                    <div className="field-message">{fieldMessages.thirdPartySupport}</div>
                  )}
                </div>
              </div>

              {/* Row 6 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="basicFacilitiesAvailable">
                    १७. पायाभूत सुविधा उपलब्ध आहेत का? 
                  </label>
                  <select
                    name="basicFacilitiesAvailable"
                    id="basicFacilitiesAvailable"
                    className={`form-control ${highlightedField === "basicFacilitiesAvailable" ? "empty-field" : ""}`}
                    value={formData.basicFacilitiesAvailable === null ? "" : formData.basicFacilitiesAvailable}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["basicFacilitiesAvailable"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.basicFacilitiesAvailable && (
                    <div className="field-message">{fieldMessages.basicFacilitiesAvailable}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="basicFacilitiesDetails">
                    १७.१ मूलभूत सुविधा तपशील 
                  </label>
                  <textarea
                    name="basicFacilitiesDetails"
                    id="basicFacilitiesDetails"
                    className={`form-control ${highlightedField === "basicFacilitiesDetails" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.basicFacilitiesDetails || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.basicFacilitiesAvailable !== 1}
                    ref={(el) => (fieldRefs.current["basicFacilitiesDetails"] = el)}
                    required={formData.basicFacilitiesAvailable === 1}
                  ></textarea>
                  {fieldMessages.basicFacilitiesDetails && (
                    <div className="field-message">{fieldMessages.basicFacilitiesDetails}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "30px" }} htmlFor="diningArrangement">
                    १८. भोजन व्यवस्था 
                  </label>
                  <textarea
                    name="diningArrangement"
                    id="diningArrangement"
                    className={`form-control ${highlightedField === "diningArrangement" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.diningArrangement || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["diningArrangement"] = el)}
                    required
                  ></textarea>
                  {fieldMessages.diningArrangement && (
                    <div className="field-message">{fieldMessages.diningArrangement}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="followsGovtRecipe">
                    १९. शासनाच्या पाककृतीनुसार आहार दिला जातो काय? 
                  </label>
                  <select
                    name="followsGovtRecipe"
                    id="followsGovtRecipe"
                    className={`form-control ${highlightedField === "followsGovtRecipe" ? "empty-field" : ""}`}
                    value={formData.followsGovtRecipe === null ? "" : formData.followsGovtRecipe}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["followsGovtRecipe"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.followsGovtRecipe && (
                    <div className="field-message">{fieldMessages.followsGovtRecipe}</div>
                  )}
                </div>
              </div>

              {/* Row 7 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="eggsBananasRegular">
                    २०. अंडी/केळी नियमित देण्यात येत आहे काय? 
                  </label>
                  <select
                    name="eggsBananasRegular"
                    id="eggsBananasRegular"
                    className={`form-control ${highlightedField === "eggsBananasRegular" ? "empty-field" : ""}`}
                    value={formData.eggsBananasRegular === null ? "" : formData.eggsBananasRegular}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["eggsBananasRegular"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.eggsBananasRegular && (
                    <div className="field-message">{fieldMessages.eggsBananasRegular}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="usesSproutedGrains">
                    २१. मोड आलेल्या कडधान्याचा वापर? 
                  </label>
                  <select
                    name="usesSproutedGrains"
                    id="usesSproutedGrains"
                    className={`form-control ${highlightedField === "usesSproutedGrains" ? "empty-field" : ""}`}
                    value={formData.usesSproutedGrains === null ? "" : formData.usesSproutedGrains}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["usesSproutedGrains"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.usesSproutedGrains && (
                    <div className="field-message">{fieldMessages.usesSproutedGrains}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="labTestMonthly">
                    २२. दरमहा प्रयोगशाळा तपासणी होते काय? 
                  </label>
                  <select
                    name="labTestMonthly"
                    id="labTestMonthly"
                    className={`form-control ${highlightedField === "labTestMonthly" ? "empty-field" : ""}`}
                    value={formData.labTestMonthly === null ? "" : formData.labTestMonthly}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["labTestMonthly"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.labTestMonthly && (
                    <div className="field-message">{fieldMessages.labTestMonthly}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="tasteTestBeforeDistribution">
                    २३. आहार वितरणच्या अगोदर चव घेतली जाते काय? 
                  </label>
                  <select
                    name="tasteTestBeforeDistribution"
                    id="tasteTestBeforeDistribution"
                    className={`form-control ${highlightedField === "tasteTestBeforeDistribution" ? "empty-field" : ""}`}
                    value={formData.tasteTestBeforeDistribution === null ? "" : formData.tasteTestBeforeDistribution}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["tasteTestBeforeDistribution"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.tasteTestBeforeDistribution && (
                    <div className="field-message">{fieldMessages.tasteTestBeforeDistribution}</div>
                  )}
                </div>
              </div>

              {/* Row 8 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="smcParentVisits">
                    २४. शालेय व्यवस्थापन समितीच्या भेटी झाल्या आहेत काय? 
                  </label>
                  <select
                    name="smcParentVisits"
                    id="smcParentVisits"
                    className={`form-control ${highlightedField === "smcParentVisits" ? "empty-field" : ""}`}
                    value={formData.smcParentVisits === null ? "" : formData.smcParentVisits}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["smcParentVisits"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.smcParentVisits && (
                    <div className="field-message">{fieldMessages.smcParentVisits}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="hasTasteRegister">
                    २५. चव रजिस्टर ठेवण्यात आले आहे काय? 
                  </label>
                  <select
                    name="hasTasteRegister"
                    id="hasTasteRegister"
                    className={`form-control ${highlightedField === "hasTasteRegister" ? "empty-field" : ""}`}
                    value={formData.hasTasteRegister === null ? "" : formData.hasTasteRegister}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["hasTasteRegister"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.hasTasteRegister && (
                    <div className="field-message">{fieldMessages.hasTasteRegister}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="dailyTasteEntries">
                    २५.१ दैनंदिन नोंदी घेण्यात येतात का? 
                  </label>
                  <select
                    name="dailyTasteEntries"
                    id="dailyTasteEntries"
                    className={`form-control ${highlightedField === "dailyTasteEntries" ? "empty-field" : ""}`}
                    value={formData.dailyTasteEntries === null ? "" : formData.dailyTasteEntries}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.hasTasteRegister !== 1}
                    ref={(el) => (fieldRefs.current["dailyTasteEntries"] = el)}
                    required={formData.hasTasteRegister === 1}
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.dailyTasteEntries && (
                    <div className="field-message">{fieldMessages.dailyTasteEntries}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="stockMatchesRegister">
                    २६. नोंदवहीतील साठा बरोबर आहे काय? 
                  </label>
                  <select
                    name="stockMatchesRegister"
                    id="stockMatchesRegister"
                    className={`form-control ${highlightedField === "stockMatchesRegister" ? "empty-field" : ""}`}
                    value={formData.stockMatchesRegister === null ? "" : formData.stockMatchesRegister}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["stockMatchesRegister"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.stockMatchesRegister && (
                    <div className="field-message">{fieldMessages.stockMatchesRegister}</div>
                  )}
                </div>
              </div>

              {/* Row 9 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="stockDiscrepancyDetails">
                    २६.१ साठा विसंगती तपशील 
                  </label>
                  <textarea
                    name="stockDiscrepancyDetails"
                    id="stockDiscrepancyDetails"
                    className={`form-control ${highlightedField === "stockDiscrepancyDetails" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.stockDiscrepancyDetails || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.stockMatchesRegister !== 0}
                    ref={(el) => (fieldRefs.current["stockDiscrepancyDetails"] = el)}
                    required={formData.stockMatchesRegister === 0}
                  ></textarea>
                  {fieldMessages.stockDiscrepancyDetails && (
                    <div className="field-message">{fieldMessages.stockDiscrepancyDetails}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="recipesDisplayed">
                    २७. दैनंदिन आहाराच्या पाककृती प्रदर्शित आहेत काय? 
                  </label>
                  <select
                    name="recipesDisplayed"
                    id="recipesDisplayed"
                    className={`form-control ${highlightedField === "recipesDisplayed" ? "empty-field" : ""}`}
                    value={formData.recipesDisplayed === null ? "" : formData.recipesDisplayed}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["recipesDisplayed"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.recipesDisplayed && (
                    <div className="field-message">{fieldMessages.recipesDisplayed}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "32px" }} htmlFor="monitoringCommitteeMeetings">
                    २८. समितीच्या बैठक घेण्यात आल्या आहेत काय? 
                  </label>
                  <select
                    name="monitoringCommitteeMeetings"
                    id="monitoringCommitteeMeetings"
                    className={`form-control ${highlightedField === "monitoringCommitteeMeetings" ? "empty-field" : ""}`}
                    value={formData.monitoringCommitteeMeetings === null ? "" : formData.monitoringCommitteeMeetings}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["monitoringCommitteeMeetings"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.monitoringCommitteeMeetings && (
                    <div className="field-message">{fieldMessages.monitoringCommitteeMeetings}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "10px" }} htmlFor="meetingCount2024_25">
                    २८.१ सन २०२४-२५ मधील बैठकांची संख्या 
                  </label>
                  <input
                    type="text"
                    name="meetingCount2024_25"
                    id="meetingCount2024_25"
                    className={`form-control ${highlightedField === "meetingCount2024_25" ? "empty-field" : ""}`}
                    value={formData.meetingCount2024_25 || ""}
                    onChange={handleNumberChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.monitoringCommitteeMeetings !== 1}
                    ref={(el) => (fieldRefs.current["meetingCount2024_25"] = el)}
                    required={formData.monitoringCommitteeMeetings === 1}
                  />
                  {fieldMessages.meetingCount2024_25 && (
                    <div className="field-message">{fieldMessages.meetingCount2024_25}</div>
                  )}
                </div>
              </div>

              {/* Row 10 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="emptySacksReturned">
                    २९. रिकाम्या गोण्या पुरवठादारास दिल्या आहेत काय? 
                  </label>
                  <select
                    name="emptySacksReturned"
                    id="emptySacksReturned"
                    className={`form-control ${highlightedField === "emptySacksReturned" ? "empty-field" : ""}`}
                    value={formData.emptySacksReturned === null ? "" : formData.emptySacksReturned}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["emptySacksReturned"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.emptySacksReturned && (
                    <div className="field-message">{fieldMessages.emptySacksReturned}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="sackTransferRecorded">
                    २९.१ हस्तांतरित गोण्यांची नोंद ठेवली आहे काय?
                  </label>
                  <select
                    name="sackTransferRecorded"
                    id="sackTransferRecorded"
                    className={`form-control ${highlightedField === "sackTransferRecorded" ? "empty-field" : ""}`}
                    value={formData.sackTransferRecorded === null ? "" : formData.sackTransferRecorded}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.emptySacksReturned !== 1}
                    ref={(el) => (fieldRefs.current["sackTransferRecorded"] = el)}
                    required={formData.emptySacksReturned === 1}
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.sackTransferRecorded && (
                    <div className="field-message">{fieldMessages.sackTransferRecorded}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="sackTransferCount">
                    २९.२ हस्तांतरित गोण्यांची संख्या 
                  </label>
                  <textarea
                    name="sackTransferCount"
                    id="sackTransferCount"
                    className={`form-control ${highlightedField === "sackTransferCount" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.sackTransferCount || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.emptySacksReturned !== 1}
                    ref={(el) => (fieldRefs.current["sackTransferCount"] = el)}
                    required={formData.emptySacksReturned === 1}
                  ></textarea>
                  {fieldMessages.sackTransferCount && (
                    <div className="field-message">{fieldMessages.sackTransferCount}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="currentFoodMaterials">
                    ३०. सध्याचे अन्न साहित्य 
                  </label>
                  <textarea
                    name="currentFoodMaterials"
                    id="currentFoodMaterials"
                    className={`form-control ${highlightedField === "currentFoodMaterials" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.currentFoodMaterials || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["currentFoodMaterials"] = el)}
                    required
                  ></textarea>
                  {fieldMessages.currentFoodMaterials && (
                    <div className="field-message">{fieldMessages.currentFoodMaterials}</div>
                  )}
                </div>
              </div>

              {/* Row 11 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="snehTithiProgram">
                    ३१. स्नेहभोजन/तिथीभोजन कार्यक्रम राबवले आहेत काय?
                  </label>
                  <select
                    name="snehTithiProgram"
                    id="snehTithiProgram"
                    className={`form-control ${highlightedField === "snehTithiProgram" ? "empty-field" : ""}`}
                    value={formData.snehTithiProgram === null ? "" : formData.snehTithiProgram}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["snehTithiProgram"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.snehTithiProgram && (
                    <div className="field-message">{fieldMessages.snehTithiProgram}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="snehTithiProgramDetails">
                    ३१.१ स्नेह तिथी कार्यक्रम तपशील 
                  </label>
                  <textarea
                    name="snehTithiProgramDetails"
                    id="snehTithiProgramDetails"
                    className={`form-control ${highlightedField === "snehTithiProgramDetails" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.snehTithiProgramDetails || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.snehTithiProgram !== 1}
                    ref={(el) => (fieldRefs.current["snehTithiProgramDetails"] = el)}
                    required={formData.snehTithiProgram === 1}
                  ></textarea>
                  {fieldMessages.snehTithiProgramDetails && (
                    <div className="field-message">{fieldMessages.snehTithiProgramDetails}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="corruptionDetails">
                    ३२. भ्रष्टाचार तपशील 
                  </label>
                  <textarea
                    name="corruptionDetails"
                    id="corruptionDetails"
                    className={`form-control ${highlightedField === "corruptionDetails" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.corruptionDetails || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["corruptionDetails"] = el)}
                    required
                  ></textarea>
                  {fieldMessages.corruptionDetails && (
                    <div className="field-message">{fieldMessages.corruptionDetails}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="corruptionActionDetails">
                    ३२.१ भ्रष्टाचार कारवाई तपशील 
                  </label>
                  <textarea
                    name="corruptionActionDetails"
                    id="corruptionActionDetails"
                    className={`form-control ${highlightedField === "corruptionActionDetails" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.corruptionActionDetails || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["corruptionActionDetails"] = el)}
                    required
                  ></textarea>
                  {fieldMessages.corruptionActionDetails && (
                    <div className="field-message">{fieldMessages.corruptionActionDetails}</div>
                  )}
                </div>
              </div>

              {/* Row 12 */}
              <div className="row">
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="fieldOfficerVisits">
                    ३३. क्षेत्रीय अधिकाऱ्यांच्या भेटी झालेल्या आहेत काय? 
                  </label>
                  <select
                    name="fieldOfficerVisits"
                    id="fieldOfficerVisits"
                    className={`form-control ${highlightedField === "fieldOfficerVisits" ? "empty-field" : ""}`}
                    value={formData.fieldOfficerVisits === null ? "" : formData.fieldOfficerVisits}
                    onChange={handleLocalBinaryChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["fieldOfficerVisits"] = el)}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                  {fieldMessages.fieldOfficerVisits && (
                    <div className="field-message">{fieldMessages.fieldOfficerVisits}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="fieldOfficerVisitDetails">
                    ३३.१ फील्ड अधिकारी भेट तपशील 
                  </label>
                  <textarea
                    name="fieldOfficerVisitDetails"
                    id="fieldOfficerVisitDetails"
                    className={`form-control ${highlightedField === "fieldOfficerVisitDetails" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.fieldOfficerVisitDetails || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={formData.fieldOfficerVisits !== 1}
                    ref={(el) => (fieldRefs.current["fieldOfficerVisitDetails"] = el)}
                    required={formData.fieldOfficerVisits === 1}
                  ></textarea>
                  {fieldMessages.fieldOfficerVisitDetails && (
                    <div className="field-message">{fieldMessages.fieldOfficerVisitDetails}</div>
                  )}
                </div>
                <div className="col-md-3 form-group mb-3">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="schemeSuggestions">
                    ३४. योजनेच्या सूचना 
                  </label>
                  <textarea
                    name="schemeSuggestions"
                    id="schemeSuggestions"
                    className={`form-control ${highlightedField === "schemeSuggestions" ? "empty-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.schemeSuggestions || ""}
                    onChange={handleTextChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    ref={(el) => (fieldRefs.current["schemeSuggestions"] = el)}
                    required
                  ></textarea>
                  {fieldMessages.schemeSuggestions && (
                    <div className="field-message">{fieldMessages.schemeSuggestions}</div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="text-center mt-4">
          <button type="button" className="btn btn-primary btn-lg me-2" onClick={prevStep}>
            मागे जा
          </button>
          <button type="button" className="btn btn-primary btn-lg" onClick={handleNext}>
            पुढे चला
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateSchoolFormPage2;