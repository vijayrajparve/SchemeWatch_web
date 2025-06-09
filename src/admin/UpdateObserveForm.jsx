import React, { useState, useEffect } from "react";
import { db } from "../components/Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Form, Button, Alert, Row, Col, Spinner } from "react-bootstrap";
import DistrictTalukaSelector from "../components/DistrictTalukaSelector";

const UpdateObservationForm = ({ role }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selections, setSelections] = useState({ district: "", taluka: "" });
  const [udiseNumber, setUdiseNumber] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // Changed from `error` to `message` for success and error

  const fetchObservation = async () => {
    try {
      setLoading(true);
      console.log("Fetching document with ID:", id);
      const docRef = doc(db, "Observation_Form", id);
      console.log("Firestore doc reference created:", docRef.path);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Fetched data:", data);

        const district =
          data.district ||
          data.District ||
          data.districtName ||
          (data.location && data.location.district) ||
          "";
        const taluka =
          data.taluka ||
          data.Taluka ||
          data.talukaName ||
          (data.location && data.location.taluka) ||
          "";
        const fetchedSchoolName =
          data.schoolName ||
          data.SchoolName ||
          data.school_name ||
          data.School_Name ||
          data.name ||
          (data.school && data.school.name) ||
          "";

        setSelections({ district, taluka });
        console.log("Set selections:", { district, taluka });
        setUdiseNumber(data.udiseNumber || "");
        setSchoolName(fetchedSchoolName);
        console.log("Set schoolName:", fetchedSchoolName);
        setRemarks(data.remarks || "");

        if (!fetchedSchoolName) {
          console.warn("No schoolName found in document data for ID:", id);
          toast.warn("शाळेचे नाव डेटामध्ये सापडले नाही. कृपया डेटा तपासा.");
        }
      } else {
        console.warn("Document does not exist for ID:", id);
        setMessage("अशी कोणतीही निरीक्षणे सापडली नाही!");
        setTimeout(() => navigate("/observation-feedback"), 3000);
      }
    } catch (error) {
      console.error("Error fetching observation data:", error);
      let errorMessage = "निरीक्षणे आणताना त्रुटी: ";
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
    console.log("Component mounted, calling fetchObservation...");
    fetchObservation();
  }, [id]);

  useEffect(() => {
    console.log("Current selections state:", selections);
    console.log("Current schoolName state:", schoolName);
  }, [selections, schoolName]);

  const handleUdiseNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setUdiseNumber(value);
    }
  };

  const startDictation = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "mr-IN";

      recognition.onstart = () => toast.info("व्हॉईस इनपुट सुरू झाले...");
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setRemarks(transcript);
        toast.success("व्हॉइस इनपुट कॅप्चर झाले!");
      };
      recognition.onerror = (e) => {
        toast.error("व्हॉईस इनपुट त्रुटी: " + e.error);
      };
      recognition.onend = () => {
        recognition.stop();
      };

      recognition.start();
    } else {
      toast.error("या ब्राउझरमध्ये स्पीच रेकग्निशन समर्थित नाही.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate form fields
    if (!selections.district || !selections.taluka || !schoolName) {
      setMessage("कृपया जिल्हा, तालुका आणि शाळेचे नाव भरा.");
      setLoading(false);
      return;
    }

    if (!udiseNumber || udiseNumber.length !== 11) {
      setMessage("कृपया 11 अंकी UDISE क्रमांक भरा.");
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, "Observation_Form", id);
      await updateDoc(docRef, {
        district: selections.district,
        taluka: selections.taluka,
        udiseNumber,
        schoolName,
        remarks,
        timestamp: new Date().toISOString(),
      });
      setMessage("निरीक्षण यशस्वीरित्या अपडेट झाले!");

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin_dashboard");
        } else if (role === "Research Officer") {
          navigate("/officer_dashboard");
        } else {
          navigate("/observation-feedback");
        }
      }, 3000);
    } catch (error) {
      let errorMessage = "निरीक्षण अपडेट करताना त्रुटी: ";
      if (error.code === "permission-denied") {
        errorMessage += "आपल्याला या डेटा मध्ये प्रवेश नाही. (Permission denied)";
      } else {
        errorMessage += error.message;
      }
      setMessage(errorMessage);
      console.error("Update error:", error);
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
        प्रधानमंत्री पोषण शक्ती निर्माण योजना (अपडेट)
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
              districtId="update-observation-district"
              talukaId="update-observation-taluka"
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
                id="schoolName"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">अभिप्राय</Form.Label>
          <Form.Control
            as="textarea"
            id="remarks"
            rows={4}
            placeholder="व्हॉईस इनपुट येथे दिसेल..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <Button
            type="button"
            variant="primary"
            className="mt-2"
            onClick={startDictation}
            disabled={loading}
          >
            व्हॉईस इनपुट सुरू करा
          </Button>
        </Form.Group>

        <div className="d-flex justify-content-center mt-3">
          <button
            type="button"
            className="btn btn-primary btn-lg me-2"
            onClick={() => navigate('/observation-feedback')}
          >
            मागे जा
          </button>
          <Button
            type="submit"
            variant="primary"
            className="me-2"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "अपडेट करा"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (role === "admin") {
                navigate("/admin_dashboard");
              } else if (role === "Research Officer") {
                navigate("/officer_dashboard");
              } else {
                navigate("/observation-feedback");
              }
            }}
            disabled={loading}
          >
            रद्द करा
          </Button>
        </div>
      </Form>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UpdateObservationForm;