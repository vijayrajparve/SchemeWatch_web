import React, { useState, useRef, useEffect } from "react";

const UpdateSchoolFormPage3 = ({
  formData,
  setFormData,
  handleChange,
  nextStep,
  prevStep,
}) => {
  const [fieldMessages, setFieldMessages] = useState({});
  const [highlightedField, setHighlightedField] = useState(null);
  const fieldRefs = useRef({});

  // Handler for binary (yes/no) fields
  const handleBinaryChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : Number(value),
    }));
    setFieldMessages((prev) => ({ ...prev, [name]: "" }));
  };

  // Handler for numeric fields
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      const numericValue = value === "" ? "" : Number(value);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      setFieldMessages((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handler for text fields
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldMessages((prev) => ({ ...prev, [name]: "" }));
  };

  // Handler for beneficiaries table
  const handleBeneficiaryChange = (year, field, value) => {
    if (/^\d*$/.test(value)) {
      const numericValue = value === "" ? "" : Number(value);
      setFormData((prev) => {
        const beneficiaries = prev.beneficiaries || {};
        const updatedBeneficiaries = {
          ...beneficiaries,
          [year]: {
            ...(beneficiaries[year] || { boys: "", girls: "", total: "" }),
            [field]: numericValue,
            total:
              (field === "boys"
                ? numericValue
                : beneficiaries[year]?.boys || 0) +
              (field === "girls"
                ? numericValue
                : beneficiaries[year]?.girls || 0),
          },
        };
        return {
          ...prev,
          beneficiaries: updatedBeneficiaries,
        };
      });
      setFieldMessages((prev) => ({ ...prev, [`${year}_${field}`]: "" }));
    }
  };

  // Handler for financial data table
  const handleFinancialChange = (year, field, value) => {
    if (/^\d*$/.test(value)) {
      const numericValue = value === "" ? "" : Number(value);
      setFormData((prev) => {
        const grantReceived = prev.grantReceived || {};
        const grantExpenditure = prev.grantExpenditure || {};
        const grantBalance = prev.grantBalance || {};
        const updatedField =
          field === "spent"
            ? "grantExpenditure"
            : field === "received"
            ? "grantReceived"
            : "grantBalance";
        return {
          ...prev,
          [updatedField]: {
            ...prev[updatedField],
            [year]: numericValue,
          },
          grantBalance: {
            ...grantBalance,
            [year]:
              (field === "received"
                ? numericValue
                : grantReceived[year] || 0) -
              (field === "spent"
                ? numericValue
                : grantExpenditure[year] || 0),
          },
        };
      });
      setFieldMessages((prev) => ({ ...prev, [`${year}_${field}`]: "" }));
    }
  };

  const displayValue = (value) =>
    value === "" || value === undefined || value === null ? "" : value;

  const handleFocus = (e) => {
    const { name, value } = e.target;
    const year = e.target.dataset.year;
    const field = e.target.dataset.field;
    const fieldName = year ? `${year}_${field}` : name;
    if (!value && value !== "0") {
      setFieldMessages((prev) => ({
        ...prev,
        [fieldName]: "Please fill this field",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const year = e.target.dataset.year;
    const field = e.target.dataset.field;
    const fieldName = year ? `${year}_${field}` : name;
    setFieldMessages((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const validateForm = () => {
    const missingFields = [];
    const requiredFields = [
      { key: "healthCheckupDone", label: "विद्यार्थ्यांची आरोग्य तपासणी" },
      { key: "healthCheckupStudentCount", label: "विद्यार्थ्यांची संख्या" },
      { key: "bmiRecorded", label: "BMI नोंद" },
      { key: "weightHeightMeasured", label: "वजन/उंची मोजमाप" },
      { key: "cookHealthCheck", label: "स्वयंपाकी आरोग्य तपासणी" },
      { key: "helper1Name", label: "सहाय्यक १ नाव" },
      { key: "helper2Name", label: "सहाय्यक २ नाव" },
      { key: "hasSmcResolution", label: "शालेय व्यवस्थापन समिती ठराव" },
      { key: "hasHealthCertificate", label: "आरोग्य प्रमाणपत्र" },
    ];

    requiredFields.forEach(({ key, label }) => {
      if (formData[key] === null || formData[key] === "" || formData[key] === undefined) {
        missingFields.push({ key, label });
      }
    });

    const years = ["2022-23", "2023-24", "2024-25"];
    years.forEach((year) => {
      if (!formData.beneficiaries?.[year]?.boys && formData.beneficiaries?.[year]?.boys !== 0) {
        missingFields.push({ key: `${year}_boys`, label: `${year} मुले` });
      }
      if (!formData.beneficiaries?.[year]?.girls && formData.beneficiaries?.[year]?.girls !== 0) {
        missingFields.push({ key: `${year}_girls`, label: `${year} मुली` });
      }
      if (!formData.grantReceived?.[year] && formData.grantReceived?.[year] !== 0) {
        missingFields.push({ key: `${year}_received`, label: `${year} जमा रक्कम` });
      }
      if (!formData.grantExpenditure?.[year] && formData.grantExpenditure?.[year] !== 0) {
        missingFields.push({ key: `${year}_spent`, label: `${year} खर्च रक्कम` });
      }
    });

    return missingFields;
  };

  const updateHighlightedField = () => {
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      setHighlightedField(missingFields[0].key);
      return missingFields[0].key;
    } else {
      setHighlightedField(null);
      return null;
    }
  };

  const handleNext = () => {
    setFieldMessages({});
    const missingFields = validateForm();
    if (missingFields.length > 0) {
      const fieldKey = missingFields[0].key;
      setHighlightedField(fieldKey);
      if (fieldRefs.current[fieldKey]) {
        fieldRefs.current[fieldKey].focus();
        setFieldMessages((prev) => ({
          ...prev,
          [fieldKey]: "Please fill this field",
        }));
      }
      return;
    }
    setHighlightedField(null);
    nextStep();
  };

  // CSS to hide number input arrows and highlight empty fields
  const inputStyle = {
    WebkitAppearance: "none",
    MozAppearance: "textfield",
    appearance: "textfield",
  };

  useEffect(() => {
    updateHighlightedField();
  }, [formData]);

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
      <div className="container mt-4" style={{ maxWidth: "1200px" }}>
        {/* Health Information */}
        <div className="card p-4 shadow-lg mb-4">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">आरोग्य विषयक माहिती</h3>
          </div>
          <div className="card-body">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row">
                <div className="col-md-6 form-group mb-3">
                  <label className="mb-2 d-block text-start">
                    १. विद्यार्थ्यांची आरोग्य तपासणी झाली का? 
                  </label>
                  <div className="d-flex align-items-center text-start">
                    <div className="form-check me-3">
                      <input
                        type="radio"
                        name="healthCheckupDone"
                        value="1"
                        className={`form-check-input ${highlightedField === "healthCheckupDone" ? "empty-field" : ""}`}
                        checked={formData.healthCheckupDone === 1}
                        onChange={handleBinaryChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        ref={(el) => (fieldRefs.current["healthCheckupDone"] = el)}
                        required
                      />
                      <label className="form-check-label ms-1">होय</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="healthCheckupDone"
                        value="0"
                        className={`form-check-input ${highlightedField === "healthCheckupDone" ? "empty-field" : ""}`}
                        checked={formData.healthCheckupDone === 0}
                        onChange={handleBinaryChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">नाही</label>
                    </div>
                  </div>
                  {fieldMessages.healthCheckupDone && (
                    <div className="field-message">{fieldMessages.healthCheckupDone}</div>
                  )}
                </div>
                <div className="col-md-6 form-group mb-3">
                  <label className="mb-2 d-block text-start">
                    १.१. विद्यार्थ्यांची संख्या 
                  </label>
                  <input
                    type="number"
                    name="healthCheckupStudentCount"
                    className={`form-control ${highlightedField === "healthCheckupStudentCount" ? "empty-field" : ""}`}
                    value={displayValue(formData.healthCheckupStudentCount)}
                    onChange={handleNumberChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={inputStyle}
                    ref={(el) => (fieldRefs.current["healthCheckupStudentCount"] = el)}
                    required
                    min="0"
                  />
                  {fieldMessages.healthCheckupStudentCount && (
                    <div className="field-message">{fieldMessages.healthCheckupStudentCount}</div>
                  )}
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-4 form-group mb-3">
                  <label className="mb-2 d-block text-start">
                    २. दर तीन महिन्याला BMI नोंद घेतली जाते काय?
                  </label>
                  <div className="d-flex align-items-center text-start">
                    <div className="form-check me-3">
                      <input
                        type="radio"
                        name="bmiRecorded"
                        value="1"
                        className={`form-check-input ${highlightedField === "bmiRecorded" ? "empty-field" : ""}`}
                        checked={formData.bmiRecorded === 1}
                        onChange={handleBinaryChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        ref={(el) => (fieldRefs.current["bmiRecorded"] = el)}
                        required
                      />
                      <label className="form-check-label ms-1">होय</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="bmiRecorded"
                        value="0"
                        className={`form-check-input ${highlightedField === "bmiRecorded" ? "empty-field" : ""}`}
                        checked={formData.bmiRecorded === 0}
                        onChange={handleBinaryChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">नाही</label>
                    </div>
                  </div>
                  {fieldMessages.bmiRecorded && (
                    <div className="field-message">{fieldMessages.bmiRecorded}</div>
                  )}
                </div>

                <div className="col-md-4 form-group mb-3">
                  <label className="mb-2 d-block text-start">
                    ३. वजन/उंची मोजमाप होते का?
                  </label>
                  <div className="d-flex align-items-center text-start">
                    <div className="form-check me-3">
                      <input
                        type="radio"
                        name="weightHeightMeasured"
                        value="1"
                        className={`form-check-input ${highlightedField === "weightHeightMeasured" ? "empty-field" : ""}`}
                        checked={formData.weightHeightMeasured === 1}
                        onChange={handleBinaryChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        ref={(el) => (fieldRefs.current["weightHeightMeasured"] = el)}
                        required
                      />
                      <label className="form-check-label ms-1">होय</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="weightHeightMeasured"
                        value="0"
                        className={`form-check-input ${highlightedField === "weightHeightMeasured" ? "empty-field" : ""}`}
                        checked={formData.weightHeightMeasured === 0}
                        onChange={handleBinaryChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">नाही</label>
                    </div>
                  </div>
                  {fieldMessages.weightHeightMeasured && (
                    <div className="field-message">{fieldMessages.weightHeightMeasured}</div>
                  )}
                </div>

                <div className="col-md-4 form-group mb-3">
                  <label className="mb-2 d-block text-start">
                    ४. स्वयंपाकी मदतनीस यांची आरोग्य तपासणी होते काय? 
                  </label>
                  <div className="d-flex align-items-center text-start">
                    <div className="form-check me-3">
                      <input
                        type="radio"
                        name="cookHealthCheck"
                        value="1"
                        className={`form-check-input ${highlightedField === "cookHealthCheck" ? "empty-field" : ""}`}
                        checked={formData.cookHealthCheck === 1}
                        onChange={handleBinaryChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        ref={(el) => (fieldRefs.current["cookHealthCheck"] = el)}
                        required
                      />
                      <label className="form-check-label ms-1">होय</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="cookHealthCheck"
                        value="0"
                        className={`form-check-input ${highlightedField === "cookHealthCheck" ? "empty-field" : ""}`}
                        checked={formData.cookHealthCheck === 0}
                        onChange={handleBinaryChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        required
                      />
                      <label className="form-check-label ms-1">नाही</label>
                    </div>
                  </div>
                  {fieldMessages.cookHealthCheck && (
                    <div className="field-message">{fieldMessages.cookHealthCheck}</div>
                  )}
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
              <div className="col-md-6 form-group mb-3">
                <label className="mb-2 d-block text-start">१. सहाय्यक १ नाव </label>
                <input
                  type="text"
                  name="helper1Name"
                  className={`form-control ${highlightedField === "helper1Name" ? "empty-field" : ""}`}
                  placeholder="नाव टाका"
                  value={formData.helper1Name || ""}
                  onChange={handleTextChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  ref={(el) => (fieldRefs.current["helper1Name"] = el)}
                  required
                />
                {fieldMessages.helper1Name && (
                  <div className="field-message">{fieldMessages.helper1Name}</div>
                )}
              </div>
              <div className="col-md-6 form-group mb-3">
                <label className="mb-2 d-block text-start">२. सहाय्यक २ नाव </label>
                <input
                  type="text"
                  name="helper2Name"
                  className={`form-control ${highlightedField === "helper2Name" ? "empty-field" : ""}`}
                  placeholder="नाव टाका"
                  value={formData.helper2Name || ""}
                  onChange={handleTextChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  ref={(el) => (fieldRefs.current["helper2Name"] = el)}
                  required
                />
                {fieldMessages.helper2Name && (
                  <div className="field-message">{fieldMessages.helper2Name}</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 form-group mb-3">
                <label className="mb-2 d-block text-start">
                  ३. शालेय व्यवस्थापन समिती ठराव 
                </label>
                <div className="d-flex align-items-center text-start">
                  <div className="form-check me-3">
                    <input
                      type="radio"
                      name="hasSmcResolution"
                      value="1"
                      className={`form-check-input ${highlightedField === "hasSmcResolution" ? "empty-field" : ""}`}
                      checked={formData.hasSmcResolution === 1}
                      onChange={handleBinaryChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      ref={(el) => (fieldRefs.current["hasSmcResolution"] = el)}
                      required
                    />
                    <label className="form-check-label ms-1">होय</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="hasSmcResolution"
                      value="0"
                      className={`form-check-input ${highlightedField === "hasSmcResolution" ? "empty-field" : ""}`}
                      checked={formData.hasSmcResolution === 0}
                      onChange={handleBinaryChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                    />
                    <label className="form-check-label ms-1">नाही</label>
                  </div>
                </div>
                {fieldMessages.hasSmcResolution && (
                  <div className="field-message">{fieldMessages.hasSmcResolution}</div>
                )}
              </div>
              <div className="col-md-6 form-group mb-3">
                <label className="mb-2 d-block text-start">
                  ४. दर सहा महिन्यास आरोग्य प्रमाणपत्र 
                </label>
                <div className="d-flex align-items-center text-start">
                  <div className="form-check me-3">
                    <input
                      type="radio"
                      name="hasHealthCertificate"
                      value="1"
                      className={`form-check-input ${highlightedField === "hasHealthCertificate" ? "empty-field" : ""}`}
                      checked={formData.hasHealthCertificate === 1}
                      onChange={handleBinaryChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      ref={(el) => (fieldRefs.current["hasHealthCertificate"] = el)}
                      required
                    />
                    <label className="form-check-label ms-1">होय</label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="hasHealthCertificate"
                      value="0"
                      className={`form-check-input ${highlightedField === "hasHealthCertificate" ? "empty-field" : ""}`}
                      checked={formData.hasHealthCertificate === 0}
                      onChange={handleBinaryChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      required
                    />
                    <label className="form-check-label ms-1">नाही</label>
                  </div>
                </div>
                {fieldMessages.hasHealthCertificate && (
                  <div className="field-message">{fieldMessages.hasHealthCertificate}</div>
                )}
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
                      type="number"
                      className={`form-control ${highlightedField === "2022-23_boys" ? "empty-field" : ""}`}
                      placeholder="मुले"
                      value={displayValue(formData.beneficiaries?.["2022-23"]?.boys)}
                      onChange={(e) =>
                        handleBeneficiaryChange("2022-23", "boys", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2022-23"
                      data-field="boys"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2022-23_boys"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2022-23_boys"] && (
                      <div className="field-message">{fieldMessages["2022-23_boys"]}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${highlightedField === "2022-23_girls" ? "empty-field" : ""}`}
                      placeholder="मुली"
                      value={displayValue(formData.beneficiaries?.["2022-23"]?.girls)}
                      onChange={(e) =>
                        handleBeneficiaryChange("2022-23", "girls", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2022-23"
                      data-field="girls"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2022-23_girls"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2022-23_girls"] && (
                      <div className="field-message">{fieldMessages["2022-23_girls"]}</div>
                    )}
                  </td>
                  <td>{displayValue(formData.beneficiaries?.["2022-23"]?.total)}</td>
                </tr>
                <tr>
                  <td>2023-24</td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${highlightedField === "2023-24_boys" ? "empty-field" : ""}`}
                      placeholder="मुले"
                      value={displayValue(formData.beneficiaries?.["2023-24"]?.boys)}
                      onChange={(e) =>
                        handleBeneficiaryChange("2023-24", "boys", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2023-24"
                      data-field="boys"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2023-24_boys"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2023-24_boys"] && (
                      <div className="field-message">{fieldMessages["2023-24_boys"]}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${highlightedField === "2023-24_girls" ? "empty-field" : ""}`}
                      placeholder="मुली"
                      value={displayValue(formData.beneficiaries?.["2023-24"]?.girls)}
                      onChange={(e) =>
                        handleBeneficiaryChange("2023-24", "girls", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2023-24"
                      data-field="girls"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2023-24_girls"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2023-24_girls"] && (
                      <div className="field-message">{fieldMessages["2023-24_girls"]}</div>
                    )}
                  </td>
                  <td>{displayValue(formData.beneficiaries?.["2023-24"]?.total)}</td>
                </tr>
                <tr>
                  <td>2024-25</td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${highlightedField === "2024-25_boys" ? "empty-field" : ""}`}
                      placeholder="मुले"
                      value={displayValue(formData.beneficiaries?.["2024-25"]?.boys)}
                      onChange={(e) =>
                        handleBeneficiaryChange("2024-25", "boys", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2024-25"
                      data-field="boys"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2024-25_boys"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2024-25_boys"] && (
                      <div className="field-message">{fieldMessages["2024-25_boys"]}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${highlightedField === "2024-25_girls" ? "empty-field" : ""}`}
                      placeholder="मुली"
                      value={displayValue(formData.beneficiaries?.["2024-25"]?.girls)}
                      onChange={(e) =>
                        handleBeneficiaryChange("2024-25", "girls", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2024-25"
                      data-field="girls"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2024-25_girls"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2024-25_girls"] && (
                      <div className="field-message">{fieldMessages["2024-25_girls"]}</div>
                    )}
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
                  <th className="text-start">
                    शाळेच्या बँक खात्यावर जमा झालेल्या अनुदानाची रक्कम
                  </th>
                  <th className="text-start">एकूण खर्च रक्कम</th>
                  <th className="text-start">शिल्लक रक्कम</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2022-23</td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${highlightedField === "2022-23_received" ? "empty-field" : ""}`}
                      placeholder="जमा रक्कम"
                      value={displayValue(formData.grantReceived?.["2022-23"])}
                      onChange={(e) =>
                        handleFinancialChange("2022-23", "received", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2022-23"
                      data-field="received"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2022-23_received"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2022-23_received"] && (
                      <div className="field-message">{fieldMessages["2022-23_received"]}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${highlightedField === "2022-貴-23_spent" ? "empty-field" : ""}`}
                      placeholder="खर्च रक्कम"
                      value={displayValue(formData.grantExpenditure?.["2022-23"])}
                      onChange={(e) =>
                        handleFinancialChange("2022-23", "spent", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2022-23"
                      data-field="spent"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2022-23_spent"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2022-23_spent"] && (
                      <div className="field-message">{fieldMessages["2022-23_spent"]}</div>
                    )}
                  </td>
                  <td>{displayValue(formData.grantBalance?.["2022-23"])}</td>
                </tr>
                <tr>
                  <td>2023-24</td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${highlightedField === "2023-24_received" ? "empty-field" : ""}`}
                      placeholder="जमा रक्कम"
                      value={displayValue(formData.grantReceived?.["2023-24"])}
                      onChange={(e) =>
                        handleFinancialChange("2023-24", "received", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2023-24"
                      data-field="received"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2023-24_received"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2023-24_received"] && (
                      <div className="field-message">{fieldMessages["2023-24_received"]}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${highlightedField === "2023-24_spent" ? "empty-field" : ""}`}
                      placeholder="खर्च रक्कम"
                      value={displayValue(formData.grantExpenditure?.["2023-24"])}
                      onChange={(e) =>
                        handleFinancialChange("2023-24", "spent", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2023-24"
                      data-field="spent"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2023-24_spent"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2023-24_spent"] && (
                      <div className="field-message">{fieldMessages["2023-24_spent"]}</div>
                    )}
                  </td>
                  <td>{displayValue(formData.grantBalance?.["2023-24"])}</td>
                </tr>
                <tr>
                  <td>2024-25</td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${highlightedField === "2024-25_received" ? "empty-field" : ""}`}
                      placeholder="जमा रक्कम"
                      value={displayValue(formData.grantReceived?.["2024-25"])}
                      onChange={(e) =>
                        handleFinancialChange("2024-25", "received", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2024-25"
                      data-field="received"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2024-25_received"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2024-25_received"] && (
                      <div className="field-message">{fieldMessages["2024-25_received"]}</div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      className={`form-control ${highlightedField === "2024-25_spent" ? "empty-field" : ""}`}
                      placeholder="खर्च रक्कम"
                      value={displayValue(formData.grantExpenditure?.["2024-25"])}
                      onChange={(e) =>
                        handleFinancialChange("2024-25", "spent", e.target.value)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      data-year="2024-25"
                      data-field="spent"
                      style={inputStyle}
                      ref={(el) => (fieldRefs.current["2024-25_spent"] = el)}
                      required
                      min="0"
                    />
                    {fieldMessages["2024-25_spent"] && (
                      <div className="field-message">{fieldMessages["2024-25_spent"]}</div>
                    )}
                  </td>
                  <td>{displayValue(formData.grantBalance?.["2024-25"])}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="text-center mt-4">
          <button
            type="button"
            className="btn btn-primary btn-lg me-2"
            onClick={prevStep}
          >
            मागे जा
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleNext}
          >
            पुढे चला
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateSchoolFormPage3;