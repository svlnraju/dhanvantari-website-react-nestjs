import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3001/api/users";

function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("newest");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/list?page=${page}&sort=${sort}`);
      const data = await res.json();
      setUsers(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, sort]);

  const totalPages = Math.ceil(total / 10);

  // Export
  const handleExportPage = () =>
    window.open(`${API}/export/page?page=${page}&sort=${sort}`, "_blank");

  const handleExportAll = () =>
    window.open(`${API}/export/all?sort=${sort}`, "_blank");

  // Delete
  const deleteUser = async (id) => {
    if (!window.confirm("Delete patient?")) return;
    await fetch(`${API}/delete/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  // Modal open
  const viewProblem = (text) => {
    setSelectedProblem(text);
    setShowModal(true);
  };

  return (
    <div className="full-page">
      <h1 className="page-title">PATIENT LIST</h1>

      <div className="users-top">
        {/* Export Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="export-btn" onClick={handleExportPage}>
            Export Current Page
          </button>
          <button className="export-btn" onClick={handleExportAll}>
            Export All
          </button>
        </div>

        {/* Sorting */}
        <div className="users-sort">
          <span>Sort:</span>
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
          >
            <option value="newest">Newest → Oldest</option>
            <option value="oldest">Oldest → Newest</option>
            <option value="fname_asc">First Name A → Z</option>
            <option value="fname_desc">First Name Z → A</option>
            <option value="lname_asc">Last Name A → Z</option>
            <option value="lname_desc">Last Name Z → A</option>
            <option value="age_asc">Age Low → High</option>
            <option value="age_desc">Age High → Low</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>S No.</th>
              <th>First</th>
              <th>Last</th>
              <th>Age</th>
              <th>Mobile</th>
              <th>Problem</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No Patients Found
                </td>
              </tr>
            ) : (
              users.map((u, i) => (
                <tr key={u.id}>
                  {/* S NO CALCULATION */}
                  <td>{(page - 1) * 10 + i + 1}</td>

                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.age}</td>
                  <td>{u.mobileNumber}</td>

                  {/* Hidden Problem */}
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        viewProblem(u.problem || "No problem provided")
                      }
                    >
                      👁 View
                    </button>
                  </td>

                  {/* Actions */}
                  <td>
                    <button
                      className="update-btn"
                      onClick={() => navigate(`/update/${u.id}`)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      style={{ marginLeft: "8px" }}
                      onClick={() => deleteUser(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Registration
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Patient Problem</h2>
            <p>{selectedProblem}</p>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersListPage;
