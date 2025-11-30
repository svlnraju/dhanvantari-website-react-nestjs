import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [modalUser, setModalUser] = useState(null);

  const navigate = useNavigate();
  const pageSize = 10;

  // ⚠️ IMPORTANT:
  // If you do NOT use global prefix "/api" in main.ts:
  // Use: "http://localhost:3001/users"
  //const API = "http://192.168.1.6:3001/api/users"; USE THIS TO CHECK ANDROID COMPATIBILITY
  const API = "http://localhost:3001/api/users";


  // ------------------ FETCH USERS ------------------
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/list`, {
        params: { page, sort },
      });

      setUsers(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, sort]);

  // ------------------ DELETE USER ------------------
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this patient?")) return;

    try {
      await axios.delete(`${API}/delete/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ------------------ EXPORT EXCEL ------------------
  const exportExcel = async () => {
    try {
      const res = await axios.get(`${API}/export/excel`, {
        responseType: "blob",
      });
      const link = window.URL.createObjectURL(new Blob([res.data]));

      const a = document.createElement("a");
      a.href = link;
      a.download = "patients.xlsx";
      a.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="full-page">
      <h1 className="page-title">PATIENTS LIST</h1>

      {/* --------- TOP BAR --------- */}
      <div className="users-top">
        <button className="export-btn" onClick={exportExcel}>
          📥 Export
        </button>

        <div className="users-sort">
          <span>Sort By:</span>
          <select
            className="sort-select"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1); // Reset to page 1 when sorting changes
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>

            <option value="fname_asc">First Name A → Z</option>
            <option value="fname_desc">First Name Z → A</option>

            <option value="lname_asc">Last Name A → Z</option>
            <option value="lname_desc">Last Name Z → A</option>

            <option value="age_asc">Age ↑</option>
            <option value="age_desc">Age ↓</option>
          </select>
        </div>
      </div>

      {/* --------- TABLE --------- */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Mobile</th>
              <th>Patient Problem</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 && (
              <tr className="no-users-row">
                <td colSpan="7">No patients found.</td>
              </tr>
            )}

            {users.map((user, i) => (
              <tr key={user.id}>
                <td>{(page - 1) * pageSize + i + 1}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.age}</td>
                <td>{user.mobileNumber}</td>

                <td>
                  <button className="btn-view" onClick={() => setModalUser(user)}>
                    👁 View
                  </button>
                </td>

                <td>
                  <button
                    className="btn-delete"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --------- PAGINATION --------- */}
      {total > pageSize && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            ⬅ Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next ➡
          </button>
        </div>
      )}

      {/* --------- BACK BUTTON --------- */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Registration
      </button>

      {/* --------- MODAL --------- */}
      {modalUser && (
        <div className="modal-overlay" onClick={() => setModalUser(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>Patient Problem</h2>
            <p>{modalUser.problem}</p>

            <button
              className="modal-close"
              onClick={() => setModalUser(null)}
            >
              Close ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
