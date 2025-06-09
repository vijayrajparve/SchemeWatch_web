import React, { useEffect, useState } from "react";
import { db } from "../components/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Alert, Row, Col, FormCheck, Spinner } from "react-bootstrap";
import DistrictTalukaSelector from "../components/DistrictTalukaSelector";

const UpdateParentForm = ({ role }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selections, setSelections] = useState({ district: "", taluka: "" });
  const [udiseNumber, setUdiseNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [parentName, setParentName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [child1, setChild1] = useState("");
  const [child1Sec, setChild1Sec] = useState("");
  const [child2, setChild2] = useState("");
  const [child2Sec, setChild2Sec] = useState("");
  const [parentEducation, setParentEducation] = useState("");
  const [address, setAddress] = useState("");
  const [sendChildDaily, setSendChildDaily] = useState(null);
  const [reason, setReason] = useState("");
  const [weightGain, setWeightGain] = useState(null);
  const [sickFrequency, setSickFrequency] = useState(null);
  const [studyProgress, setStudyProgress] = useState(null);
  const [concentration, setConcentration] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [impactOfNutritionScheme, setImpactOfNutritionScheme] = useState("");
  const [effectOnAfternoonAttendance, setEffectOnAfternoonAttendance] = useState("");
  const [effectOfNutritionDietPlan, setEffectOfNutritionDietPlan] = useState("");
  const [improvementSuggestions, setImprovementSuggestions] = useState("");

  const fetchParent = async () => {
    try {
      setLoading(true);
      console.log("Fetching document with ID:", id);
      const docRef = doc(db, "Parent_Form", id);
      console.log("Firestore doc reference created:", docRef.path);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Fetched data:", data);

        const district = data.district || data.District || data.districtName || (data.location && data.location.district) || "";
        const taluka = data.taluka || data.Taluka || data.talukaName || (data.location && data.location.taluka) || "";
        
        setSelections({ district, taluka });
        console.log("Set selections:", { district, taluka });

        setUdiseNumber(data.udiseNumber || "");
        setPhone(data.phone || "");
        setParentName(data.parentName || "");
        setSchoolName(data.schoolName || "");
        setChild1(data.child1 || "");
        setChild1Sec(data.child1Sec || "");
        setChild2(data.child2 || "");
        setChild2Sec(data.child2Sec || "");
        setParentEducation(data.parentEducation || "");
        setAddress(data.address || "");

        setSendChildDaily(data.sendChildDaily !== undefined ? (data.sendChildDaily ? "1" : "0") : null);
        setReason(data.reason || "");
        setWeightGain(data.weightGain !== undefined ? (data.weightGain ? "1" : "0") : null);
        setSickFrequency(data.sickFrequency !== undefined ? (data.sickFrequency ? "1" : "0") : null);
        setStudyProgress(data.studyProgress !== undefined ? (data.studyProgress ? "1" : "0") : null);
        setConcentration(data.concentration !== undefined ? (data.concentration ? "1" : "0") : null);
        setNutrition(data.nutrition !== undefined ? (data.nutrition ? "1" : "0") : null);
        setAttendance(data.attendance !== undefined ? (data.attendance ? "1" : "0") : null);

        setImpactOfNutritionScheme(data.impactOfNutritionScheme !== undefined ? String(data.impactOfNutritionScheme) : "");
        setEffectOnAfternoonAttendance(data.effectOnAfternoonAttendance !== undefined ? String(data.effectOnAfternoonAttendance) : "");
        setEffectOfNutritionDietPlan(data.effectOfNutritionDietPlan !== undefined ? String(data.effectOfNutritionDietPlan) : "");

        setImprovementSuggestions(data.improvementSuggestions || "");
      } else {
        console.warn("Document does not exist for ID:", id);
        setMessage("अशी कोणतीही पालक फॉर्म सापडली नाही! (Document not found)");
        setTimeout(() => navigate("/officer_dashboard"), 3000);
      }
    } catch (error) {
      console.error("Error fetching parent data:", error);
      let errorMessage = "पालक डेटा आणताना त्रुटी: ";
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
    console.log("Component mounted, calling fetchParent...");
    fetchParent();
  }, [id]);
  
  useEffect(() => {
    console.log("Current selections state:", selections);
  }, [selections]);

  const handleUdiseNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setUdiseNumber(value);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { key: selections.district, label: "जिल्हा" },
      { key: selections.taluka, label: "तालुका" },
      { key: parentName, label: "पालकाचे संपूर्ण नाव" },
      { key: schoolName, label: "शाळेचे नाव" },
      { key: child1, label: "पाल्याचे नाव १" },
      { key: child1Sec, label: "पाल्याची इयत्ता व तुकडी १" },
      { key: parentEducation, label: "पालकाची शैक्षणिक पात्रता" },
      { key: address, label: "पालकाचा निवासाचा संपूर्ण पत्ता" },
      { key: sendChildDaily, label: "मुलांना दररोज शाळेत पाठवतात का?" },
      { key: weightGain, label: "मुलांचे/मुलींचे वजन वाढले का?" },
      { key: sickFrequency, label: "वारंवार आजारी पडायाचे प्रमाण कमी झाले का?" },
      { key: studyProgress, label: "अभ्यासातील प्रगती चांगली झाली का?" },
      { key: concentration, label: "अभ्यासातील एकाग्रता वाढली का?" },
      { key: nutrition, label: "मुला-मुलींचे पोषण चांगले होत आहे का?" },
      { key: attendance, label: "नियमित शाळेत जाण्यामध्ये सुधारणा झाली का?" },
      { key: impactOfNutritionScheme, label: "शालेय पोषण आहार योजनेचा प्रभाव" },
      { key: effectOnAfternoonAttendance, label: "दुपारच्या उपस्थितीवर जेवणाचा प्रभाव" },
      { key: effectOfNutritionDietPlan, label: "सामाजिकीकरण प्रक्रियेवर पोषण आहार योजनेचा प्रभाव" }
    ];
    const missingFields = [];

    requiredFields.forEach(({ key, label }) => {
      if (!key && key !== 0) {
        missingFields.push(label);
      }
    });

    if (!udiseNumber || udiseNumber.length !== 11) {
      missingFields.push("शाळेचा UDISE क्रमांक");
    }

    if (!phone || phone.length !== 10) {
      missingFields.push("मोबाइल नंबर");
    }

    if (sendChildDaily === "0" && !reason) {
      missingFields.push("नसल्यास कारण");
    }

    return missingFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const missingFields = validateForm();
    if (missingFields.length > 0) {
      setMessage(`कृपया खालील आवश्यक फील्ड भरा: ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "Parent_Form", id);
      await updateDoc(docRef, {
        district: selections.district,
        taluka: selections.taluka,
        udiseNumber,
        phone,
        parentName,
        schoolName,
        child1,
        child1Sec,
        child2,
        child2Sec,
        parentEducation,
        address,
        sendChildDaily,
        reason,
        weightGain,
        sickFrequency,
        studyProgress,
        concentration,
        nutrition,
        attendance,
        impactOfNutritionScheme,
        effectOnAfternoonAttendance,
        effectOfNutritionDietPlan,
        improvementSuggestions,
        updatedAt: new Date()
      });
      setMessage("फॉर्म यशस्वीरित्या अपडेट झाला!");

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin_dashboard");
        } else if (role === "Research Officer") {
          navigate("/officer_dashboard");
        } else {
          navigate("/parent-feedback");
        }
      }, 3000);
    } catch (error) {
      setMessage("फॉर्म अपडेट करताना त्रुटी: " + error.message);
      console.error("फॉर्म अपडेट करताना त्रुटी: ", error);
    } finally {
      setLoading(false);
    }
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
    <div className="container mt-4 p-4 border rounded bg-white">
      <h2 className="text-center border-bottom pb-2">
        पालकांचा अभिप्राय प्रश्नावली (अपडेट फॉर्म)
      </h2>
      {message && (
        <Alert
          variant={message.includes("यशस्वी") ? "success" : "danger"}
          className="mt-3 text-center"
        >
          {message}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <DistrictTalukaSelector
              districtLabel="जिल्हा"
              talukaLabel="तालुका"
              onSelectionChange={setSelections}
              selections={selections}
              districtId="update-parent-district"
              talukaId="update-parent-taluka"
            />
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">शाळेचा UDISE क्रमांक</Form.Label>
              <Form.Control
                type="text"
                name="udiseNumber"
                value={udiseNumber}
                onChange={handleUdiseNumberChange}
                required
                pattern="\d{11}"
                title="UDISE क्रमांक 11 अंकी असावा"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">१. पालकाचे संपूर्ण नाव</Form.Label>
              <Form.Control
                type="text"
                id="parentName"
                name="parentName"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">१.१ शाळेचे नाव</Form.Label>
              <Form.Control
                type="text"
                id="schoolName"
                name="schoolName"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <h6 className="fw-bold mb-3">२. सदर शाळेत शिकत असलेल्या पाल्यांचे नावे</h6>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">१</Form.Label>
              <Form.Control
                type="text"
                id="child1"
                name="child1"
                value={child1}
                onChange={(e) => setChild1(e.target.value)}
                required
              />
              <Form.Label className="fw-bold mt-2">इयत्ता व तुकडी</Form.Label>
              <Form.Control
                type="text"
                id="child1Sec"
                name="child1Sec"
                value={child1Sec}
                onChange={(e) => setChild1Sec(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">२</Form.Label>
              <Form.Control
                type="text"
                id="child2"
                name="child2"
                value={child2}
                onChange={(e) => setChild2(e.target.value)}
              />
              <Form.Label className="fw-bold mt-2">इयत्ता व तुकडी</Form.Label>
              <Form.Control
                type="text"
                id="child2Sec"
                name="child2Sec"
                value={child2Sec}
                onChange={(e) => setChild2Sec(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">३. पालकाची शैक्षणिक पात्रता</Form.Label>
              <Form.Control
                type="text"
                id="parentEducation"
                name="parentEducation"
                value={parentEducation}
                onChange={(e) => setParentEducation(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">४. पालकाचा निवासाचा संपूर्ण पत्ता</Form.Label>
              <Form.Control
                as="textarea"
                id="address"
                rows={2}
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">५. मुलांना दररोज शाळेत पाठवतात का?</Form.Label>
              <div>
                <FormCheck
                  inline
                  type="radio"
                  label="होय"
                  name="sendChildDaily"
                  id="sendChildDailyYes"
                  value="1"
                  checked={sendChildDaily === "1"}
                  onChange={(e) => setSendChildDaily(e.target.value)}
                  required
                />
                <FormCheck
                  inline
                  type="radio"
                  label="नाही"
                  name="sendChildDaily"
                  id="sendChildDailyNo"
                  value="0"
                  checked={sendChildDaily === "0"}
                  onChange={(e) => setSendChildDaily(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">५.१ नसल्यास कारण नमूद करायात यावेः</Form.Label>
              <Form.Control
                as="textarea"
                id="reason"
                rows={2}
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={sendChildDaily !== "0"}
              />
            </Form.Group>
          </Col>
        </Row>

        <h6 className="fw-bold mb-3">६. मुलांवर पोषण आहाराचा प्रभाव</h6>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">६.१ मुलांचे/मुलींचे वजन वाढले का?</Form.Label>
              <div>
                <FormCheck
                  inline
                  type="radio"
                  label="होय"
                  name="weightGain"
                  id="weightGainYes"
                  value="1"
                  checked={weightGain === "1"}
                  onChange={(e) => setWeightGain(e.target.value)}
                  required
                />
                <FormCheck
                  inline
                  type="radio"
                  label="नाही"
                  name="weightGain"
                  id="weightGainNo"
                  value="0"
                  checked={weightGain === "0"}
                  onChange={(e) => setWeightGain(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">६.२ वारंवार आजारी पडायाचे प्रमाण कमी झाले का?</Form.Label>
              <div>
                <FormCheck
                  inline
                  type="radio"
                  label="होय"
                  name="sickFrequency"
                  id="sickFrequencyYes"
                  value="1"
                  checked={sickFrequency === "1"}
                  onChange={(e) => setSickFrequency(e.target.value)}
                  required
                />
                <FormCheck
                  inline
                  type="radio"
                  label="नाही"
                  name="sickFrequency"
                  id="sickFrequencyNo"
                  value="0"
                  checked={sickFrequency === "0"}
                  onChange={(e) => setSickFrequency(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">६.३ अभ्यासातील प्रगती चांगली झाली का?</Form.Label>
              <div>
                <FormCheck
                  inline
                  type="radio"
                  label="होय"
                  name="studyProgress"
                  id="studyProgressYes"
                  value="1"
                  checked={studyProgress === "1"}
                  onChange={(e) => setStudyProgress(e.target.value)}
                  required
                />
                <FormCheck
                  inline
                  type="radio"
                  label="नाही"
                  name="studyProgress"
                  id="studyProgressNo"
                  value="0"
                  checked={studyProgress === "0"}
                  onChange={(e) => setStudyProgress(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">६.४ अभ्यासातील एकाग्रता वाढली का?</Form.Label>
              <div>
                <FormCheck
                  inline
                  type="radio"
                  label="होय"
                  name="concentration"
                  id="concentrationYes"
                  value="1"
                  checked={concentration === "1"}
                  onChange={(e) => setConcentration(e.target.value)}
                  required
                />
                <FormCheck
                  inline
                  type="radio"
                  label="नाही"
                  name="concentration"
                  id="concentrationNo"
                  value="0"
                  checked={concentration === "0"}
                  onChange={(e) => setConcentration(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">६.५ मुला-मुलींचे पोषण चांगले होत आहे का?</Form.Label>
              <div>
                <FormCheck
                  inline
                  type="radio"
                  label="होय"
                  name="nutrition"
                  id="nutritionYes"
                  value="1"
                  checked={nutrition === "1"}
                  onChange={(e) => setNutrition(e.target.value)}
                  required
                />
                <FormCheck
                  inline
                  type="radio"
                  label="नाही"
                  name="nutrition"
                  id="nutritionNo"
                  value="0"
                  checked={nutrition === "0"}
                  onChange={(e) => setNutrition(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">६.६ नियमित शाळेत जाण्यामध्ये सुधारणा झाली का?</Form.Label>
              <div>
                <FormCheck
                  inline
                  type="radio"
                  label="होय"
                  name="attendance"
                  id="attendanceYes"
                  value="1"
                  checked={attendance === "1"}
                  onChange={(e) => setAttendance(e.target.value)}
                  required
                />
                <FormCheck
                  inline
                  type="radio"
                  label="नाही"
                  name="attendance"
                  id="attendanceNo"
                  value="0"
                  checked={attendance === "0"}
                  onChange={(e) => setAttendance(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                ७. विद्यार्थ्यांना शालेय नियमित जाण्यासाठी शालेय पोषण आहार योजनेचा प्रभाव
              </Form.Label>
              <div>
                <FormCheck
                  type="radio"
                  label="नियमितपणे शाळेत जाणे"
                  name="impactOfNutritionScheme"
                  id="attendSchoolRegularly"
                  value="1"
                  checked={impactOfNutritionScheme === "1"}
                  onChange={(e) => setImpactOfNutritionScheme(e.target.value)}
                  required
                />
                <FormCheck
                  type="radio"
                  label="कधीकधी जाणे"
                  name="impactOfNutritionScheme"
                  id="sometimesGoing"
                  value="2"
                  checked={impactOfNutritionScheme === "2"}
                  onChange={(e) => setImpactOfNutritionScheme(e.target.value)}
                  required
                />
                <FormCheck
                  type="radio"
                  label="फक्त आहारासाठी जाणे"
                  name="impactOfNutritionScheme"
                  id="justGoForTheDiet"
                  value="3"
                  checked={impactOfNutritionScheme === "3"}
                  onChange={(e) => setImpactOfNutritionScheme(e.target.value)}
                  required
                />
                <FormCheck
                  type="radio"
                  label="जात नाही"
                  name="impactOfNutritionScheme"
                  id="notGoing"
                  value="4"
                  checked={impactOfNutritionScheme === "4"}
                  onChange={(e) => setImpactOfNutritionScheme(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">८. दुपारच्या उपस्थितीवर जेवणाचा प्रभाव</Form.Label>
              <div>
                <FormCheck
                  type="radio"
                  label="वाढलेली"
                  name="effectOnAfternoonAttendance"
                  id="increase1"
                  value="1"
                  checked={effectOnAfternoonAttendance === "1"}
                  onChange={(e) => setEffectOnAfternoonAttendance(e.target.value)}
                  required
                />
                <FormCheck
                  type="radio"
                  label="कोणताही परिणाम नाही"
                  name="effectOnAfternoonAttendance"
                  id="noEffect1"
                  value="2"
                  checked={effectOnAfternoonAttendance === "2"}
                  onChange={(e) => setEffectOnAfternoonAttendance(e.target.value)}
                  required
                />
                <FormCheck
                  type="radio"
                  label="कमी"
                  name="effectOnAfternoonAttendance"
                  id="decrease1"
                  value="3"
                  checked={effectOnAfternoonAttendance === "3"}
                  onChange={(e) => setEffectOnAfternoonAttendance(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">
                ९. मुलांच्या सामाजिकीकरण प्रक्रियेवर पोषण आहार योजनेचा प्रभाव तुम्हाला कसा वाटतो ?
              </Form.Label>
              <div>
                <FormCheck
                  type="radio"
                  label="वाढलेली"
                  name="effectOfNutritionDietPlan"
                  id="increase2"
                  value="1"
                  checked={effectOfNutritionDietPlan === "1"}
                  onChange={(e) => setEffectOfNutritionDietPlan(e.target.value)}
                  required
                />
                <FormCheck
                  type="radio"
                  label="कोणताही परिणाम नाही"
                  name="effectOfNutritionDietPlan"
                  id="noEffect2"
                  value="2"
                  checked={effectOfNutritionDietPlan === "2"}
                  onChange={(e) => setEffectOfNutritionDietPlan(e.target.value)}
                  required
                />
                <FormCheck
                  type="radio"
                  label="कमी"
                  name="effectOfNutritionDietPlan"
                  id="decrease2"
                  value="3"
                  checked={effectOfNutritionDietPlan === "3"}
                  onChange={(e) => setEffectOfNutritionDietPlan(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">१०. योजनेमध्ये सुधारणा करण्यासाठी सूचना</Form.Label>
              <Form.Control
                as="textarea"
                id="improvementSuggestions"
                rows={3}
                name="improvementSuggestions"
                value={improvementSuggestions}
                onChange={(e) => setImprovementSuggestions(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">मोबाइल नंबर</Form.Label>
              <Form.Control
                type="tel"
                placeholder="+91 1234567890"
                name="phone"
                value={phone}
                onChange={handlePhoneChange}
                required
                pattern="\d{10}"
                title="मोबाइल नंबर 10 अंकी असावा"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-center mt-4">
        <button
      type="button"
      className="btn btn-primary btn-lg me-2"
      onClick={() => navigate('/officer_dashboard')}
    >
      मागे जा
    </button>
          <Button
            type="submit"
            variant="primary"
            className="me-2"
            disabled={loading}
          >
            अपडेट करा
          </Button>
          
        </div>
      </Form>
    </div>
  );
};

export default UpdateParentForm;