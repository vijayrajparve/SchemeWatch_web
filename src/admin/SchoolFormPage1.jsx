import React from "react";
import { Form, Button, Alert, Row, Col, Card, FormCheck } from "react-bootstrap";
import DistrictTalukaSelector from "../components/DistrictTalukaSelector";
import { useNavigate } from "react-router-dom";
const SchoolFormPage1 = ({ nextStep, formData, setFormData }) => {
  const navigate = useNavigate();
  
  // Added formData and setFormData as props
  // Removed all local useState hooks since we'll use formData and setFormData
  const handleUdiseChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setFormData((prev) => ({ ...prev, udiseNumber: value }));
    }
  };

  const handlePhoneChange = (field) => (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleTeacherChange = (field, otherField, totalField) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numericValue = value === "" ? 0 : Number(value);
      const otherValue = Number(formData[otherField] || 0);
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        [totalField]: numericValue + otherValue,
      }));
    }
  };

  const handleStudentChange = (gradeKey, gender) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numericValue = value === "" ? 0 : Number(value);
      setFormData((prev) => {
        const otherGenderValue =
          gender === "female"
            ? prev.gradeStudents[gradeKey].male === "" || prev.gradeStudents[gradeKey].male === undefined
              ? 0
              : Number(prev.gradeStudents[gradeKey].male)
            : prev.gradeStudents[gradeKey].female === "" || prev.gradeStudents[gradeKey].female === undefined
              ? 0
              : Number(prev.gradeStudents[gradeKey].female);

        const updatedGrade = {
          ...prev.gradeStudents[gradeKey],
          [gender]: value,
          total: numericValue + otherGenderValue,
        };

        const allGrades = { ...prev.gradeStudents, [gradeKey]: updatedGrade };

        const totalGirls = Object.values(allGrades).reduce(
          (sum, grade) =>
            sum + (grade.female === "" || grade.female === undefined ? 0 : Number(grade.female)),
          0
        );
        const totalBoys = Object.values(allGrades).reduce(
          (sum, grade) => sum + (grade.male === "" || grade.male === undefined ? 0 : Number(grade.male)),
          0
        );

        return {
          ...prev,
          gradeStudents: allGrades,
          totalGirls,
          totalBoys,
          totalStudents: totalGirls + totalBoys,
        };
      });
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { key: formData.district, label: "जिल्हा" }, // Updated to use formData
      { key: formData.taluka, label: "तालुका" },
      { key: formData.schoolName, label: "शाळेचे नाव" },
      { key: formData.udiseNumber, label: "UDISE कोड" },
      { key: formData.inspectorName, label: "तपासणी करणाऱ्याचे नाव" },
      { key: formData.schoolFullName, label: "शाळेचे पूर्ण नाव" },
      { key: formData.inspectionDate, label: "तपासणी तारीख" },
      { key: formData.inspectionTime, label: "तपासणी वेळ" },
      { key: formData.headmasterName, label: "मुख्याध्यापकाचे नाव" },
      { key: formData.headmasterPhone, label: "मुख्याध्यापकाचा फोन" },
      { key: formData.headmasterAddress, label: "मुख्याध्यापकाचा पत्ता" },
      { key: formData.teacherMale, label: "शिक्षक संख्या - पुरुष" },
      { key: formData.teacherFemale, label: "शिक्षक संख्या - महिला" },
      { key: formData.hasMiddayMealBoard, label: "मध्यान्ह भोजन माहिती फलक" },
      { key: formData.hasMiddayMealMenu, label: "मध्यान्ह भोजन मेनू" },
      { key: formData.hasManagementBoard, label: "शाळा व्यवस्थापन समिती बोर्ड" },
      { key: formData.hasPrincipalContact, label: "मुख्याध्यापक संपर्क क्रमांक" },
      { key: formData.hasOfficerContact, label: "तालुका/जिल्हास्तरीय अधिकाऱ्यांचा क्रमांक" },
      { key: formData.hasComplaintBox, label: "मध्यान्ह भोजन तक्रार पेटी" },
      { key: formData.hasEmergencyNumber, label: "आपत्कालीन दूरध्वनी क्रमांक" },
      { key: formData.hasKitchenShed, label: "किचनशेड" },
      { key: formData.hasFirstAidBox, label: "प्राथमिक उपचार पेटी" },
      { key: formData.hasWaterSource, label: "पिण्याच्या पाण्याचे स्रोत" },
      { key: formData.hasFireExtinguisher, label: "अग्निशमन उपकरणे" },
    ];

    const missingFields = [];
    requiredFields.forEach(({ key, label }) => {
      if (key === null || key === "" || key === undefined) {
        missingFields.push(label);
      }
    });

    if (formData.udiseNumber && formData.udiseNumber.length !== 11) {
      missingFields.push("UDISE कोड (११ अंकी)");
    }

    if (formData.headmasterPhone && formData.headmasterPhone.length !== 10) {
      missingFields.push("मुख्याध्यापकाचा फोन (१० अंकी)");
    }

    if (formData.assistantTeacherPhone && formData.assistantTeacherPhone.length !== 10) {
      missingFields.push("सहाय्यक शिक्षकाचा फोन (१० अंकी)");
    }

    if (formData.hasWaterSource === "1") {
      if (!formData.waterSourceType) {
        missingFields.push("पाण्याचा स्रोत प्रकार");
      }
      if (formData.hasRegularWaterSupply === null) {
        missingFields.push("पाणी पुरवठा नियमित आहे का");
      }
    }

    if (formData.hasFireExtinguisher === "1") {
      if (formData.hasFireExtinguisherCheck === null) {
        missingFields.push("अग्निशामक तपासणी नोंद");
      }
      if (formData.hasFireExtinguisherRefill === null) {
        missingFields.push("अग्निशामक पुनर्भरण");
      }
    }

    if (formData.hasKitchenGarden === "1" && formData.usesGardenProduce === null) {
      missingFields.push("पालेभाज्या/फळे वापरले जातात का");
    }

    const grades = ["grade1to4", "grade5to7", "grade8to10"];
    grades.forEach((grade) => {
      if (formData.gradeStudents[grade].female === "" || formData.gradeStudents[grade].female === undefined) {
        missingFields.push(`इयत्ता ${grade === "grade1to4" ? "१-४" : grade === "grade5to7" ? "५-७" : "८-१०"} मुलींची संख्या`);
      }
      if (formData.gradeStudents[grade].male === "" || formData.gradeStudents[grade].male === undefined) {
        missingFields.push(`इयत्ता ${grade === "grade1to4" ? "१-४" : grade === "grade5to7" ? "५-७" : "८-१०"} मुलांची संख्या`);
      }
    });

    return missingFields.length > 0 ? missingFields : null;
  };

  const handleNext = () => {
    setFormData((prev) => ({ ...prev, errorMessage: "" })); // Updated to set errorMessage in formData
    const missingFields = validateForm();
    if (missingFields) {
      setFormData((prev) => ({
        ...prev,
        errorMessage: `कृपया खालील आवश्यक फील्ड भरा: ${missingFields.join(", ")}`,
      }));
      return;
    }
    nextStep();
  };

  return (
    <div className="container-xxl my-5">
      <Card className="p-4 shadow-lg w-100 mx-auto">
        <Card.Header className="bg-primary text-white">
          <h3>शाळेबद्दल माहिती</h3>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <DistrictTalukaSelector
                  districtLabel="जिल्हा"
                  talukaLabel="तालुका"
                  onSelectionChange={(selections) => setFormData((prev) => ({ ...prev, ...selections }))} // Updated to update formData
                  selections={{ district: formData.district, taluka: formData.taluka }} // Use formData for selections
                  districtId="school-district"
                  talukaId="school-taluka"
                />
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>शाळेचे नाव</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, schoolName: e.target.value }))} // Updated to update formData
                    required
                    isInvalid={formData.errorMessage?.includes("शाळेचे नाव")} // Updated to use formData.errorMessage
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया शाळेचे नाव भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>UDISE कोड</Form.Label>
                  <Form.Control
                    type="text"
                    name="udiseNumber"
                    value={formData.udiseNumber}
                    onChange={handleUdiseChange}
                    required
                    pattern="\d{11}"
                    title="UDISE कोड ११ अंकी असावा"
                    isInvalid={formData.errorMessage?.includes("UDISE कोड")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया ११ अंकी UDISE कोड भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>तपासणी करणाऱ्याचे नाव</Form.Label>
                  <Form.Control
                    type="text"
                    name="inspectorName"
                    value={formData.inspectorName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, inspectorName: e.target.value }))}
                    required
                    isInvalid={formData.errorMessage?.includes("तपासणी करणाऱ्याचे नाव")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया तपासणी करणाऱ्याचे नाव भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>शाळेचे पूर्ण नाव (संपूर्ण पत्त्यासह)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="schoolFullName"
                    value={formData.schoolFullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, schoolFullName: e.target.value }))}
                    required
                    isInvalid={formData.errorMessage?.includes("शाळेचे पूर्ण नाव")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया शाळेचे पूर्ण नाव भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>तपासणी तारीख</Form.Label>
                  <Form.Control
                    type="date"
                    name="inspectionDate"
                    value={formData.inspectionDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, inspectionDate: e.target.value }))}
                    required
                    isInvalid={formData.errorMessage?.includes("तपासणी तारीख")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया तपासणी तारीख भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>तपासणी वेळ</Form.Label>
                  <Form.Control
                    type="time"
                    name="inspectionTime"
                    value={formData.inspectionTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, inspectionTime: e.target.value }))}
                    required
                    isInvalid={formData.errorMessage?.includes("तपासणी वेळ")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया तपासणी वेळ भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>मुख्याध्यापकाचे नाव</Form.Label>
                  <Form.Control
                    type="text"
                    name="headmasterName"
                    value={formData.headmasterName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, headmasterName: e.target.value }))}
                    required
                    isInvalid={formData.errorMessage?.includes("मुख्याध्यापकाचे नाव")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया मुख्याध्यापकाचे नाव भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>मुख्याध्यापकाचा फोन</Form.Label>
                  <Form.Control
                    type="tel"
                    name="headmasterPhone"
                    value={formData.headmasterPhone}
                    onChange={handlePhoneChange("headmasterPhone")}
                    required
                    pattern="\d{10}"
                    title="मुख्याध्यापकाचा फोन १० अंकी असावा"
                    isInvalid={formData.errorMessage?.includes("मुख्याध्यापकाचा फोन")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया १० अंकी फोन नंबर भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>मुख्याध्यापकाचा पत्ता</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="headmasterAddress"
                    value={formData.headmasterAddress}
                    onChange={(e) => setFormData((prev) => ({ ...prev, headmasterAddress: e.target.value }))}
                    required
                    isInvalid={formData.errorMessage?.includes("मुख्याध्यापकाचा पत्ता")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया मुख्याध्यापकाचा पत्ता भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>सहाय्यक शिक्षकाचे नाव</Form.Label>
                  <Form.Control
                    type="text"
                    name="assistantTeacherName"
                    value={formData.assistantTeacherName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, assistantTeacherName: e.target.value }))}
                    required
                    isInvalid={formData.errorMessage?.includes("सहाय्यक शिक्षकाचे नाव")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया सहाय्यक शिक्षकाचे नाव भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>सहाय्यक शिक्षकाचा फोन</Form.Label>
                  <Form.Control
                    type="tel"
                    name="assistantTeacherPhone"
                    value={formData.assistantTeacherPhone}
                    onChange={handlePhoneChange("assistantTeacherPhone")}
                    required
                    pattern="\d{10}"
                    title="सहाय्यक शिक्षकाचा फोन १० अंकी असावा"
                    isInvalid={formData.errorMessage?.includes("सहाय्यक शिक्षकाचा फोन")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया १० अंकी फोन नंबर भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>शाळेतील शिक्षक संख्या - पुरुष</Form.Label>
                  <Form.Control
                    type="number"
                    name="teacherMale"
                    value={formData.teacherMale}
                    onChange={handleTeacherChange("teacherMale", "teacherFemale", "totalTeachers")}
                    required
                    isInvalid={formData.errorMessage?.includes("शिक्षक संख्या - पुरुष")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया पुरुष शिक्षक संख्या भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>शाळेतील शिक्षक संख्या - महिला</Form.Label>
                  <Form.Control
                    type="number"
                    name="teacherFemale"
                    value={formData.teacherFemale}
                    onChange={handleTeacherChange("teacherFemale", "teacherMale", "totalTeachers")}
                    required
                    isInvalid={formData.errorMessage?.includes("शिक्षक संख्या - महिला")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया महिला शिक्षक संख्या भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>एकूण शिक्षक संख्या</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalTeachers"
                    value={formData.totalTeachers}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>विद्यार्थी संख्या - मुले</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalBoys"
                    value={formData.totalBoys}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>विद्यार्थी संख्या - मुली</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalGirls"
                    value={formData.totalGirls}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>एकूण विद्यार्थी संख्या</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalStudents"
                    value={formData.totalStudents}
                    readOnly
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-3">इयत्ता १-४</h5>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>मुली</Form.Label>
                  <Form.Control
                    type="number"
                    name="female"
                    value={formData.gradeStudents.grade1to4.female}
                    onChange={handleStudentChange("grade1to4", "female")}
                    required
                    isInvalid={formData.errorMessage?.includes("इयत्ता १-४ मुलींची संख्या")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया मुलींची संख्या भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>मुले</Form.Label>
                  <Form.Control
                    type="number"
                    name="male"
                    value={formData.gradeStudents.grade1to4.male}
                    onChange={handleStudentChange("grade1to4", "male")}
                    required
                    isInvalid={formData.errorMessage?.includes("इयत्ता १-४ मुलांची संख्या")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया मुलांची संख्या भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>एकूण विद्यार्थी</Form.Label>
                  <Form.Control
                    type="number"
                    name="total"
                    value={formData.gradeStudents.grade1to4.total}
                    readOnly
                    onKeyDown={(e) => e.preventDefault()}
                    onChange={(e) => e.preventDefault()}
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-3">इयत्ता ५-७</h5>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>मुली</Form.Label>
                  <Form.Control
                    type="number"
                    name="female"
                    value={formData.gradeStudents.grade5to7.female}
                    onChange={handleStudentChange("grade5to7", "female")}
                    required
                    isInvalid={formData.errorMessage?.includes("इयत्ता ५-७ मुलींची संख्या")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया मुलींची संख्या भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>मुले</Form.Label>
                  <Form.Control
                    type="number"
                    name="male"
                    value={formData.gradeStudents.grade5to7.male}
                    onChange={handleStudentChange("grade5to7", "male")}
                    required
                    isInvalid={formData.errorMessage?.includes("इयत्ता ५-७ मुलांची संख्या")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया मुलांची संख्या भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>एकूण विद्यार्थी</Form.Label>
                  <Form.Control
                    type="number"
                    name="total"
                    value={formData.gradeStudents.grade5to7.total}
                    readOnly
                    onKeyDown={(e) => e.preventDefault()}
                    onChange={(e) => e.preventDefault()}
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-3">इयत्ता ८-१०</h5>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>मुली</Form.Label>
                  <Form.Control
                    type="number"
                    name="female"
                    value={formData.gradeStudents.grade8to10.female}
                    onChange={handleStudentChange("grade8to10", "female")}
                    required
                    isInvalid={formData.errorMessage?.includes("इयत्ता ८-१० मुलींची संख्या")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया मुलींची संख्या भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>मुले</Form.Label>
                  <Form.Control
                    type="number"
                    name="male"
                    value={formData.gradeStudents.grade8to10.male}
                    onChange={handleStudentChange("grade8to10", "male")}
                    required
                    isInvalid={formData.errorMessage?.includes("इयत्ता ८-१० मुलांची संख्या")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया मुलांची संख्या भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>एकूण विद्यार्थी</Form.Label>
                  <Form.Control
                    type="number"
                    name="total"
                    value={formData.gradeStudents.grade8to10.total}
                    readOnly
                    onKeyDown={(e) => e.preventDefault()}
                    onChange={(e) => e.preventDefault()}
                    style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="p-4 shadow-lg w-100 mx-auto mt-5">
        <Card.Header className="bg-primary text-white">
          <h3>शाळेच्या परिसराबद्दल माहिती</h3>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>१. मध्यान्ह भोजन माहिती फलक आहे का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasMiddayMealBoard"
                      value="1"
                      checked={formData.hasMiddayMealBoard === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasMiddayMealBoard: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasMiddayMealBoard"
                      value="0"
                      checked={formData.hasMiddayMealBoard === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasMiddayMealBoard: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("मध्यान्ह भोजन माहिती फलक") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>२. मध्यान्ह भोजन मेनू आहे का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasMiddayMealMenu"
                      value="1"
                      checked={formData.hasMiddayMealMenu === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasMiddayMealMenu: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasMiddayMealMenu"
                      value="0"
                      checked={formData.hasMiddayMealMenu === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasMiddayMealMenu: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("मध्यान्ह भोजन मेनू") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>३. शाळा व्यवस्थापन समिती बोर्ड आहे का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasManagementBoard"
                      value="1"
                      checked={formData.hasManagementBoard === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasManagementBoard: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasManagementBoard"
                      value="0"
                      checked={formData.hasManagementBoard === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasManagementBoard: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("शाळा व्यवस्थापन समिती बोर्ड") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>४. मुख्याध्यापक यांचा संपर्क क्रमांक आहे का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasPrincipalContact"
                      value="1"
                      checked={formData.hasPrincipalContact === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasPrincipalContact: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasPrincipalContact"
                      value="0"
                      checked={formData.hasPrincipalContact === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasPrincipalContact: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("मुख्याध्यापक संपर्क क्रमांक") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>५. तालुका/जिल्हास्तरीय अधिकाऱ्यांचा क्रमांक आहे का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasOfficerContact"
                      value="1"
                      checked={formData.hasOfficerContact === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasOfficerContact: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasOfficerContact"
                      value="0"
                      checked={formData.hasOfficerContact === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasOfficerContact: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("तालुका/जिल्हास्तरीय अधिकाऱ्यांचा क्रमांक") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>६. मध्यान्ह भोजन बाबत तक्रार पेटी आहे का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasComplaintBox"
                      value="1"
                      checked={formData.hasComplaintBox === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasComplaintBox: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasComplaintBox"
                      value="0"
                      checked={formData.hasComplaintBox === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasComplaintBox: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("मध्यान्ह भोजन तक्रार पेटी") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>७. आपत्कालीन दूरध्वनी क्रमांक भिंतीवर आहे का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasEmergencyNumber"
                      value="1"
                      checked={formData.hasEmergencyNumber === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasEmergencyNumber: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasEmergencyNumber"
                      value="0"
                      checked={formData.hasEmergencyNumber === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasEmergencyNumber: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("आपत्कालीन दूरध्वनी क्रमांक") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>८. किचनशेड उपलब्ध आहे काय?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasKitchenShed"
                      value="1"
                      checked={formData.hasKitchenShed === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasKitchenShed: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasKitchenShed"
                      value="0"
                      checked={formData.hasKitchenShed === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasKitchenShed: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("किचनशेड") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>९. प्राथमिक उपचार पेटी उपलब्ध आहे काय?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasFirstAidBox"
                      value="1"
                      checked={formData.hasFirstAidBox === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasFirstAidBox: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasFirstAidBox"
                      value="0"
                      checked={formData.hasFirstAidBox === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasFirstAidBox: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("प्राथमिक उपचार पेटी") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>१०. शाळेमध्ये पिण्याच्या पाण्याचे स्रोत आहे का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasWaterSource"
                      value="1"
                      checked={formData.hasWaterSource === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasWaterSource: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasWaterSource"
                      value="0"
                      checked={formData.hasWaterSource === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasWaterSource: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("पिण्याच्या पाण्याचे स्रोत") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>१०.१ असल्यास:</Form.Label>
                  <Form.Select
                    name="waterSourceType"
                    value={formData.waterSourceType}
                    onChange={(e) => setFormData((prev) => ({ ...prev, waterSourceType: e.target.value }))}
                    disabled={formData.hasWaterSource !== "1"}
                    required={formData.hasWaterSource === "1"}
                    isInvalid={formData.errorMessage?.includes("पाण्याचा स्रोत प्रकार")}
                  >
                    <option value="">निवडा</option>
                    <option value="1">हातपंप</option>
                    <option value="2">नळ</option>
                    <option value="3">विहीर</option>
                    <option value="4">बोअरवेल</option>
                    <option value="5">इतर</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    कृपया पाण्याचा स्रोत प्रकार निवडा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>१०.२ पाणी पुरवठा नियमित आहे का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasRegularWaterSupply"
                      value="1"
                      checked={formData.hasRegularWaterSupply === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasRegularWaterSupply: e.target.value }))}
                      disabled={formData.hasWaterSource !== "1"}
                      required={formData.hasWaterSource === "1"}
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasRegularWaterSupply"
                      value="0"
                      checked={formData.hasRegularWaterSupply === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasRegularWaterSupply: e.target.value }))}
                      disabled={formData.hasWaterSource !== "1"}
                      required={formData.hasWaterSource === "1"}
                    />
                  </div>
                  {formData.errorMessage?.includes("पाणी पुरवठा नियमित आहे का") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>११. आपत्कालीन परिस्थितीत अग्निशमन उपकरणे उपलब्ध आहेत का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasFireExtinguisher"
                      value="1"
                      checked={formData.hasFireExtinguisher === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasFireExtinguisher: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasFireExtinguisher"
                      value="0"
                      checked={formData.hasFireExtinguisher === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasFireExtinguisher: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("अग्निशमन उपकरणे") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>११.१ तपासणी नोंदवली जाते का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasFireExtinguisherCheck"
                      value="1"
                      checked={formData.hasFireExtinguisherCheck === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasFireExtinguisherCheck: e.target.value }))}
                      disabled={formData.hasFireExtinguisher !== "1"}
                      required={formData.hasFireExtinguisher === "1"}
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasFireExtinguisherCheck"
                      value="0"
                      checked={formData.hasFireExtinguisherCheck === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasFireExtinguisherCheck: e.target.value }))}
                      disabled={formData.hasFireExtinguisher !== "1"}
                      required={formData.hasFireExtinguisher === "1"}
                    />
                  </div>
                  {formData.errorMessage?.includes("अग्निशामक तपासणी नोंद") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>११.२ पुनर्भरण नियमित होते का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasFireExtinguisherRefill"
                      value="1"
                      checked={formData.hasFireExtinguisherRefill === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasFireExtinguisherRefill: e.target.value }))}
                      disabled={formData.hasFireExtinguisher !== "1"}
                      required={formData.hasFireExtinguisher === "1"}
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasFireExtinguisherRefill"
                      value="0"
                      checked={formData.hasFireExtinguisherRefill === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasFireExtinguisherRefill: e.target.value }))}
                      disabled={formData.hasFireExtinguisher !== "1"}
                      required={formData.hasFireExtinguisher === "1"}
                    />
                  </div>
                  {formData.errorMessage?.includes("अग्निशामक पुनर्भरण") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>११.३ अग्निशामक तपशील</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="fireExtinguisherDetails"
                    value={formData.fireExtinguisherDetails}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fireExtinguisherDetails: e.target.value }))}
                    required
                    isInvalid={formData.errorMessage?.includes("अग्निशामक तपशील")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया अग्निशामक तपशील भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>१२. परसबाग विकसित आहे काय?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="hasKitchenGarden"
                      value="1"
                      checked={formData.hasKitchenGarden === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasKitchenGarden: e.target.value }))}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasKitchenGarden"
                      value="0"
                      checked={formData.hasKitchenGarden === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, hasKitchenGarden: e.target.value }))}
                      required
                    />
                  </div>
                  {formData.errorMessage?.includes("परसबाग विकसित") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>१२.१ पालेभाज्या/फळे वापरले जातात का?</Form.Label>
                  <div>
                    <FormCheck
                      inline
                      type="radio"
                      label="होय"
                      name="usesGardenProduce"
                      value="1"
                      checked={formData.usesGardenProduce === "1"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, usesGardenProduce: e.target.value }))}
                      disabled={formData.hasKitchenGarden !== "1"}
                      required={formData.hasKitchenGarden === "1"}
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="usesGardenProduce"
                      value="0"
                      checked={formData.usesGardenProduce === "0"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, usesGardenProduce: e.target.value }))}
                      disabled={formData.hasKitchenGarden !== "1"}
                      required={formData.hasKitchenGarden === "1"}
                    />
                  </div>
                  {formData.errorMessage?.includes("पालेभाज्या/फळे वापरले जातात का") && (
                    <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
                      कृपया निवड करा
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>१२.२ स्वयंपाक बाग तपशील</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="kitchenGardenDetails"
                    value={formData.kitchenGardenDetails}
                    onChange={(e) => setFormData((prev) => ({ ...prev, kitchenGardenDetails: e.target.value }))}
                    required
                    isInvalid={formData.errorMessage?.includes("स्वयंपाक बाग तपशील")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया स्वयंपाक बाग तपशील भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>१३. नाविन्यपूर्ण उपक्रम</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="innovativeInitiatives"
                    value={formData.innovativeInitiatives}
                    onChange={(e) => setFormData((prev) => ({ ...prev, innovativeInitiatives: e.target.value }))}
                    required
                    isInvalid={formData.errorMessage?.includes("नाविन्यपूर्ण उपक्रम")}
                  />
                  <Form.Control.Feedback type="invalid">
                    कृपया नाविन्यपूर्ण उपक्रम भरा
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center mt-4">
              <button
                type="button"
                className="btn btn-primary btn-lg me-2"
                onClick={() => navigate('/school-feedback')}
              >
                मागे जा
              </button>
              <Button type="button" variant="primary" size="lg" onClick={handleNext}>
                पुढे चला
              </Button>
            </div>

            {formData.errorMessage && (
              <Alert variant="danger" className="mt-3 text-center">
                {formData.errorMessage}
              </Alert>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SchoolFormPage1;