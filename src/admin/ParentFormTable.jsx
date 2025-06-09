import React, { useEffect, useState } from "react";
import { db } from "../components/Firebase";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function ParentFormTable() {
  const [parentData, setParentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchParentData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Parent_Form"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setParentData(data);
    } catch (error) {
      toast.error("Error fetching parent data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParentData();
  }, []);

  const handleParentDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Parent_Form", id));
      toast.success("Parent entry deleted successfully!");
      fetchParentData();
    } catch (error) {
      toast.error("Error deleting parent entry: " + error.message);
    }
  };

  const updateParentForm = (id) => navigate(`/update_parent_form/${id}`);
  const addParentEntry = () => navigate("/parent_form");

  const displayValue = (value) => (value != null ? value : "N/A");

  const fieldMappings = [
    //{ label: "प्रदेश", key: "region" },
    { label: "A", key: "district" },
    { label: "B", key: "taluka" },
    { label: "C", key: "udiseNumber" },
   // { label: "पालकाचे संपूर्ण नाव", key: "parentName" },
    //{ label: "शाळेचे नाव", key: "schoolName" },
    //{ label: "Child 1", key: "child1" },
    //{ label: "इयत्ता व तुकडी (Child 1)", key: "child1Sec" },
    //{ label: "Child 2", key: "child2" },
    //{ label: "इयत्ता व तुकडी (Child 2)", key: "child2Sec" },
    //{ label: "पालकाची शैक्षणिक पात्रता", key: "parentEducation" },
    //{ label: "पालकाचा निवासाचा संपूर्ण पत्ता", key: "address" },
    { label: "D", key: "sendChildDaily" },
   // { label: "नसल्यास कारण नमूद करयायात यावेः", key: "reason" },
    { label: "E1", key: "weightGain" },
    { label: "E2", key: "sickFrequency" },
    { label: "E3", key: "studyProgress" },
  //  { label: "अभ्यासातील एकाग्रता वाढली का?", key: "concentration" },
    { label: "E4", key: "nutrition" },
    { label: "E5", key: "attendance" },
    { label: "E6", key: "impactOfNutritionScheme" },
    { label: "E7", key: "effectOnAfternoonAttendance" },
    { label: "E8", key: "effectOfNutritionDietPlan" },
   // { label: "योजनेमध्ये सुधारणा करण्यासाठी सूचना", key: "improvementSuggestions" },
  ];

  const downloadParentExcel = () => {
    if (parentData.length === 0) return toast.warn("No parent data available to download!");

    const headers = fieldMappings.map((field) => field.label);
    const dataRows = parentData.map((record) =>
      fieldMappings.map((field) =>
        record[field.key] != null ? record[field.key] : "N/A"
      )
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
          right: { style: "thin" },
        },
      };
    });

    ws["!cols"] = fieldMappings.map(() => ({ wch: 20 }));
    ws["!rows"] = [{ hpx: 25 }, ...dataRows.map(() => ({ hpx: 20 }))];

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
            right: { style: "thin" },
          },
        };
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parent Data");
    XLSX.writeFile(wb, "parent_data.xlsx");
  };

  const filteredData = parentData.filter((parent) =>
    fieldMappings.some((field) =>
      parent[field.key]?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="container mt-4">
      <div className="mb-3">
        {/* Updated: Removed isDarkMode and used static btn-outline-secondary */}
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
          <h5 className="card-title">Parent Feedback Form</h5>
          <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              className="form-control w-25"
              placeholder="UDISE क्रमांक शोधा..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div>
              <button className="btn btn-outline-success me-2" onClick={addParentEntry}>
                Add Entry
              </button>
              <button className="btn btn-outline-success me-2" onClick={downloadParentExcel}>
                Download Excel
              </button>
            </div>
          </div>
          <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <table className="table table-striped text-center">
                <thead style={{ position: "sticky", top: 0, background: "#f8f9fa", zIndex: 1 }}>
                  <tr>
                    <th>#</th>
                    {fieldMappings.map((field, index) => (
                      <th key={index}>{field.label}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((parent, index) => (
                      <tr key={parent.id}>
                        <td>{index + 1}</td>
                        {fieldMappings.map((field, idx) => (
                          <td key={idx}>{displayValue(parent[field.key])}</td>
                        ))}
                        <td>
                          <button
                            className="btn btn-primary btn-sm me-2"
                            onClick={() => updateParentForm(parent.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this Parent Form?")) {
                                handleParentDelete(parent.id);
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
                        No data available
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

export default ParentFormTable;