import React, { useState } from "react";
import { db } from "../components/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Row, Col, Spinner } from "react-bootstrap"; // CHANGED: Added Spinner import
import { ToastContainer, toast } from "react-toastify"; // CHANGED: Added react-toastify import
import "react-toastify/dist/ReactToastify.css"; // CHANGED: Added react-toastify CSS import
import DistrictTalukaSelector from "../components/DistrictTalukaSelector";

const ObservationForm = () => {
  const navigate = useNavigate();
  const [selections, setSelections] = useState({ district: "", taluka: "" });
  const [udiseNumber, setUdiseNumber] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [remarks, setVoiceInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const startDictation = () => {
    if (window.hasOwnProperty("webkitSpeechRecognition")) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "mr-IN";
      recognition.start();

      recognition.onresult = (e) => {
        setVoiceInput(e.results[0][0].transcript);
        toast.success("व्हॉइस इनपुट कॅप्चर झाले!"); // CHANGED: Added toast notification for successful voice input
        recognition.stop();
      };

      recognition.onerror = (e) => {
        toast.error("व्हॉईस इनपुट त्रुटी: " + e.error); // CHANGED: Added toast notification for voice input error
        recognition.stop();
      };
    } else {
      toast.error("या ब्राउझरमध्ये स्पीच रेकग्निशन समर्थित नाही."); // CHANGED: Added toast notification for unsupported browser
    }
  };

  const handleUdiseNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setUdiseNumber(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!selections.district || !selections.taluka) {
      setMessage("कृपया जिल्हा आणि तालुका निवडा.");
      toast.error("कृपया जिल्हा आणि तालुका निवडा."); // CHANGED: Added toast notification for validation error
      setLoading(false);
      return;
    }

    if (!udiseNumber || udiseNumber.length !== 11) {
      setMessage("कृपया 11 अंकी UDISE क्रमांक भरा.");
      toast.error("कृपया 11 अंकी UDISE क्रमांक भरा."); // CHANGED: Added toast notification for UDISE validation error
      setLoading(false);
      return;
    }

    if (!schoolName) {
      setMessage("कृपया शाळेचे नाव भरा.");
      toast.error("कृपया शाळेचे नाव भरा."); // CHANGED: Added toast notification for school name validation error
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "Observation_Form"), {
        district: selections.district,
        taluka: selections.taluka,
        udiseNumber,
        schoolName,
        remarks,
        submittedAt: new Date()
      });

      setMessage("डेटा यशस्वीरित्या सबमिट झाला!");
      toast.success("फॉर्म यशस्वीरित्या सबमिट झाला!"); // CHANGED: Added toast notification for success
      setTimeout(() => navigate("/observation-feedback"), 3000); // CHANGED: Navigate to /observation-feedback after 3 seconds
      setSelections({ district: "", taluka: "" });
      setUdiseNumber("");
      setSchoolName("");
      setVoiceInput("");
    } catch (error) {
      let errorMessage = "डेटा सबमिट करताना त्रुटी आली: ";
      if (error.code === "permission-denied") {
        errorMessage += "आपल्याला या डेटा मध्ये प्रवेश नाही. (Permission denied)";
      } else {
        errorMessage += error.message;
      }
      setMessage(errorMessage);
      toast.error(errorMessage); // CHANGED: Added toast notification for error
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false); // CHANGED: Ensure loading is set to false after submission attempt
    }
  };

  return (
    <div className="container mt-4 p-4 border rounded bg-white">
      <h2 className="text-center border-bottom pb-2">
        प्रधानमंत्री पोषण शक्ती निर्माण योजना
      </h2>

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <DistrictTalukaSelector
              districtLabel="जिल्हा"
              talukaLabel="तालुका"
              onSelectionChange={setSelections}
              districtId="observation-district"
              talukaId="observation-taluka"
              disabled={loading} // CHANGED: Disable DistrictTalukaSelector during loading
            />
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">UDISE क्रमांक</Form.Label>
              <Form.Control
                type="text"
                id="udiseNumber"
                value={udiseNumber}
                onChange={handleUdiseNumberChange}
                required
                pattern="\d{11}"
                title="UDISE क्रमांक 11 अंकी असावा"
                disabled={loading} // CHANGED: Disable input during loading
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">शाळेचे नाव</Form.Label>
              <Form.Control
                type="text"
                id="school-name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
                disabled={loading} // CHANGED: Disable input during loading
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">निरीक्षण</Form.Label>
          <Form.Control
            as="textarea"
            id="remarks"
            rows={4}
            placeholder="व्हॉईस इनपुट येथे दिसेल..."
            value={remarks}
            onChange={(e) => setVoiceInput(e.target.value)}
            disabled={loading} // CHANGED: Disable input during loading
          />
          <Button
            type="button"
            variant="primary"
            className="mt-2"
            onClick={startDictation}
            disabled={loading} // CHANGED: Disable voice input button during loading
          >
            व्हॉईस इनपुट सुरू करा
          </Button>
        </Form.Group><br></br>

        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary btn-lg me-2"
            onClick={() => navigate('/observation-feedback')}
            disabled={loading} // CHANGED: Disable back button during loading
          >
            मागे जा
          </button>
          <Button
            type="submit"
            variant="primary"
            className="btn-lg me-2"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "सबमिट"} {/* CHANGED: Show spinner during loading */}
          </Button>
        </div>

        {message && (
          <Alert variant={message.includes("त्रुटी") ? "danger" : "success"} className="mt-3">
            {message}
          </Alert>
        )}
      </Form>
      <ToastContainer position="top-right" autoClose={3000} /> {/* CHANGED: Added ToastContainer for notifications */}
    </div>
  );
};

export default ObservationForm;