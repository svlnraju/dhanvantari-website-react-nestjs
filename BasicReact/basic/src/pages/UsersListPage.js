import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function UsersListPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/list");
      const data = await response.json();
      setUsers(data.reverse());
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/delete/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="full-page">
      <h1 className="page-title">USERS LIST</h1>

      {/* Glass Wrapper for Better Visibility */}
      <div className="table-container widened">
        <div className="table-glass">

          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Age</th>
                <th>Mobile Number</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>{u.firstName}</td>
                    <td>{u.lastName}</td>
                    <td>{u.age}</td>
                    <td>{u.mobileNumber}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(u.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6">No records found</td></tr>
              )}
            </tbody>
          </table>

        </div>
      </div>

      <button className="nav-btn" onClick={() => navigate("/")}>
        ← Back to Registration
      </button>
    </div>
  );
}

export default UsersListPage;
