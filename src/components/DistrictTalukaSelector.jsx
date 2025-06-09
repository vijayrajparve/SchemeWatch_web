import React, { useState, useEffect } from 'react';
import { Form, Alert, Row, Col } from 'react-bootstrap';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../components/Firebase';

const DistrictTalukaSelector = ({
  districtLabel = 'District',
  talukaLabel = 'Taluka',
  onSelectionChange,
  selections,
  districtId = 'district',
  talukaId = 'taluka',
  disabled = false
}) => {
  const [districts, setDistricts] = useState({});
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedTaluka, setSelectedTaluka] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('DistrictTalukaSelector received selections:', selections);
    const district = selections?.district || '';
    const taluka = selections?.taluka || '';
    setSelectedDistrict(district);
    setSelectedTaluka(taluka);
    console.log('DistrictTalukaSelector set state:', { selectedDistrict: district, selectedTaluka: taluka });
  }, [selections]);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        console.log('Fetching districts for selector...');
        const docRef = doc(db, 'districtTalukas', 'singleDocument');
        console.log("Firestore doc reference for districts:", docRef.path);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDistricts(data.districts || {});
          console.log('Fetched districts:', data.districts);
        } else {
          console.warn('No districts document found');
          setError('No district data available.');
        }
      } catch (err) {
        console.error('Error fetching districts:', err);
        let errorMessage = "Failed to fetch district data: ";
        if (err.code === "permission-denied") {
          errorMessage += "Permission denied to access district data.";
        } else if (err.code === "not-found") {
          errorMessage += "District data document not found.";
        } else if (err.code === "unavailable") {
          errorMessage += "Firestore service unavailable.";
        } else {
          errorMessage += err.message;
        }
        setError(errorMessage);
        console.log("Set district fetch error:", errorMessage);
      }
    };
    fetchDistricts();
  }, []);

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setSelectedTaluka('');
    if (onSelectionChange) {
      onSelectionChange({ district: districtCode, taluka: '' });
    }
  };

  const handleTalukaChange = (e) => {
    const talukaCode = e.target.value;
    setSelectedTaluka(talukaCode);
    if (onSelectionChange) {
      onSelectionChange({ district: selectedDistrict, taluka: talukaCode });
    }
  };

  return (
    <>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{districtLabel}</Form.Label>
            <Form.Select
              id={districtId}
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={disabled || Object.keys(districts).length === 0}
              required
            >
              <option value="">जिल्हा निवडा</option>
              {Object.entries(districts).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>{talukaLabel}</Form.Label>
            <Form.Select
              id={talukaId}
              value={selectedTaluka}
              onChange={handleTalukaChange}
              disabled={disabled || !selectedDistrict}
              required
            >
              <option value=""> तालुका निवडा  </option>
              {selectedDistrict &&
                Object.entries(districts[selectedDistrict]?.talukas || {}).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name} ({code})
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
    </>
  );
};

export default DistrictTalukaSelector;