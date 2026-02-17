import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState([]);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUsername(decoded.username);

      fetchDocuments(token);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };


  const fetchDocuments = async (token) => {
    try {
      const res = await API.get("http://localhost:5000/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDocuments(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setDocuments([]);
      } else {
        setError("Failed to fetch documents.");
      }
    }
  };

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];

    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setFile(uploadedFile);
    setError("");

    const formData = new FormData();
    formData.append("file", uploadedFile);

    const token = localStorage.getItem("token");

    try {
      const res = await API.post(
        "http://localhost:5000/documents/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      fetchDocuments(token);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Error uploading file.");
      } else {
        setError("Network error or server issue.");
      }
    } finally {
      setFile(null);
      e.target.value = null;
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await API.delete(`http://localhost:5000/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete document.");
    }
  };


  const confirmDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (confirmed) {
      handleDelete(id);
    }
  };

  return (<>
    <div className="header">
      <h1>Dashboard de {username && username}</h1>

      <button className="logout-button" onClick={handleLogout}>
        Déconnexion
      </button>
    </div>

    <div className="docForm">
      <div className="pdfForm">
        <form>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
            id="fileInput"
            className="file-input"
          />

          <label htmlFor="fileInput" className="file-label">
            {file ? "Upload en cours..." : "Choisir un fichier PDF"}
          </label>
        </form>
      </div>

      <div className="status">
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>

    <div className="separation" />

    <div className="dowloadedFiles">
      <h3 className="section-title">Vos documents téléchargés</h3>
      {documents.length === 0 ? (
        <p className="empty-state">No documents uploaded yet.</p>
      ) : (
        <div className="documents-grid">
          {documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <p
                className="document-link"
              >
                {doc.filename}
              </p>

              <button
                className="delete-button"
                onClick={() => confirmDelete(doc.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

  </>);
}

export default Dashboard;
