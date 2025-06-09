import React, { useEffect } from "react";

const SchoolFormPage3 = ({ formData, setFormData, nextStep, prevStep }) => {
  const [highlightedField, setHighlightedField] = React.useState(null);
  const [focusMessage, setFocusMessage] = React.useState("");

  // Initialize formData if undefined
  useEffect(() => {
    const defaultFormData = {
      healthCheckupDone: null,
      healthCheckupStudentCount: "",
      bmiRecorded: null,
      weightHeightMeasured: null,
      cookHealthCheck: null,
      helper1Name: "",
      helper2Name: "",
      hasSmcResolution: null,
      hasHealthCertificate: null,
      udiseNumber: "",
      mobileNumber: "",
      beneficiaries: {
        "2022-23": { boys: "", girls: "", total: 0 },
        "2023-24": { boys: "", girls: "", total: 0 },
        "2024-25": { boys: "", girls: "", total: 0 },
      },
      grantReceived: { "2022-23": "", "2023-24": "", "2024-25": "" },
      grantExpenditure: { "2022-23": "", "2023-24": "", "2024-25": "" },
      grantBalance: { "2022-23": 0, "2023-24": 0, "2024-25": 0 },
    };

    // Only update if critical fields are missing
    if (
      !formData.beneficiaries ||
      !formData.grantReceived ||
      !formData.grantExpenditure ||
      Object.keys(formData.beneficiaries).length === 0
    ) {
      setFormData((prev) => ({ ...prev, ...defaultFormData }));
    }
  }, [formData, setFormData]);

  // Handler for binary (yes/no) fields
  const handleBinaryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
    if (highlightedField === name) {
      setHighlightedField(null);
      setFocusMessage("");
    }
  };

  // Handler for numeric fields
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
      }
    }
  };

  // Handler for text fields
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (highlightedField === name && value) {
      setHighlightedField(null);
      setFocusMessage("");
    }
  };

  // Handler for UDISE and mobile with length validation
  const handleRestrictedNumberChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      if (name === "udiseNumber" && value.length <= 11) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      } else if (name === "mobileNumber" && value.length <= 10) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
      if (highlightedField === name && value) {
        setHighlightedField(null);
        setFocusMessage("");
      }
    }
  };

  // Handler for beneficiaries table
  const handleBeneficiaryChange = (year, field, value) => {
    if (/^\d*$/.test(value)) {
      setFormData((prev) => {
        const updatedBeneficiaries = {
          ...prev.beneficiaries,
          [year]: {
            ...prev.beneficiaries[year],
            [field]: value,
            total:
              (field === "boys" ? Number(value || 0) : Number(prev.beneficiaries[year].boys || 0)) +
              (field === "girls" ? Number(value || 0) : Number(prev.beneficiaries[year].girls || 0)),
          },
        };
        return {
          ...prev,
          beneficiaries: updatedBeneficiaries,
        };
      });
      const fieldKey = `beneficiaries_${year}_${field}`;
      if (highlightedField === fieldKey && value) {
        setHighlightedField(null);
        setFocusMessage("");
      }
    }
  };

  // Handler for financial data table
  const handleFinancialChange = (year, field, value) => {
    if (/^\d*$/.test(value)) {
      const updatedField = field === "spent" ? "grantExpenditure" : "grantReceived";
      setFormData((prev) => ({
        ...prev,
        [updatedField]: {
          ...prev[updatedField],
          [year]: value,
        },
        grantBalance: {
          ...prev.grantBalance,
          [year]:
            (field === "received" ? Number(value || 0) : Number(prev.grantReceived[year] || 0)) -
            (field === "spent" ? Number(value || 0) : Number(prev.grantExpenditure[year] || 0)),
        },
      }));
      const fieldKey = `${updatedField}_${year}`;
      if (highlightedField === fieldKey && value) {
        setHighlightedField(null);
        setFocusMessage("");
      }
    }
  };

  const displayValue = (value) => (value === "" || value === undefined || value === null ? "" : value);

  // Simplified validation function
  const validateForm = () => {
    console.log("Validating formData:", JSON.stringify(formData, null, 2));

    // Main fields
    if (formData.healthCheckupDone === null || formData.healthCheckupDone === undefined) {
      console.log("Validation failed: healthCheckupDone is empty");
      return { key: "healthCheckupDone", label: "विद्यार्थ्यांची आरोग्य तपासणी" };
    }
    if (!formData.healthCheckupStudentCount) {
      console.log("Validation failed: healthCheckupStudentCount is empty");
      return { key: "healthCheckupStudentCount", label: "विद्यार्थ्यांची संख्या" };
    }
    if (formData.bmiRecorded === null || formData.bmiRecorded === undefined) {
      console.log("Validation failed: bmiRecorded is empty");
      return { key: "bmiRecorded", label: "BMI नोंद" };
    }
    if (formData.weightHeightMeasured === null || formData.weightHeightMeasured === undefined) {
      console.log("Validation failed: weightHeightMeasured is empty");
      return { key: "weightHeightMeasured", label: "वजन/उंची मोजमाप" };
    }
    if (formData.cookHealthCheck === null || formData.cookHealthCheck === undefined) {
      console.log("Validation failed: cookHealthCheck is empty");
      return { key: "cookHealthCheck", label: "स्वयंपाकी मदतनीस आरोग्य तपासणी" };
    }
    if (!formData.helper1Name) {
      console.log("Validation failed: helper1Name is empty");
      return { key: "helper1Name", label: "सहाय्यक १ नाव" };
    }
    if (formData.hasSmcResolution === null || formData.hasSmcResolution === undefined) {
      console.log("Validation failed: hasSmcResolution is empty");
      return { key: "hasSmcResolution", label: "शालेय व्यवस्थापन समिती ठराव" };
    }
    if (formData.hasHealthCertificate === null || formData.hasHealthCertificate === undefined) {
      console.log("Validation failed: hasHealthCertificate is empty");
      return { key: "hasHealthCertificate", label: "आरोग्य प्रमाणपत्र" };
    }
    

    // Beneficiary fields
    const years = ["2022-23", "2023-24", "2024-25"];
    for (const year of years) {
      if (!formData.beneficiaries?.[year]?.boys) {
        const key = `beneficiaries_${year}_boys`;
        console.log(`Validation failed: ${key} is empty`);
        return { key, label: `${year} मुले` };
      }
      if (!formData.beneficiaries?.[year]?.girls) {
        const key = `beneficiaries_${year}_girls`;
        console.log(`Validation failed: ${key} is empty`);
        return { key, label: `${year} मुली` };
      }
    }

    // Financial fields
    for (const year of years) {
      if (!formData.grantReceived?.[year]) {
        const key = `grantReceived_${year}`;
        console.log(`Validation failed: ${key} is empty`);
        return { key, label: `${year} जमा रक्कम` };
      }
      if (!formData.grantExpenditure?.[year]) {
        const key = `grantExpenditure_${year}`;
        console.log(`Validation failed: ${key} is empty`);
        return { key, label: `${year} खर्च रक्कम` };
      }
    }

    console.log("Validation passed");
    return null;
  };

  // Next step handler with validation
  const handleNext = () => {
    console.log("handleNext triggered, formData:", JSON.stringify(formData, null, 2));
    const validationError = validateForm();
    if (validationError) {
      console.log("Validation error:", validationError);
      setHighlightedField(validationError.key);
      setFocusMessage(`कृपया ${validationError.label} भरा`);
      const element = document.getElementById(validationError.key);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      } else {
        console.warn(`Element with id ${validationError.key} not found`);
      }
      return;
    }
    console.log("No validation errors, proceeding to next step");
    setHighlightedField(null);
    setFocusMessage("");
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

  // CSS to hide number input arrows and highlight unfilled fields
  const inputStyle = {
    WebkitAppearance: "none",
    MozAppearance: "textfield",
    appearance: "textfield",
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
      <div className="container mt-4" style={{ maxWidth: "1200px" }}>
        {/* Health Information */}
        <div className="card p-4 shadow-lg mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">आरोग्य विषयक माहिती</h3>
          </div>
          <div className="card-body">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row">
                <div className="col-md-6 form-group">
                  <label className="mb-2 d-block text-start">१. विद्यार्थ्यांची आरोग्य तपासणी झाली का?</label>
                  <div className="d-flex align-items-center text-start">
                    <div className="form-check me-3">
                      <input
                        type="radio"
                        name="healthCheckupDone"
                        id="healthCheckupDone_yes"
                        value="1"
                        className={`form-check-input ${highlightedField === "healthCheckupDone" ? "unfilled-field" : ""}`}
                        checked={formData.healthCheckupDone === 1}
                        onChange={handleBinaryChange}
                        onFocus={() => handleFocus("healthCheckupDone", "विद्यार्थ्यांची आरोग्य तपासणी")}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">होय</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="healthCheckupDone"
                        id="healthCheckupDone_no"
                        value="0"
                        className={`form-check-input ${highlightedField === "healthCheckupDone" ? "unfilled-field" : ""}`}
                        checked={formData.healthCheckupDone === 0}
                        onChange={handleBinaryChange}
                        onFocus={() => handleFocus("healthCheckupDone", "विद्यार्थ्यांची आरोग्य तपासणी")}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">नाही</label>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 form-group">
                  <label className="mb-2 d-block text-start">१.१. विद्यार्थ्यांची संख्या </label>
                  <input
                    type="text"
                    name="healthCheckupStudentCount"
                    id="healthCheckupStudentCount"
                    className={`form-control ${highlightedField === "healthCheckupStudentCount" ? "unfilled-field" : ""}`}
                    value={displayValue(formData.healthCheckupStudentCount)}
                    onChange={handleNumberChange}
                    onFocus={() => handleFocus("healthCheckupStudentCount", "विद्यार्थ्यांची संख्या")}
                    onBlur={handleBlur}
                    style={inputStyle}
                    required
                  />
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-4 form-group">
                  <label className="mb-2 d-block text-start">२. दर तीन महिन्याला BMI नोंद घेतली जाते काय? </label>
                  <div className="d-flex align-items-center text-start">
                    <div className="form-check me-3">
                      <input
                        type="radio"
                        name="bmiRecorded"
                        id="bmiRecorded_yes"
                        value="1"
                        className={`form-check-input ${highlightedField === "bmiRecorded" ? "unfilled-field" : ""}`}
                        checked={formData.bmiRecorded === 1}
                        onChange={handleBinaryChange}
                        onFocus={() => handleFocus("bmiRecorded", "BMI नोंद")}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">होय</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="bmiRecorded"
                        id="bmiRecorded_no"
                        value="0"
                        className={`form-check-input ${highlightedField === "bmiRecorded" ? "unfilled-field" : ""}`}
                        checked={formData.bmiRecorded === 0}
                        onChange={handleBinaryChange}
                        onFocus={() => handleFocus("bmiRecorded", "BMI नोंद")}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">नाही</label>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 form-group">
                  <label className="mb-2 d-block text-start">३. वजन/उंची मोजमाप होते का? </label>
                  <div className="d-flex align-items-center text-start">
                    <div className="form-check me-3">
                      <input
                        type="radio"
                        name="weightHeightMeasured"
                        id="weightHeightMeasured_yes"
                        value="1"
                        className={`form-check-input ${highlightedField === "weightHeightMeasured" ? "unfilled-field" : ""}`}
                        checked={formData.weightHeightMeasured === 1}
                        onChange={handleBinaryChange}
                        onFocus={() => handleFocus("weightHeightMeasured", "वजन/उंची मोजमाप")}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">होय</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="weightHeightMeasured"
                        id="weightHeightMeasured_no"
                        value="0"
                        className={`form-check-input ${highlightedField === "weightHeightMeasured" ? "unfilled-field" : ""}`}
                        checked={formData.weightHeightMeasured === 0}
                        onChange={handleBinaryChange}
                        onFocus={() => handleFocus("weightHeightMeasured", "वजन/उंची मोजमाप")}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">नाही</label>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 form-group">
                  <label className="mb-2 d-block text-start">४. स्वयंपाकी मदतनीस यांची आरोग्य तपासणी होते काय?</label>
                  <div className="d-flex align-items-center text-start">
                    <div className="form-check me-3">
                      <input
                        type="radio"
                        name="cookHealthCheck"
                        id="cookHealthCheck_yes"
                        value="1"
                        className={`form-check-input ${highlightedField === "cookHealthCheck" ? "unfilled-field" : ""}`}
                        checked={formData.cookHealthCheck === 1}
                        onChange={handleBinaryChange}
                        onFocus={() => handleFocus("cookHealthCheck", "स्वयंपाकी मदतनीस आरोग्य तपासणी")}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">होय</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="cookHealthCheck"
                        id="cookHealthCheck_no"
                        value="0"
                        className={`form-check-input ${highlightedField === "cookHealthCheck" ? "unfilled-field" : ""}`}
                        checked={formData.cookHealthCheck === 0}
                        onChange={handleBinaryChange}
                        onFocus={() => handleFocus("cookHealthCheck", "स्वयंपाकी मदतनीस आरोग्य तपासणी")}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">नाही</label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Helper Details */}
        <div className="card p-4 shadow-lg mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">स्वयंपाकी/मदतनीस तपशील</h3>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6 form-group">
                <label className="mb-2 d-block text-start">१.सहाय्यक नाव</label>
                <input
                  type="text"
                  name="helper1Name"
                  id="helper1Name"
                  className={`form-control ${highlightedField === "helper1Name" ? "unfilled-field" : ""}`}
                  placeholder="नाव टाका"
                  value={displayValue(formData.helper1Name)}
                  onChange={handleTextChange}
                  onFocus={() => handleFocus("helper1Name", "सहाय्यक १ नाव")}
                  onBlur={handleBlur}
                  required
                />
              </div>
              <div className="col-md-6 form-group">
                <label className="mb-2 d-block text-start">२.सहाय्यक नाव</label>
                <input
                  type="text"
                  name="helper2Name"
                  id="helper2Name"
                  className="form-control"
                  placeholder="नाव टाका"
                  value={displayValue(formData.helper2Name)}
                  onChange={handleTextChange}
                  onFocus={() => handleFocus("helper2Name", "सहाय्यक २ नाव")}
                  onBlur={handleBlur}
                  
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 form-group">
                <label className="mb-2 d-block text-start">३.शालेय व्यवस्थापन समिती ठराव </label>
                <div className="d-flex align-items-center text-start">
                  <div className="form-check me-3">
                    <input
                      type="radio"
                      name="hasSmcResolution"
                      id="hasSmcResolution_yes"
                      value="1"
                      className={`form-check-input ${highlightedField === "hasSmcResolution" ? "unfilled-field" : ""}`}
                      checked={formData.hasSmcResolution === 1}
                      onChange={handleBinaryChange}
                      onFocus={() => handleFocus("hasSmcResolution", "शालेय व्यवस्थापन समिती ठराव")}
                      onBlur={handleBlur}
                      required
                    />
                    <label className="form-check-label ms-1">होय</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="hasSmcResolution"
                      id="hasSmcResolution_no"
                      value="0"
                      className={`form-check-input ${highlightedField === "hasSmcResolution" ? "unfilled-field" : ""}`}
                      checked={formData.hasSmcResolution === 0}
                      onChange={handleBinaryChange}
                      onFocus={() => handleFocus("hasSmcResolution", "शालेय व्यवस्थापन समिती ठराव")}
                      onBlur={handleBlur}
                      required
                    />
                    <label className="form-check-label ms-1">नाही</label>
                  </div>
                </div>
              </div>
              <div className="col-md-6 form-group">
                <label className="mb-2 d-block text-start">४.दर सहा महिन्यास आरोग्य प्रमाणपत्र </label>
                <div className="d-flex align-items-center text-start">
                  <div className="form-check me-3">
                    <input
                      type="radio"
                      name="hasHealthCertificate"
                      id="hasHealthCertificate_yes"
                      value="1"
                      className={`form-check-input ${highlightedField === "hasHealthCertificate" ? "unfilled-field" : ""}`}
                      checked={formData.hasHealthCertificate === 1}
                      onChange={handleBinaryChange}
                      onFocus={() => handleFocus("hasHealthCertificate", "आरोग्य प्रमाणपत्र")}
                      onBlur={handleBlur}
                      required
                    />
                    <label className="form-check-label ms-1">होय</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="hasHealthCertificate"
                      id="hasHealthCertificate_no"
                      value="0"
                      className={`form-check-input ${highlightedField === "hasHealthCertificate" ? "unfilled-field" : ""}`}
                      checked={formData.hasHealthCertificate === 0}
                      onChange={handleBinaryChange}
                      onFocus={() => handleFocus("hasHealthCertificate", "आरोग्य प्रमाणपत्र")}
                      onBlur={handleBlur}
                      required
                    />
                    <label className="form-check-label ms-1">नाही</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficiaries */}
        <div className="card p-4 shadow-lg mb-4">
          <div className="card-header bg-primary text-white">
            <h3>गेल्या तीन वर्षांमध्ये योजनेंतर्गत लाभ दिलेल्या लाभार्थ्यांची संख्या</h3>
          </div>
          <div className="card-body">
            <table className="table table-bordered text-center">
              <thead className="table-secondary">
                <tr>
                  <th className="text-start">वर्ष</th>
                  <th className="text-start">मुले</th>
                  <th className="text-start">मुली</th>
                  <th className="text-start">एकूण</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2022-23</td>
                  <td>
                    <input
                      type="text"
                      id="beneficiaries_2022-23_boys"
                      className={`form-control ${highlightedField === "beneficiaries_2022-23_boys" ? "unfilled-field" : ""}`}
                      placeholder="मुले"
                      value={displayValue(formData.beneficiaries?.["2022-23"]?.boys)}
                      onChange={(e) => handleBeneficiaryChange("2022-23", "boys", e.target.value)}
                      onFocus={() => handleFocus("beneficiaries_2022-23_boys", "2022-23 मुले")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="beneficiaries_2022-23_girls"
                      className={`form-control ${highlightedField === "beneficiaries_2022-23_girls" ? "unfilled-field" : ""}`}
                      placeholder="मुली"
                      value={displayValue(formData.beneficiaries?.["2022-23"]?.girls)}
                      onChange={(e) => handleBeneficiaryChange("2022-23", "girls", e.target.value)}
                      onFocus={() => handleFocus("beneficiaries_2022-23_girls", "2022-23 मुली")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>{displayValue(formData.beneficiaries?.["2022-23"]?.total)}</td>
                </tr>
                <tr>
                  <td>2023-24</td>
                  <td>
                    <input
                      type="text"
                      id="beneficiaries_2023-24_boys"
                      className={`form-control ${highlightedField === "beneficiaries_2023-24_boys" ? "unfilled-field" : ""}`}
                      placeholder="मुले"
                      value={displayValue(formData.beneficiaries?.["2023-24"]?.boys)}
                      onChange={(e) => handleBeneficiaryChange("2023-24", "boys", e.target.value)}
                      onFocus={() => handleFocus("beneficiaries_2023-24_boys", "2023-24 मुले")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="beneficiaries_2023-24_girls"
                      className={`form-control ${highlightedField === "beneficiaries_2023-24_girls" ? "unfilled-field" : ""}`}
                      placeholder="मुली"
                      value={displayValue(formData.beneficiaries?.["2023-24"]?.girls)}
                      onChange={(e) => handleBeneficiaryChange("2023-24", "girls", e.target.value)}
                      onFocus={() => handleFocus("beneficiaries_2023-24_girls", "2023-24 मुली")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>{displayValue(formData.beneficiaries?.["2023-24"]?.total)}</td>
                </tr>
                <tr>
                  <td>2024-25</td>
                  <td>
                    <input
                      type="text"
                      id="beneficiaries_2024-25_boys"
                      className={`form-control ${highlightedField === "beneficiaries_2024-25_boys" ? "unfilled-field" : ""}`}
                      placeholder="मुले"
                      value={displayValue(formData.beneficiaries?.["2024-25"]?.boys)}
                      onChange={(e) => handleBeneficiaryChange("2024-25", "boys", e.target.value)}
                      onFocus={() => handleFocus("beneficiaries_2024-25_boys", "2024-25 मुले")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="beneficiaries_2024-25_girls"
                      className={`form-control ${highlightedField === "beneficiaries_2024-25_girls" ? "unfilled-field" : ""}`}
                      placeholder="मुली"
                      value={displayValue(formData.beneficiaries?.["2024-25"]?.girls)}
                      onChange={(e) => handleBeneficiaryChange("2024-25", "girls", e.target.value)}
                      onFocus={() => handleFocus("beneficiaries_2024-25_girls", "2024-25 मुली")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>{displayValue(formData.beneficiaries?.["2024-25"]?.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Details */}
        <div className="card p-4 shadow-lg mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">इंधन भाजीपाला व धान्यादी माल अनुदान तपशील</h3>
          </div>
          <div className="card-body">
            <table className="table table-bordered text-center">
              <thead className="table-secondary">
                <tr>
                  <th className="text-start">वर्ष</th>
                  <th className="text-start">शाळेच्या बँक खात्यावर जमा झालेल्या अनुदानाची रक्कम</th>
                  <th className="text-start">एकूण खर्च रक्कम</th>
                  <th className="text-start">शिल्लक रक्कम</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2022-23</td>
                  <td>
                    <input
                      type="text"
                      id="grantReceived_2022-23"
                      className={`form-control ${highlightedField === "grantReceived_2022-23" ? "unfilled-field" : ""}`}
                      placeholder="जमा रक्कम"
                      value={displayValue(formData.grantReceived?.["2022-23"])}
                      onChange={(e) => handleFinancialChange("2022-23", "received", e.target.value)}
                      onFocus={() => handleFocus("grantReceived_2022-23", "2022-23 जमा रक्कम")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="grantExpenditure_2022-23"
                      className={`form-control ${highlightedField === "grantExpenditure_2022-23" ? "unfilled-field" : ""}`}
                      placeholder="खर्च रक्कम"
                      value={displayValue(formData.grantExpenditure?.["2022-23"])}
                      onChange={(e) => handleFinancialChange("2022-23", "spent", e.target.value)}
                      onFocus={() => handleFocus("grantExpenditure_2022-23", "2022-23 खर्च रक्कम")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>{displayValue(formData.grantBalance?.["2022-23"])}</td>
                </tr>
                <tr>
                  <td>2023-24</td>
                  <td>
                    <input
                      type="text"
                      id="grantReceived_2023-24"
                      className={`form-control ${highlightedField === "grantReceived_2023-24" ? "unfilled-field" : ""}`}
                      placeholder="जमा रक्कम"
                      value={displayValue(formData.grantReceived?.["2023-24"])}
                      onChange={(e) => handleFinancialChange("2023-24", "received", e.target.value)}
                      onFocus={() => handleFocus("grantReceived_2023-24", "2023-24 जमा रक्कम")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="grantExpenditure_2023-24"
                      className={`form-control ${highlightedField === "grantExpenditure_2023-24" ? "unfilled-field" : ""}`}
                      placeholder="खर्च रक्कम"
                      value={displayValue(formData.grantExpenditure?.["2023-24"])}
                      onChange={(e) => handleFinancialChange("2023-24", "spent", e.target.value)}
                      onFocus={() => handleFocus("grantExpenditure_2023-24", "2023-24 खर्च रक्कम")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>{displayValue(formData.grantBalance?.["2023-24"])}</td>
                </tr>
                <tr>
                  <td>2024-25</td>
                  <td>
                    <input
                      type="text"
                      id="grantReceived_2024-25"
                      className={`form-control ${highlightedField === "grantReceived_2024-25" ? "unfilled-field" : ""}`}
                      placeholder="जमा रक्कम"
                      value={displayValue(formData.grantReceived?.["2024-25"])}
                      onChange={(e) => handleFinancialChange("2024-25", "received", e.target.value)}
                      onFocus={() => handleFocus("grantReceived_2024-25", "2024-25 जमा रक्कम")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      id="grantExpenditure_2024-25"
                      className={`form-control ${highlightedField === "grantExpenditure_2024-25" ? "unfilled-field" : ""}`}
                      placeholder="खर्च रक्कम"
                      value={displayValue(formData.grantExpenditure?.["2024-25"])}
                      onChange={(e) => handleFinancialChange("2024-25", "spent", e.target.value)}
                      onFocus={() => handleFocus("grantExpenditure_2024-25", "2024-25 खर्च रक्कम")}
                      onBlur={handleBlur}
                      style={inputStyle}
                      required
                    />
                  </td>
                  <td>{displayValue(formData.grantBalance?.["2024-25"])}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Focus Message */}
        {focusMessage && <p className="focus-message">{focusMessage}</p>}

        {/* Navigation Buttons */}
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

export default SchoolFormPage3;