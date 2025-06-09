import React, { useEffect, useState } from "react";
import { db } from "../components/Firebase";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
// Added FontAwesomeIcon and faArrowLeft imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function ObservationFormTable() {
  const [observeData, setObserveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchObserveData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Observation_Form"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setObserveData(data);
    } catch (error) {
      toast.error("निरीक्षण डेटा आणण्यात त्रुटी: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObserveData();
  }, []);

  const handleObservationDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Observation_Form", id));
      toast.success("निरीक्षण नोंद यशस्वीरित्या हटवली!");
      fetchObserveData();
    } catch (error) {
      toast.error("निरीक्षण नोंद हटवण्यात त्रुटी: " + error.message);
    }
  };

  const updateObservationForm = (id) => navigate(`/update_observation_form/${id}`);
  const addObservationEntry = () => navigate("/observation_form");

  const displayValue = (value) => (value != null ? value : "उपलब्ध नाही");

  const fieldMappings = [
    { label: "A", key: "district" },
    { label: "B", key: "taluka" },
    { label: "C", key: "udiseNumber" },
    { label: "D", key: "remarks" },
  ];

  const downloadObservationExcel = () => {
    if (observeData.length === 0)
      return toast.warn("डाउनलोड करण्यासाठी निरीक्षण डेटा उपलब्ध नाही!");

    const headers = fieldMappings.map(field => field.label);
    const dataRows = observeData.map((record) =>
      fieldMappings.map(field => record[field.key] || "N/A")
    );

    const excelData = [headers, ...dataRows];
    const ws = XLSX.utils.aoa_to_sheet(excelData);

    fieldMappings.forEach((_, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      ws[cellRef].s = {
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" }
        }
      };
    });

    ws['!cols'] = fieldMappings.map(() => ({ wch: 20 }));
    ws['!rows'] = [{ hpx: 25 }, ...dataRows.map(() => ({ hpx: 20 }))];

    for (let r = 1; r <= dataRows.length; r++) {
      for (let c = 0; c < fieldMappings.length; c++) {
        const cellRef = XLSX.utils.encode_cell({ r, c });
        if (!ws[cellRef]) ws[cellRef] = { v: "N/A" };
        ws[cellRef].s = {
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "निरीक्षण डेटा");
    XLSX.writeFile(wb, "observation_data.xlsx");
  };

  const filteredData = observeData.filter((observe) =>
    fieldMappings.some((field) => {
      const value = observe[field.key];
      return (
        value &&
        typeof value === "string" &&
        value.toLowerCase().includes(search.toLowerCase())
      );
    })
  );

  return (
    <div className="container mt-4">
      {/* Added: Back button to navigate to admin_dashboard */}
      <div className="mb-3">
        <button
          onClick={() => navigate("/admin_dashboard")}
          className="btn btn-outline-secondary btn-sm"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
          Back
        </button>
      </div>
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title">निरीक्षण अभिप्राय फॉर्म</h5>
          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              className="form-control w-25"
              placeholder="UDISE क्रमांक शोधा..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div>
              <button className="btn btn-outline-success me-2" onClick={addObservationEntry}>
                Add Entry
              </button>
              <button className="btn btn-outline-success me-2" onClick={downloadObservationExcel}>
                Download Excel
              </button>
            </div>
          </div>
          <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
            {loading ? (
              <p className="text-center">लोड होत आहे...</p>
            ) : (
              <table className="table table-striped text-center">
                <thead style={{ position: "sticky", top: 0, background: "#f8f9fa", zIndex: 1 }}>
                  <tr>
                    <th>#</th>
                    {fieldMappings.map((field, index) => (
                      <th key={index}>{field.label}</th>
                    ))}
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((observe, index) => (
                      <tr key={observe.id}>
                        <td>{index + 1}</td>
                        {fieldMappings.map((field, idx) => (
                          <td key={idx}>{displayValue(observe[field.key])}</td>
                        ))}
                        <td>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => updateObservationForm(observe.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this Observation Form?")) {
                                handleObservationDelete(observe.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={fieldMappings.length + 2} className="text-center">
                        डेटा उपलब्ध नाही
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ObservationFormTable;