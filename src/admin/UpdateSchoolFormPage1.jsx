import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Row, Col, Card, FormCheck, Spinner } from "react-bootstrap";
import { db } from "../components/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import DistrictTalukaSelector from "../components/DistrictTalukaSelector";

const UpdateSchoolFormPage1 = ({ nextStep }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selections, setSelections] = useState({ district: "", taluka: "" });
  const [schoolName, setSchoolName] = useState("");
  const [udiseNumber, setUdiseNumber] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [schoolFullName, setSchoolFullName] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionTime, setInspectionTime] = useState("");
  const [headmasterName, setHeadmasterName] = useState("");
  const [headmasterPhone, setHeadmasterPhone] = useState("");
  const [headmasterAddress, setHeadmasterAddress] = useState("");
  const [assistantTeacherName, setAssistantTeacherName] = useState("");
  const [assistantTeacherPhone, setAssistantTeacherPhone] = useState("");
  const [teacherMale, setTeacherMale] = useState("");
  const [teacherFemale, setTeacherFemale] = useState("");
  const [totalTeachers, setTotalTeachers] = useState("");
  const [gradeStudents, setGradeStudents] = useState({
    grade1to4: { female: "", male: "", total: "" },
    grade5to7: { female: "", male: "", total: "" },
    grade8to10: { female: "", male: "", total: "" },
  });
  const [totalGirls, setTotalGirls] = useState("");
  const [totalBoys, setTotalBoys] = useState("");
  const [totalStudents, setTotalStudents] = useState("");
  const [hasMiddayMealBoard, setHasMiddayMealBoard] = useState(null);
  const [hasMiddayMealMenu, setHasMiddayMealMenu] = useState(null);
  const [hasManagementBoard, setHasManagementBoard] = useState(null);
  const [hasPrincipalContact, setHasPrincipalContact] = useState(null);
  const [hasOfficerContact, setHasOfficerContact] = useState(null);
  const [hasComplaintBox, setHasComplaintBox] = useState(null);
  const [hasEmergencyNumber, setHasEmergencyNumber] = useState(null);
  const [hasKitchenShed, setHasKitchenShed] = useState(null);
  const [hasFirstAidBox, setHasFirstAidBox] = useState(null);
  const [hasWaterSource, setHasWaterSource] = useState(null);
  const [waterSourceType, setWaterSourceType] = useState("");
  const [hasRegularWaterSupply, setHasRegularWaterSupply] = useState(null);
  const [hasFireExtinguisher, setHasFireExtinguisher] = useState(null);
  const [hasFireExtinguisherCheck, setHasFireExtinguisherCheck] = useState(null);
  const [hasFireExtinguisherRefill, setHasFireExtinguisherRefill] = useState(null);
  const [fireExtinguisherDetails, setFireExtinguisherDetails] = useState("");
  const [hasKitchenGarden, setHasKitchenGarden] = useState(null);
  const [usesGardenProduce, setUsesGardenProduce] = useState(null);
  const [kitchenGardenDetails, setKitchenGardenDetails] = useState("");
  const [innovativeInitiatives, setInnovativeInitiatives] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSchool = async () => {
    try {
      setLoading(true);
      console.log("Fetching document with ID:", id);
      const docRef = doc(db, "School_Form", id);
      console.log("Firestore doc reference created:", docRef.path);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Fetched data:", data);

        // Handle district and taluka
        const district = data.district || data.District || data.districtName || (data.location?.district) || "";
        const taluka = data.taluka || data.Taluka || data.talukaName || (data.location?.taluka) || "";
        setSelections({ district, taluka });
        console.log("Set selections:", { district, taluka });

        setSchoolName(data.schoolName || "");
        setUdiseNumber(data.udiseNumber || "");
        setInspectorName(data.inspectorName || "");
        setSchoolFullName(data.schoolFullName || "");

        // Handle inspectionDate with multiple formats
        const possibleInspectionDateFields = [
          "inspectionDate",
          "InspectionDate",
          "dateOfInspection",
          "inspection_date",
        ];
        let inspectionDateValue = "";
        for (const field of possibleInspectionDateFields) {
          if (data[field]) {
            const value = data[field];
            console.log(`Found inspectionDate in field '${field}':`, value);
            try {
              // Handle Firestore Timestamp
              if (value && typeof value.toDate === "function") {
                inspectionDateValue = value.toDate().toISOString().split("T")[0];
                console.log(`Converted Timestamp to date: ${inspectionDateValue}`);
              }
              // Handle ISO strings (e.g., "2025-05-22T00:00:00.000")
              else if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
                inspectionDateValue = value.split("T")[0];
                console.log(`Extracted date from ISO string: ${inspectionDateValue}`);
              }
              // Handle direct yyyy-MM-dd format
              else if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
                inspectionDateValue = value;
                console.log(`Used direct date string: ${inspectionDateValue}`);
              }
              // Handle other date formats (optional, add as needed)
              else {
                console.warn(`Unrecognized date format for '${field}':`, value);
              }
            } catch (error) {
              console.error(`Error processing date for field '${field}':`, error);
            }
            if (inspectionDateValue) break;
          }
        }
        setInspectionDate(inspectionDateValue || "");
        console.log("Set inspectionDate:", inspectionDateValue);

        setInspectionTime(data.inspectionTime || "");
        setHeadmasterName(data.headmasterName || "");
        setHeadmasterPhone(data.headmasterPhone || "");
        setHeadmasterAddress(data.headmasterAddress || "");
        setAssistantTeacherName(data.assistantTeacherName || "");
        setAssistantTeacherPhone(data.assistantTeacherPhone || "");
        setTeacherMale(data.teacherMale?.toString() || "");
        setTeacherFemale(data.teacherFemale?.toString() || "");
        setTotalTeachers(data.totalTeachers?.toString() || "");

        // Populate gradeStudents
        setGradeStudents({
          grade1to4: {
            female: data.gradeStudents?.grade1to4?.female?.toString() || "",
            male: data.gradeStudents?.grade1to4?.male?.toString() || "",
            total: data.gradeStudents?.grade1to4?.total?.toString() || "",
          },
          grade5to7: {
            female: data.gradeStudents?.grade5to7?.female?.toString() || "",
            male: data.gradeStudents?.grade5to7?.male?.toString() || "",
            total: data.gradeStudents?.grade5to7?.total?.toString() || "",
          },
          grade8to10: {
            female: data.gradeStudents?.grade8to10?.female?.toString() || "",
            male: data.gradeStudents?.grade8to10?.male?.toString() || "",
            total: data.gradeStudents?.grade8to10?.total?.toString() || "",
          },
        });
        setTotalGirls(data.totalGirls?.toString() || "");
        setTotalBoys(data.totalBoys?.toString() || "");
        setTotalStudents(data.totalStudents?.toString() || "");

        // Populate boolean fields
        setHasMiddayMealBoard(data.hasMiddayMealBoard !== undefined ? (data.hasMiddayMealBoard ? "1" : "0") : null);
        setHasMiddayMealMenu(data.hasMiddayMealMenu !== undefined ? (data.hasMiddayMealMenu ? "1" : "0") : null);
        setHasManagementBoard(data.hasManagementBoard !== undefined ? (data.hasManagementBoard ? "1" : "0") : null);
        setHasPrincipalContact(data.hasPrincipalContact !== undefined ? (data.hasPrincipalContact ? "1" : "0") : null);
        setHasOfficerContact(data.hasOfficerContact !== undefined ? (data.hasOfficerContact ? "1" : "0") : null);
        setHasComplaintBox(data.hasComplaintBox !== undefined ? (data.hasComplaintBox ? "1" : "0") : null);
        setHasEmergencyNumber(data.hasEmergencyNumber !== undefined ? (data.hasEmergencyNumber ? "1" : "0") : null);
        setHasKitchenShed(data.hasKitchenShed !== undefined ? (data.hasKitchenShed ? "1" : "0") : null);
        setHasFirstAidBox(data.hasFirstAidBox !== undefined ? (data.hasFirstAidBox ? "1" : "0") : null);
        setHasWaterSource(data.hasWaterSource !== undefined ? (data.hasWaterSource ? "1" : "0") : null);
        setWaterSourceType(data.waterSourceType || "");
        setHasRegularWaterSupply(data.hasRegularWaterSupply !== undefined ? (data.hasRegularWaterSupply ? "1" : "0") : null);
        setHasFireExtinguisher(data.hasFireExtinguisher !== undefined ? (data.hasFireExtinguisher ? "1" : "0") : null);
        setHasFireExtinguisherCheck(data.hasFireExtinguisherCheck !== undefined ? (data.hasFireExtinguisherCheck ? "1" : "0") : null);
        setHasFireExtinguisherRefill(data.hasFireExtinguisherRefill !== undefined ? (data.hasFireExtinguisherRefill ? "1" : "0") : null);

        // Handle fireExtinguisherDetails
        const possibleFireExtinguisherFields = [
          "fireExtinguisherDetails",
          "FireExtinguisherDetails",
          "fire_extinguisher_details",
          "extinguisherDetails",
        ];
        let fireExtinguisherDetailsValue = "";
        for (const field of possibleFireExtinguisherFields) {
          if (data[field]) {
            fireExtinguisherDetailsValue = data[field];
            console.log(`Found fireExtinguisherDetails in field '${field}':`, fireExtinguisherDetailsValue);
            break;
          }
        }
        setFireExtinguisherDetails(fireExtinguisherDetailsValue || "");
        console.log("Set fireExtinguisherDetails:", fireExtinguisherDetailsValue);

        setHasKitchenGarden(data.hasKitchenGarden !== undefined ? (data.hasKitchenGarden ? "1" : "0") : null);
        setUsesGardenProduce(data.usesGardenProduce !== undefined ? (data.usesGardenProduce ? "1" : "0") : null);
        setKitchenGardenDetails(data.kitchenGardenDetails || "");
        setInnovativeInitiatives(data.innovativeInitiatives || "");
      } else {
        console.warn("Document does not exist for ID:", id);
        setMessage("अशी कोणतीही शाळा फॉर्म सापडली नाही! (Document not found)");
        setTimeout(() => navigate("/school-feedback"), 3000);
      }
    } catch (error) {
      console.error("Error fetching school data:", error);
      let errorMessage = "शाळा डेटा आणताना त्रुटी: ";
      if (error.code === "permission-denied") {
        errorMessage += "आपल्याला या डेटा मध्ये प्रवेश नाही. (Permission denied)";
      } else if (error.code === "not-found") {
        errorMessage += "डेटा सापडला नाही. (Document not found)";
      } else if (error.code === "unavailable") {
        errorMessage += "Firestore सर्व्हर उपलब्ध नाही. (Service unavailable)";
      } else {
        errorMessage += error.message;
      }
      setMessage(errorMessage);
      console.log("Set error message:", errorMessage);
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };

  useEffect(() => {
    console.log("Component mounted, calling fetchSchool...");
    fetchSchool();
  }, [id]);

  useEffect(() => {
    console.log("Current selections state:", selections);
  }, [selections]);

  const handleUdiseChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setUdiseNumber(value);
    }
  };

  const handlePhoneChange = (setter) => (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setter(value);
    }
  };

  const handleTeacherChange = (setter, otherValue, totalSetter) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numericValue = value === "" ? 0 : Number(value);
      setter(value);
      totalSetter(String(numericValue + (Number(otherValue) || 0)));
    }
  };

  const handleStudentChange = (gradeKey, gender) => (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numericValue = value === "" ? 0 : Number(value);
      setGradeStudents((prev) => {
        const updatedGrade = {
          ...prev[gradeKey],
          [gender]: value,
          total: String(
            (gender === "female" ? numericValue : Number(prev[gradeKey].female) || 0) +
            (gender === "male" ? numericValue : Number(prev[gradeKey].male) || 0)
          ),
        };
        const allGrades = { ...prev, [gradeKey]: updatedGrade };
        const totalGirls = String(
          Object.values(allGrades).reduce(
            (sum, grade) => sum + (grade.female === "" ? 0 : Number(grade.female)),
            0
          )
        );
        const totalBoys = String(
          Object.values(allGrades).reduce(
            (sum, grade) => sum + (grade.male === "" ? 0 : Number(grade.male)),
            0
          )
        );
        const totalStudents = String(Number(totalGirls) + Number(totalBoys));
        setTotalGirls(totalGirls);
        setTotalBoys(totalBoys);
        setTotalStudents(totalStudents);
        return allGrades;
      });
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { key: selections.district, label: "जिल्हा" },
      { key: selections.taluka, label: "तालुका" },
      { key: schoolName, label: "शाळेचे नाव" },
      { key: udiseNumber, label: "UDISE कोड" },
      { key: inspectorName, label: "तपासणी करणाऱ्याचे नाव" },
      { key: schoolFullName, label: "शाळेचे पूर्ण नाव" },
      { key: inspectionDate, label: "तपासणी तारीख" },
      { key: inspectionTime, label: "तपासणी वेळ" },
      { key: headmasterName, label: "मुख्याध्यापकाचे नाव" },
      { key: headmasterPhone, label: "मुख्याध्यापकाचा फोन" },
      { key: headmasterAddress, label: "मुख्याध्यापकाचा पत्ता" },
      { key: teacherMale, label: "शिक्षक संख्या - पुरुष" },
      { key: teacherFemale, label: "शिक्षक संख्या - महिला" },
      { key: hasMiddayMealBoard, label: "मध्यान्ह भोजन माहिती फलक" },
      { key: hasMiddayMealMenu, label: "मध्यान्ह भोजन मेनू" },
      { key: hasManagementBoard, label: "शाळा व्यवस्थापन समिती बोर्ड" },
      { key: hasPrincipalContact, label: "मुख्याध्यापक संपर्क क्रमांक" },
      { key: hasOfficerContact, label: "तालुका/जिल्हास्तरीय अधिकाऱ्यांचा क्रमांक" },
      { key: hasComplaintBox, label: "मध्यान्ह भोजन तक्रार पेटी" },
      { key: hasEmergencyNumber, label: "आपत्कालीन दूरध्वनी क्रमांक" },
      { key: hasKitchenShed, label: "किचनशेड" },
      { key: hasFirstAidBox, label: "प्राथमिक उपचार पेटी" },
      { key: hasWaterSource, label: "पिण्याच्या पाण्याचे स्रोत" },
      { key: hasFireExtinguisher, label: "अग्निशमन उपकरणे" },
    ];

    const missingFields = [];
    requiredFields.forEach(({ key, label }) => {
      if (key === null || key === "" || key === undefined) {
        missingFields.push(label);
      }
    });

    if (udiseNumber && udiseNumber.length !== 11) {
      missingFields.push("UDISE कोड (११ अंकी)");
    }

    if (headmasterPhone && headmasterPhone.length !== 10) {
      missingFields.push("मुख्याध्यापकाचा फोन (१० अंकी)");
    }

    if (assistantTeacherPhone && assistantTeacherPhone.length !== 10) {
      missingFields.push("सहाय्यक शिक्षकाचा फोन (१० अंकी)");
    }

    if (hasWaterSource === "1") {
      if (!waterSourceType) {
        missingFields.push("पाण्याचा स्रोत प्रकार");
      }
      if (hasRegularWaterSupply === null) {
        missingFields.push("पाणी पुरवठा नियमित आहे का");
      }
    }

    if (hasFireExtinguisher === "1") {
      if (hasFireExtinguisherCheck === null) {
        missingFields.push("अग्निशामक तपासणी नोंद");
      }
      if (hasFireExtinguisherRefill === null) {
        missingFields.push("अग्निशामक पुनर्भरण");
      }
      if (!fireExtinguisherDetails) {
        missingFields.push("अग्निशामक तपशील");
      }
    }

    if (hasKitchenGarden === "1") {
      if (usesGardenProduce === null) {
        missingFields.push("पालेभाज्या/फळे वापरले जातात का");
      }
      if (!kitchenGardenDetails) {
        missingFields.push("स्वयंपाक बाग तपशील");
      }
    }

    const grades = ["grade1to4", "grade5to7", "grade8to10"];
    grades.forEach((grade) => {
      if (gradeStudents[grade].female === "" || gradeStudents[grade].female === undefined) {
        missingFields.push(`इयत्ता ${grade === "grade1to4" ? "१-४" : grade === "grade5to7" ? "५-७" : "८-१०"} मुलींची संख्या`);
      }
      if (gradeStudents[grade].male === "" || gradeStudents[grade].male === undefined) {
        missingFields.push(`इयत्ता ${grade === "grade1to4" ? "१-४" : grade === "grade5to7" ? "५-७" : "८-१०"} मुलांची संख्या`);
      }
    });

    return missingFields.length > 0 ? missingFields : null;
  };

  const handleNext = (e) => {
    e.preventDefault();
    setErrorMessage("");
    const missingFields = validateForm();
    if (missingFields) {
      setErrorMessage(`कृपया खालील आवश्यक फील्ड भरा: ${missingFields.join(", ")}`);
      return;
    }
    nextStep();
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary">
          <span className="visually-hidden">लोड होत आहे...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container-xxl my-5">
      <Card className="p-4 shadow-lg w-100 mx-auto">
        <Card.Header className="bg-primary text-white">
          <h3>शाळेबद्दल माहिती</h3>
        </Card.Header>
        <Card.Body>
          {message && (
            <Alert variant="danger" className="mt-3 text-center">
              {message}
            </Alert>
          )}
          <Form onSubmit={handleNext}>
            <Row className="mb-3">
              <Col md={4}>
                <DistrictTalukaSelector
                  districtLabel="जिल्हा"
                  talukaLabel="तालुका"
                  onSelectionChange={setSelections}
                  selections={selections}
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
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    required
                    isInvalid={errorMessage.includes("शाळेचे नाव")}
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
                    value={udiseNumber}
                    onChange={handleUdiseChange}
                    required
                    pattern="\d{11}"
                    title="UDISE कोड ११ अंकी असावा"
                    isInvalid={errorMessage.includes("UDISE कोड")}
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
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    required
                    isInvalid={errorMessage.includes("तपासणी करणाऱ्याचे नाव")}
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
                    value={schoolFullName}
                    onChange={(e) => setSchoolFullName(e.target.value)}
                    required
                    isInvalid={errorMessage.includes("शाळेचे पूर्ण नाव")}
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
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    required
                    isInvalid={errorMessage.includes("तपासणी तारीख")}
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
                    value={inspectionTime}
                    onChange={(e) => setInspectionTime(e.target.value)}
                    required
                    isInvalid={errorMessage.includes("तपासणी वेळ")}
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
                    value={headmasterName}
                    onChange={(e) => setHeadmasterName(e.target.value)}
                    required
                    isInvalid={errorMessage.includes("मुख्याध्यापकाचे नाव")}
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
                    value={headmasterPhone}
                    onChange={handlePhoneChange(setHeadmasterPhone)}
                    required
                    pattern="\d{10}"
                    title="मुख्याध्यापकाचा फोन १० अंकी असावा"
                    isInvalid={errorMessage.includes("मुख्याध्यापकाचा फोन")}
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
                    value={headmasterAddress}
                    onChange={(e) => setHeadmasterAddress(e.target.value)}
                    required
                    isInvalid={errorMessage.includes("मुख्याध्यापकाचा पत्ता")}
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
                    value={assistantTeacherName}
                    onChange={(e) => setAssistantTeacherName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>सहाय्यक शिक्षकाचा फोन</Form.Label>
                  <Form.Control
                    type="tel"
                    name="assistantTeacherPhone"
                    value={assistantTeacherPhone}
                    onChange={handlePhoneChange(setAssistantTeacherPhone)}
                    pattern="\d{10}"
                    title="सहाय्यक शिक्षकाचा फोन १० अंकी असावा"
                    isInvalid={errorMessage.includes("सहाय्यक शिक्षकाचा फोन")}
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
                    value={teacherMale}
                    onChange={handleTeacherChange(setTeacherMale, teacherFemale, setTotalTeachers)}
                    required
                    min="0"
                    isInvalid={errorMessage.includes("शिक्षक संख्या - पुरुष")}
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
                    value={teacherFemale}
                    onChange={handleTeacherChange(setTeacherFemale, teacherMale, setTotalTeachers)}
                    required
                    min="0"
                    isInvalid={errorMessage.includes("शिक्षक संख्या - महिला")}
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
                    value={totalTeachers}
                    readOnly
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
                    value={totalBoys}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>विद्यार्थी संख्या - मुली</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalGirls"
                    value={totalGirls}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>एकूण विद्यार्थी संख्या</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalStudents"
                    value={totalStudents}
                    readOnly
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
                    value={gradeStudents.grade1to4.female}
                    onChange={handleStudentChange("grade1to4", "female")}
                    required
                    min="0"
                    isInvalid={errorMessage.includes("इयत्ता १-४ मुलींची संख्या")}
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
                    value={gradeStudents.grade1to4.male}
                    onChange={handleStudentChange("grade1to4", "male")}
                    required
                    min="0"
                    isInvalid={errorMessage.includes("इयत्ता १-४ मुलांची संख्या")}
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
                    value={gradeStudents.grade1to4.total}
                    readOnly
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
                    value={gradeStudents.grade5to7.female}
                    onChange={handleStudentChange("grade5to7", "female")}
                    required
                    min="0"
                    isInvalid={errorMessage.includes("इयत्ता ५-७ मुलींची संख्या")}
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
                    value={gradeStudents.grade5to7.male}
                    onChange={handleStudentChange("grade5to7", "male")}
                    required
                    min="0"
                    isInvalid={errorMessage.includes("इयत्ता ५-७ मुलांची संख्या")}
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
                    value={gradeStudents.grade5to7.total}
                    readOnly
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
                    value={gradeStudents.grade8to10.female}
                    onChange={handleStudentChange("grade8to10", "female")}
                    required
                    min="0"
                    isInvalid={errorMessage.includes("इयत्ता ८-१० मुलींची संख्या")}
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
                    value={gradeStudents.grade8to10.male}
                    onChange={handleStudentChange("grade8to10", "male")}
                    required
                    min="0"
                    isInvalid={errorMessage.includes("इयत्ता ८-१० मुलांची संख्या")}
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
                    value={gradeStudents.grade8to10.total}
                    readOnly
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
          <Form onSubmit={handleNext}>
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
                      checked={hasMiddayMealBoard === "1"}
                      onChange={(e) => setHasMiddayMealBoard(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasMiddayMealBoard"
                      value="0"
                      checked={hasMiddayMealBoard === "0"}
                      onChange={(e) => setHasMiddayMealBoard(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("मध्यान्ह भोजन माहिती फलक") && (
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
                      checked={hasMiddayMealMenu === "1"}
                      onChange={(e) => setHasMiddayMealMenu(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasMiddayMealMenu"
                      value="0"
                      checked={hasMiddayMealMenu === "0"}
                      onChange={(e) => setHasMiddayMealMenu(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("मध्यान्ह भोजन मेनू") && (
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
                      checked={hasManagementBoard === "1"}
                      onChange={(e) => setHasManagementBoard(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasManagementBoard"
                      value="0"
                      checked={hasManagementBoard === "0"}
                      onChange={(e) => setHasManagementBoard(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("शाळा व्यवस्थापन समिती बोर्ड") && (
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
                      checked={hasPrincipalContact === "1"}
                      onChange={(e) => setHasPrincipalContact(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasPrincipalContact"
                      value="0"
                      checked={hasPrincipalContact === "0"}
                      onChange={(e) => setHasPrincipalContact(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("मुख्याध्यापक संपर्क क्रमांक") && (
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
                      checked={hasOfficerContact === "1"}
                      onChange={(e) => setHasOfficerContact(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasOfficerContact"
                      value="0"
                      checked={hasOfficerContact === "0"}
                      onChange={(e) => setHasOfficerContact(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("तालुका/जिल्हास्तरीय अधिकाऱ्यांचा क्रमांक") && (
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
                      checked={hasComplaintBox === "1"}
                      onChange={(e) => setHasComplaintBox(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasComplaintBox"
                      value="0"
                      checked={hasComplaintBox === "0"}
                      onChange={(e) => setHasComplaintBox(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("मध्यान्ह भोजन तक्रार पेटी") && (
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
                      checked={hasEmergencyNumber === "1"}
                      onChange={(e) => setHasEmergencyNumber(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasEmergencyNumber"
                      value="0"
                      checked={hasEmergencyNumber === "0"}
                      onChange={(e) => setHasEmergencyNumber(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("आपत्कालीन दूरध्वनी क्रमांक") && (
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
                      checked={hasKitchenShed === "1"}
                      onChange={(e) => setHasKitchenShed(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasKitchenShed"
                      value="0"
                      checked={hasKitchenShed === "0"}
                      onChange={(e) => setHasKitchenShed(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("किचनशेड") && (
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
                      checked={hasFirstAidBox === "1"}
                      onChange={(e) => setHasFirstAidBox(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasFirstAidBox"
                      value="0"
                      checked={hasFirstAidBox === "0"}
                      onChange={(e) => setHasFirstAidBox(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("प्राथमिक उपचार पेटी") && (
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
                      checked={hasWaterSource === "1"}
                      onChange={(e) => setHasWaterSource(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasWaterSource"
                      value="0"
                      checked={hasWaterSource === "0"}
                      onChange={(e) => setHasWaterSource(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("पिण्याच्या पाण्याचे स्रोत") && (
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
                    value={waterSourceType}
                    onChange={(e) => setWaterSourceType(e.target.value)}
                    disabled={hasWaterSource !== "1"}
                    required={hasWaterSource === "1"}
                    isInvalid={errorMessage.includes("पाण्याचा स्रोत प्रकार")}
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
                      checked={hasRegularWaterSupply === "1"}
                      onChange={(e) => setHasRegularWaterSupply(e.target.value)}
                      disabled={hasWaterSource !== "1"}
                      required={hasWaterSource === "1"}
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasRegularWaterSupply"
                      value="0"
                      checked={hasRegularWaterSupply === "0"}
                      onChange={(e) => setHasRegularWaterSupply(e.target.value)}
                      disabled={hasWaterSource !== "1"}
                      required={hasWaterSource === "1"}
                    />
                  </div>
                  {errorMessage.includes("पाणी पुरवठा नियमित आहे का") && (
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
                      checked={hasFireExtinguisher === "1"}
                      onChange={(e) => setHasFireExtinguisher(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasFireExtinguisher"
                      value="0"
                      checked={hasFireExtinguisher === "0"}
                      onChange={(e) => setHasFireExtinguisher(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("अग्निशमन उपकरणे") && (
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
                      checked={hasFireExtinguisherCheck === "1"}
                      onChange={(e) => setHasFireExtinguisherCheck(e.target.value)}
                      disabled={hasFireExtinguisher !== "1"}
                      required={hasFireExtinguisher === "1"}
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasFireExtinguisherCheck"
                      value="0"
                      checked={hasFireExtinguisherCheck === "0"}
                      onChange={(e) => setHasFireExtinguisherCheck(e.target.value)}
                      disabled={hasFireExtinguisher !== "1"}
                      required={hasFireExtinguisher === "1"}
                    />
                  </div>
                  {errorMessage.includes("अग्निशामक तपासणी नोंद") && (
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
                      checked={hasFireExtinguisherRefill === "1"}
                      onChange={(e) => setHasFireExtinguisherRefill(e.target.value)}
                      disabled={hasFireExtinguisher !== "1"}
                      required={hasFireExtinguisher === "1"}
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasFireExtinguisherRefill"
                      value="0"
                      checked={hasFireExtinguisherRefill === "0"}
                      onChange={(e) => setHasFireExtinguisherRefill(e.target.value)}
                      disabled={hasFireExtinguisher !== "1"}
                      required={hasFireExtinguisher === "1"}
                    />
                  </div>
                  {errorMessage.includes("अग्निशामक पुनर्भरण") && (
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
                    value={fireExtinguisherDetails}
                    onChange={(e) => setFireExtinguisherDetails(e.target.value)}
                    required={hasFireExtinguisher === "1"}
                    isInvalid={errorMessage.includes("अग्निशामक तपशील")}
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
                      checked={hasKitchenGarden === "1"}
                      onChange={(e) => setHasKitchenGarden(e.target.value)}
                      required
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="hasKitchenGarden"
                      value="0"
                      checked={hasKitchenGarden === "0"}
                      onChange={(e) => setHasKitchenGarden(e.target.value)}
                      required
                    />
                  </div>
                  {errorMessage.includes("परसबाग विकसित") && (
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
                      checked={usesGardenProduce === "1"}
                      onChange={(e) => setUsesGardenProduce(e.target.value)}
                      disabled={hasKitchenGarden !== "1"}
                      required={hasKitchenGarden === "1"}
                    />
                    <FormCheck
                      inline
                      type="radio"
                      label="नाही"
                      name="usesGardenProduce"
                      value="0"
                      checked={usesGardenProduce === "0"}
                      onChange={(e) => setUsesGardenProduce(e.target.value)}
                      disabled={hasKitchenGarden !== "1"}
                      required={hasKitchenGarden === "1"}
                    />
                  </div>
                  {errorMessage.includes("पालेभाज्या/फळे वापरले जातात का") && (
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
                    value={kitchenGardenDetails}
                    onChange={(e) => setKitchenGardenDetails(e.target.value)}
                    required={hasKitchenGarden === "1"}
                    isInvalid={errorMessage.includes("स्वयंपाक बाग तपशील")}
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
                    value={innovativeInitiatives}
                    onChange={(e) => setInnovativeInitiatives(e.target.value)}
                  />
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
              <Button type="submit" variant="primary" size="lg">
              पुढे चला
              </Button>
            </div>

            {errorMessage && (
              <Alert variant="danger" className="mt-3 text-center">
                {errorMessage}
              </Alert>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UpdateSchoolFormPage1;