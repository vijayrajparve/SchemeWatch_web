import React from "react";

const SchoolFormPage2 = ({ formData, setFormData, handleChange, nextStep, prevStep }) => {
  const [highlightedField, setHighlightedField] = React.useState(null);
  const [focusMessage, setFocusMessage] = React.useState("");

  // Handler for binary (yes/no) fields
  const handleBinaryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : Number(value),
    }));
    if (highlightedField === name && value !== "") {
      setHighlightedField(null);
      setFocusMessage("");
    } else if (highlightedField === name) {
      const validationError = validateForm();
      setHighlightedField(validationError ? validationError.key : null);
    }
  };

  // Handler for numerical fields
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      if (highlightedField === name && value) {
        setHighlightedField(null);
        setFocusMessage("");
      } else if (highlightedField === name) {
        const validationError = validateForm();
        setHighlightedField(validationError ? validationError.key : null);
      }
    } else {
      setFocusMessage("कृपया फक्त अंक प्रविष्ट करा");
    }
  };

  // Handler for text fields
  const handleTextChange = (e) => {
    handleChange(e);
    const { name, value } = e.target;
    if (highlightedField === name && value) {
      setHighlightedField(null);
      setFocusMessage("");
    } else if (highlightedField === name) {
      const validationError = validateForm();
      setHighlightedField(validationError ? validationError.key : null);
    }
  };

  // Validation function
  const validateForm = () => {
    const requiredFields = [
      { key: "hasDietCommittee", label: "शालेय आहार व्यवस्थापन समिती स्थापन" },
      { key: "hasCommitteeBoard", label: "समिती सभासदांचा फलक" },
      { key: "cookingAgency", label: "अन्न शिजवणाऱ्या यंत्रणा" },
      { key: "hasAgreementCopy", label: "करारनाम्याची प्रत" },
      { key: "hasCookTraining", label: "स्वयंपाकी/मदतनीस प्रशिक्षण" },
      { key: "cookHelperCount", label: "स्वयंपाकी मदतनीस संख्या" },
      { key: "isCookedAtSchool", label: "आहार शाळेमध्ये शिजवला जातो" },
      { key: "fuelType", label: "इंधनाचा वापर" },
      { key: "hasWeighingScale", label: "वजनकाटा उपलब्ध" },
      { key: "hasRiceWeighed", label: "तांदूळ वजन" },
      { key: "hasStorageUnits", label: "धान्य साठविण्याकरीता कोठ्या" },
      { key: "hasPlates", label: "ताटे/प्लेट्स उपलब्ध" },
      { key: "teacherPresentDuringDistribution", label: "आहार वितरणावेळी शिक्षक उपस्थित" },
      { key: "mdmPortalUpdated", label: "एमडीएम पोर्टलवर नोंद" },
      { key: "supplementaryDiet", label: "पूरक आहार" },
      { key: "supplementaryDietDetails", label: "पूरक आहार तपशील" },
      { key: "sampleStored", label: "आहाराचा नमुना जतन" },
      { key: "cleaningDone", label: "जेवणानंतर स्वच्छता" },
      { key: "headmasterFoodOpinion", label: "मुख्याध्यापकाचे अन्न मत" },
      { key: "thirdPartySupport", label: "त्रयस्थ संस्थांकडून सहकार्य" },
      { key: "basicFacilitiesAvailable", label: "पायाभूत सुविधा उपलब्ध" },
      { key: "basicFacilitiesDetails", label: "मूलभूत सुविधा तपशील" },
      { key: "diningArrangement", label: "भोजन व्यवस्था" },
      { key: "followsGovtRecipe", label: "शासनाच्या पाककृतीनुसार आहार" },
      { key: "eggsBananasRegular", label: "अंडी/केळी नियमित" },
      { key: "usesSproutedGrains", label: "मोड आलेल्या कडधान्याचा वापर" },
      { key: "labTestMonthly", label: "दरमहा प्रयोगशाळा तपासणी" },
      { key: "tasteTestBeforeDistribution", label: "आहार वितरणच्या अगोदर चव" },
      { key: "smcParentVisits", label: "शालेय व्यवस्थापन समितीच्या भेटी" },
      { key: "hasTasteRegister", label: "चव रजिस्टर" },
      { key: "dailyTasteEntries", label: "दैनंदिन चव नोंदी" },
      { key: "stockMatchesRegister", label: "नोंदवहीतील साठा" },
      { key: "stockDiscrepancyDetails", label: "साठा विसंगती तपशील" },
      { key: "recipesDisplayed", label: "दैनंदिन आहाराच्या पाककृती प्रदर्शित" },
      { key: "monitoringCommitteeMeetings", label: "समितीच्या बैठका" },
      { key: "meetingCount2024_25", label: "सन २०२४-२५ मधील बैठकांची संख्या" },
      { key: "emptySacksReturned", label: "रिकाम्या गोण्या पुरवठादारास" },
      { key: "sackTransferRecorded", label: "हस्तांतरित गोण्यांची नोंद" },
      { key: "sackTransferCount", label: "हस्तांतरित गोण्यांची संख्या" },
      { key: "currentFoodMaterials", label: "सध्याचे अन्न साहित्य" },
      { key: "snehTithiProgram", label: "स्नेहभोजन/तिथीभोजन कार्यक्रम" },
      { key: "snehTithiProgramDetails", label: "स्नेह तिथी कार्यक्रम तपशील" },
      { key: "corruptionDetails", label: "भ्रष्टाचार तपशील" },
      { key: "corruptionActionDetails", label: "भ्रष्टाचार कारवाई तपशील" },
      { key: "fieldOfficerVisits", label: "क्षेत्रीय अधिकाऱ्यांच्या भेटी" },
      { key: "fieldOfficerVisitDetails", label: "फील्ड अधिकारी भेट तपशील" },
      { key: "schemeSuggestions", label: "योजनेच्या सूचना" },
    ];

    const numericalFields = ["cookHelperCount", "meetingCount2024_25", "sackTransferCount"];
    for (let { key, label } of requiredFields) {
      if (!formData[key] && formData[key] !== 0) {
        return { key, label };
      }
      if (numericalFields.includes(key) && !/^\d+$/.test(formData[key])) {
        return { key, label };
      }
    }
    return null;
  };

  // Next step handler
  const handleNext = () => {
    const validationError = validateForm();
    if (validationError) {
      setHighlightedField(validationError.key);
      const element = document.getElementById(validationError.key);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setHighlightedField(null);
    nextStep();
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
    <>
      <style>
        {`
          .unfilled-field {
            border: 2px solid blue !important;
          }
          .focus-message {
            color: #007bff;
            font-size: 0.875rem;
            margin-top: 10px;
            text-align: center;
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
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "32px" }} htmlFor="hasDietCommittee">
                    १. शालेय आहार व्यवस्थापन समिती स्थापन आहे काय?
                  </label>
                  <select
                    name="hasDietCommittee"
                    id="hasDietCommittee"
                    className={`form-control ${highlightedField === "hasDietCommittee" ? "unfilled-field" : ""}`}
                    value={formData.hasDietCommittee === null ? "" : formData.hasDietCommittee}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("hasDietCommittee", "शालेय आहार व्यवस्थापन समिती स्थापन")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="hasCommitteeBoard">
                    १.१. समिती सभासदांचा फलक लावला आहे का?
                  </label>
                  <select
                    name="hasCommitteeBoard"
                    id="hasCommitteeBoard"
                    className={`form-control ${highlightedField === "hasCommitteeBoard" ? "unfilled-field" : ""}`}
                    value={formData.hasCommitteeBoard === null ? "" : formData.hasCommitteeBoard}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("hasCommitteeBoard", "समिती सभासदांचा फलक")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="cookingAgency">
                    २. अन्न शिजवणाऱ्या यंत्रणा
                  </label>
                  <textarea
                    name="cookingAgency"
                    id="cookingAgency"
                    className={`form-control ${highlightedField === "cookingAgency" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.cookingAgency || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("cookingAgency", "अन्न शिजवणाऱ्या यंत्रणा")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="hasAgreementCopy">
                    ३. करारनाम्याची प्रत उपलब्ध आहे काय
                  </label>
                  <select
                    name="hasAgreementCopy"
                    id="hasAgreementCopy"
                    className={`form-control ${highlightedField === "hasAgreementCopy" ? "unfilled-field" : ""}`}
                    value={formData.hasAgreementCopy === null ? "" : formData.hasAgreementCopy}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("hasAgreementCopy", "करारनाम्याची प्रत")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="row">
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "32px" }} htmlFor="hasCookTraining">
                    ४. स्वयंपाकी/मदतनीस यांना प्रशिक्षण देण्यात आले आहे का?
                  </label>
                  <select
                    name="hasCookTraining"
                    id="hasCookTraining"
                    className={`form-control ${highlightedField === "hasCookTraining" ? "unfilled-field" : ""}`}
                    value={formData.hasCookTraining === null ? "" : formData.hasCookTraining}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("hasCookTraining", "स्वयंपाकी/मदतनीस प्रशिक्षण")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="cookHelperCount">
                    ५. स्वयंपाकी मदतनीस संख्या
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="cookHelperCount"
                    id="cookHelperCount"
                    className={`form-control ${highlightedField === "cookHelperCount" ? "unfilled-field" : ""}`}
                    value={formData.cookHelperCount || ""}
                    onChange={handleNumberChange}
                    onFocus={() => handleFocus("cookHelperCount", "स्वयंपाकी मदतनीस संख्या")}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="isCookedAtSchool">
                    ६. आहार शाळेमध्ये शिजवला जातो काय?
                  </label>
                  <select
                    name="isCookedAtSchool"
                    id="isCookedAtSchool"
                    className={`form-control ${highlightedField === "isCookedAtSchool" ? "unfilled-field" : ""}`}
                    value={formData.isCookedAtSchool === null ? "" : formData.isCookedAtSchool}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("isCookedAtSchool", "आहार शाळेमध्ये शिजवला जातो")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="fuelType">
                    ६.१ इंधनाचा वापर
                  </label>
                  <select
                    name="fuelType"
                    id="fuelType"
                    className={`form-control ${highlightedField === "fuelType" ? "unfilled-field" : ""}`}
                    value={formData.fuelType || ""}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("fuelType", "इंधनाचा वापर")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">एलपीजी गँस</option>
                    <option value="2">चुल</option>
                    <option value="3">स्टोव्ह</option>
                    <option value="4">इतर</option>
                  </select>
                </div>
              </div>

              {/* Row 3 */}
              <div className="row">
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="hasWeighingScale">
                    ७. वजनकाटा उपलब्ध आहे काय?
                  </label>
                  <select
                    name="hasWeighingScale"
                    id="hasWeighingScale"
                    className={`form-control ${highlightedField === "hasWeighingScale" ? "unfilled-field" : ""}`}
                    value={formData.hasWeighingScale === null ? "" : formData.hasWeighingScale}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("hasWeighingScale", "वजनकाटा उपलब्ध")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "7px" }} htmlFor="hasRiceWeighed">
                    ७.१. तांदूळ वजन करून वापरल्या जातात काय?
                  </label>
                  <select
                    name="hasRiceWeighed"
                    id="hasRiceWeighed"
                    className={`form-control ${highlightedField === "hasRiceWeighed" ? "unfilled-field" : ""}`}
                    value={formData.hasRiceWeighed === null ? "" : formData.hasRiceWeighed}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("hasRiceWeighed", "तांदूळ वजन")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "32px" }} htmlFor="hasStorageUnits">
                    ८. धान्य साठविण्याकरीता कोठ्या आहेत का?
                  </label>
                  <select
                    name="hasStorageUnits"
                    id="hasStorageUnits"
                    className={`form-control ${highlightedField === "hasStorageUnits" ? "unfilled-field" : ""}`}
                    value={formData.hasStorageUnits === null ? "" : formData.hasStorageUnits}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("hasStorageUnits", "धान्य साठविण्याकरीता कोठ्या")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="hasPlates">
                    ९. ताटे/प्लेट्स उपलब्ध आहेत काय?
                  </label>
                  <select
                    name="hasPlates"
                    id="hasPlates"
                    className={`form-control ${highlightedField === "hasPlates" ? "unfilled-field" : ""}`}
                    value={formData.hasPlates === null ? "" : formData.hasPlates}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("hasPlates", "ताटे/प्लेट्स उपलब्ध")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
              </div>

              {/* Row 4 */}
              <div className="row">
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "30px" }} htmlFor="teacherPresentDuringDistribution">
                    १०. आहार वितरीत करतेवेळी शिक्षक उपस्थित असतात का?
                  </label>
                  <select
                    name="teacherPresentDuringDistribution"
                    id="teacherPresentDuringDistribution"
                    className={`form-control ${highlightedField === "teacherPresentDuringDistribution" ? "unfilled-field" : ""}`}
                    value={formData.teacherPresentDuringDistribution === null ? "" : formData.teacherPresentDuringDistribution}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("teacherPresentDuringDistribution", "आहार वितरणावेळी शिक्षक उपस्थित")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="mdmPortalUpdated">
                    ११. एमडीएम पोर्टलवर नोंदवली जाते काय?
                  </label>
                  <select
                    name="mdmPortalUpdated"
                    id="mdmPortalUpdated"
                    className={`form-control ${highlightedField === "mdmPortalUpdated" ? "unfilled-field" : ""}`}
                    value={formData.mdmPortalUpdated === null ? "" : formData.mdmPortalUpdated}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("mdmPortalUpdated", "एमडीएम पोर्टलवर नोंद")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "7px" }} htmlFor="supplementaryDiet">
                    १२. पूरक आहार दिला जातो काय?
                  </label>
                  <select
                    name="supplementaryDiet"
                    id="supplementaryDiet"
                    className={`form-control ${highlightedField === "supplementaryDiet" ? "unfilled-field" : ""}`}
                    value={formData.supplementaryDiet === null ? "" : formData.supplementaryDiet}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("supplementaryDiet", "पूरक आहार")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="supplementaryDietDetails">
                    १२.१ पूरक आहार तपशील
                  </label>
                  <textarea
                    name="supplementaryDietDetails"
                    id="supplementaryDietDetails"
                    className={`form-control ${highlightedField === "supplementaryDietDetails" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.supplementaryDietDetails || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("supplementaryDietDetails", "पूरक आहार तपशील")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Row 5 */}
              <div className="row">
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="sampleStored">
                    १३. आहाराचा नमुना जतन केला जातो काय?
                  </label>
                  <select
                    name="sampleStored"
                    id="sampleStored"
                    className={`form-control ${highlightedField === "sampleStored" ? "unfilled-field" : ""}`}
                    value={formData.sampleStored === null ? "" : formData.sampleStored}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("sampleStored", "आहाराचा नमुना जतन")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="cleaningDone">
                    १४. जेवणानंतर स्वच्छता केली जाते काय?
                  </label>
                  <select
                    name="cleaningDone"
                    id="cleaningDone"
                    className={`form-control ${highlightedField === "cleaningDone" ? "unfilled-field" : ""}`}
                    value={formData.cleaningDone === null ? "" : formData.cleaningDone}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("cleaningDone", "जेवणानंतर स्वच्छता")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="headmasterFoodOpinion">
                    १५. मुख्याध्यापकाचे अन्न मत
                  </label>
                  <textarea
                    name="headmasterFoodOpinion"
                    id="headmasterFoodOpinion"
                    className={`form-control ${highlightedField === "headmasterFoodOpinion" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.headmasterFoodOpinion || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("headmasterFoodOpinion", "मुख्याध्यापकाचे अन्न मत")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="thirdPartySupport">
                    १६. त्रयस्थ संस्थांकडून सहकार्य मिळते का?
                  </label>
                  <select
                    name="thirdPartySupport"
                    id="thirdPartySupport"
                    className={`form-control ${highlightedField === "thirdPartySupport" ? "unfilled-field" : ""}`}
                    value={formData.thirdPartySupport === null ? "" : formData.thirdPartySupport}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("thirdPartySupport", "त्रयस्थ संस्थांकडून सहकार्य")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
              </div>

              {/* Row 6 */}
              <div className="row">
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="basicFacilitiesAvailable">
                    १७. पायाभूत सुविधा उपलब्ध आहेत का?
                  </label>
                  <select
                    name="basicFacilitiesAvailable"
                    id="basicFacilitiesAvailable"
                    className={`form-control ${highlightedField === "basicFacilitiesAvailable" ? "unfilled-field" : ""}`}
                    value={formData.basicFacilitiesAvailable === null ? "" : formData.basicFacilitiesAvailable}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("basicFacilitiesAvailable", "पायाभूत सुविधा उपलब्ध")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="basicFacilitiesDetails">
                    १७.१ मूलभूत सुविधा तपशील
                  </label>
                  <textarea
                    name="basicFacilitiesDetails"
                    id="basicFacilitiesDetails"
                    className={`form-control ${highlightedField === "basicFacilitiesDetails" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.basicFacilitiesDetails || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("basicFacilitiesDetails", "मूलभूत सुविधा तपशील")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "30px" }} htmlFor="diningArrangement">
                    १८. भोजन व्यवस्था
                  </label>
                  <textarea
                    name="diningArrangement"
                    id="diningArrangement"
                    className={`form-control ${highlightedField === "diningArrangement" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.diningArrangement || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("diningArrangement", "भोजन व्यवस्था")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="followsGovtRecipe">
                    १९. शासनाच्या पाककृतीनुसार आहार दिला जातो काय?
                  </label>
                  <select
                    name="followsGovtRecipe"
                    id="followsGovtRecipe"
                    className={`form-control ${highlightedField === "followsGovtRecipe" ? "unfilled-field" : ""}`}
                    value={formData.followsGovtRecipe === null ? "" : formData.followsGovtRecipe}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("followsGovtRecipe", "शासनाच्या पाककृतीनुसार आहार")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
              </div>

              {/* Row 7 */}
              <div className="row">
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="eggsBananasRegular">
                    २०. अंडी/केळी नियमित देण्यात येत आहे काय?
                  </label>
                  <select
                    name="eggsBananasRegular"
                    id="eggsBananasRegular"
                    className={`form-control ${highlightedField === "eggsBananasRegular" ? "unfilled-field" : ""}`}
                    value={formData.eggsBananasRegular === null ? "" : formData.eggsBananasRegular}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("eggsBananasRegular", "अंडी/केळी नियमित")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="usesSproutedGrains">
                    २१. मोड आलेल्या कडधान्याचा वापर?
                  </label>
                  <select
                    name="usesSproutedGrains"
                    id="usesSproutedGrains"
                    className={`form-control ${highlightedField === "usesSproutedGrains" ? "unfilled-field" : ""}`}
                    value={formData.usesSproutedGrains === null ? "" : formData.usesSproutedGrains}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("usesSproutedGrains", "मोड आलेल्या कडधान्याचा वापर")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="labTestMonthly">
                    २२. दरमहा प्रयोगशाळा तपासणी होते काय?
                  </label>
                  <select
                    name="labTestMonthly"
                    id="labTestMonthly"
                    className={`form-control ${highlightedField === "labTestMonthly" ? "unfilled-field" : ""}`}
                    value={formData.labTestMonthly === null ? "" : formData.labTestMonthly}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("labTestMonthly", "दरमहा प्रयोगशाळा तपासणी")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="tasteTestBeforeDistribution">
                    २३. आहार वितरणच्या अगोदर चव घेतली जाते काय?
                  </label>
                  <select
                    name="tasteTestBeforeDistribution"
                    id="tasteTestBeforeDistribution"
                    className={`form-control ${highlightedField === "tasteTestBeforeDistribution" ? "unfilled-field" : ""}`}
                    value={formData.tasteTestBeforeDistribution === null ? "" : formData.tasteTestBeforeDistribution}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("tasteTestBeforeDistribution", "आहार वितरणच्या अगोदर चव")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
              </div>

              {/* Row 8 */}
              <div className="row">
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="smcParentVisits">
                    २४. शालेय व्यवस्थापन समितीच्या भेटी झाल्या आहेत काय?
                  </label>
                  <select
                    name="smcParentVisits"
                    id="smcParentVisits"
                    className={`form-control ${highlightedField === "smcParentVisits" ? "unfilled-field" : ""}`}
                    value={formData.smcParentVisits === null ? "" : formData.smcParentVisits}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("smcParentVisits", "शालेय व्यवस्थापन समितीच्या भेटी")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="hasTasteRegister">
                    २५. चव रजिस्टर ठेवण्यात आले आहे काय?
                  </label>
                  <select
                    name="hasTasteRegister"
                    id="hasTasteRegister"
                    className={`form-control ${highlightedField === "hasTasteRegister" ? "unfilled-field" : ""}`}
                    value={formData.hasTasteRegister === null ? "" : formData.hasTasteRegister}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("hasTasteRegister", "चव रजिस्टर")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="dailyTasteEntries">
                    २५.१ दैनंदिन नोंदी घेण्यात येतात का?
                  </label>
                  <select
                    name="dailyTasteEntries"
                    id="dailyTasteEntries"
                    className={`form-control ${highlightedField === "dailyTasteEntries" ? "unfilled-field" : ""}`}
                    value={formData.dailyTasteEntries === null ? "" : formData.dailyTasteEntries}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("dailyTasteEntries", "दैनंदिन चव नोंदी")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="stockMatchesRegister">
                    २६. नोंदवहीतील साठा बरोबर आहे काय?
                  </label>
                  <select
                    name="stockMatchesRegister"
                    id="stockMatchesRegister"
                    className={`form-control ${highlightedField === "stockMatchesRegister" ? "unfilled-field" : ""}`}
                    value={formData.stockMatchesRegister === null ? "" : formData.stockMatchesRegister}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("stockMatchesRegister", "नोंदवहीतील साठा")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
              </div>

              {/* Row 9 */}
              <div className="row">
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="stockDiscrepancyDetails">
                    २६.१ साठा विसंगती तपशील
                  </label>
                  <textarea
                    name="stockDiscrepancyDetails"
                    id="stockDiscrepancyDetails"
                    className={`form-control ${highlightedField === "stockDiscrepancyDetails" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.stockDiscrepancyDetails || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("stockDiscrepancyDetails", "साठा विसंगती तपशील")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="recipesDisplayed">
                    २७. दैनंदिन आहाराच्या पाककृती प्रदर्शित आहेत काय?
                  </label>
                  <select
                    name="recipesDisplayed"
                    id="recipesDisplayed"
                    className={`form-control ${highlightedField === "recipesDisplayed" ? "unfilled-field" : ""}`}
                    value={formData.recipesDisplayed === null ? "" : formData.recipesDisplayed}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("recipesDisplayed", "दैनंदिन आहाराच्या पाककृती प्रदर्शित")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "32px" }} htmlFor="monitoringCommitteeMeetings">
                    २८. समितीच्या बैठक घेण्यात आल्या आहेत काय?
                  </label>
                  <select
                    name="monitoringCommitteeMeetings"
                    id="monitoringCommitteeMeetings"
                    className={`form-control ${highlightedField === "monitoringCommitteeMeetings" ? "unfilled-field" : ""}`}
                    value={formData.monitoringCommitteeMeetings === null ? "" : formData.monitoringCommitteeMeetings}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("monitoringCommitteeMeetings", "समितीच्या बैठका")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "10px" }} htmlFor="meetingCount2024_25">
                    २८.१ सन २०२४-२५ मधील बैठकांची संख्या
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="meetingCount2024_25"
                    id="meetingCount2024_25"
                    className={`form-control ${highlightedField === "meetingCount2024_25" ? "unfilled-field" : ""}`}
                    value={formData.meetingCount2024_25 || ""}
                    onChange={handleNumberChange}
                    onFocus={() => handleFocus("meetingCount2024_25", "सन २०२४-२५ मधील बैठकांची संख्या")}
                    onBlur={handleBlur}
                    required
                  />
                </div>
              </div>

              {/* Row 10 */}
              <div className="row">
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="emptySacksReturned">
                    २९. रिकाम्या गोण्या पुरवठादारास दिल्या आहेत काय?
                  </label>
                  <select
                    name="emptySacksReturned"
                    id="emptySacksReturned"
                    className={`form-control ${highlightedField === "emptySacksReturned" ? "unfilled-field" : ""}`}
                    value={formData.emptySacksReturned === null ? "" : formData.emptySacksReturned}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("emptySacksReturned", "रिकाम्या गोण्या पुरवठादारास")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="sackTransferRecorded">
                    २९.१ हस्तांतरित गोण्यांची नोंद ठेवली आहे काय?
                  </label>
                  <select
                    name="sackTransferRecorded"
                    id="sackTransferRecorded"
                    className={`form-control ${highlightedField === "sackTransferRecorded" ? "unfilled-field" : ""}`}
                    value={formData.sackTransferRecorded === null ? "" : formData.sackTransferRecorded}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("sackTransferRecorded", "हस्तांतरित गोण्यांची नोंद")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="sackTransferCount">
                    २९.२ हस्तांतरित गोण्यांची संख्या
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="sackTransferCount"
                    id="sackTransferCount"
                    className={`form-control ${highlightedField === "sackTransferCount" ? "unfilled-field" : ""}`}
                    value={formData.sackTransferCount || ""}
                    onChange={handleNumberChange}
                    onFocus={() => handleFocus("sackTransferCount", "हस्तांतरित गोण्यांची संख्या")}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="currentFoodMaterials">
                    ३०. सध्याचे अन्न साहित्य
                  </label>
                  <textarea
                    name="currentFoodMaterials"
                    id="currentFoodMaterials"
                    className={`form-control ${highlightedField === "currentFoodMaterials" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.currentFoodMaterials || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("currentFoodMaterials", "सध्याचे अन्न साहित्य")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Row 11 */}
              <div className="row">
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="snehTithiProgram">
                    ३१. स्नेहभोजन/तिथीभोजन कार्यक्रम राबवले आहेत काय?
                  </label>
                  <select
                    name="snehTithiProgram"
                    id="snehTithiProgram"
                    className={`form-control ${highlightedField === "snehTithiProgram" ? "unfilled-field" : ""}`}
                    value={formData.snehTithiProgram === null ? "" : formData.snehTithiProgram}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("snehTithiProgram", "स्नेहभोजन/तिथीभोजन कार्यक्रम")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="snehTithiProgramDetails">
                    ३१.१ स्नेह तिथी कार्यक्रम तपशील
                  </label>
                  <textarea
                    name="snehTithiProgramDetails"
                    id="snehTithiProgramDetails"
                    className={`form-control ${highlightedField === "snehTithiProgramDetails" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.snehTithiProgramDetails || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("snehTithiProgramDetails", "स्नेह तिथी कार्यक्रम तपशील")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="corruptionDetails">
                    ३२. भ्रष्टाचार तपशील
                  </label>
                  <textarea
                    name="corruptionDetails"
                    id="corruptionDetails"
                    className={`form-control ${highlightedField === "corruptionDetails" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.corruptionDetails || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("corruptionDetails", "भ्रष्टाचार तपशील")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="corruptionActionDetails">
                    ३२.१ भ्रष्टाचार कारवाई तपशील
                  </label>
                  <textarea
                    name="corruptionActionDetails"
                    id="corruptionActionDetails"
                    className={`form-control ${highlightedField === "corruptionActionDetails" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.corruptionActionDetails || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("corruptionActionDetails", "भ्रष्टाचार कारवाई तपशील")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
              </div>

              {/* Row 12 */}
              <div className="row">
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="fieldOfficerVisits">
                    ३३. क्षेत्रीय अधिकाऱ्यांच्या भेटी झालेल्या आहेत काय?
                  </label>
                  <select
                    name="fieldOfficerVisits"
                    id="fieldOfficerVisits"
                    className={`form-control ${highlightedField === "fieldOfficerVisits" ? "unfilled-field" : ""}`}
                    value={formData.fieldOfficerVisits === null ? "" : formData.fieldOfficerVisits}
                    onChange={handleBinaryChange}
                    onFocus={() => handleFocus("fieldOfficerVisits", "क्षेत्रीय अधिकाऱ्यांच्या भेटी")}
                    onBlur={handleBlur}
                    required
                  >
                    <option value="">निवडा</option>
                    <option value="1">होय</option>
                    <option value="0">नाही</option>
                  </select>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="fieldOfficerVisitDetails">
                    ३३.१ फील्ड अधिकारी भेट तपशील
                  </label>
                  <textarea
                    name="fieldOfficerVisitDetails"
                    id="fieldOfficerVisitDetails"
                    className={`form-control ${highlightedField === "fieldOfficerVisitDetails" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.fieldOfficerVisitDetails || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("fieldOfficerVisitDetails", "फील्ड अधिकारी भेट तपशील")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
                <div className="col-md-3 form-group">
                  <label className="d-block text-start" style={{ marginBottom: "8px" }} htmlFor="schemeSuggestions">
                    ३४. योजनेच्या सूचना
                  </label>
                  <textarea
                    name="schemeSuggestions"
                    id="schemeSuggestions"
                    className={`form-control ${highlightedField === "schemeSuggestions" ? "unfilled-field" : ""}`}
                    style={{ height: "60px", width: "100%" }}
                    value={formData.schemeSuggestions || ""}
                    onChange={handleTextChange}
                    onFocus={() => handleFocus("schemeSuggestions", "योजनेच्या सूचना")}
                    onBlur={handleBlur}
                    required
                  ></textarea>
                </div>
              </div>
            </form>
            {focusMessage && <p className="focus-message">{focusMessage}</p>}
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

export default SchoolFormPage2;