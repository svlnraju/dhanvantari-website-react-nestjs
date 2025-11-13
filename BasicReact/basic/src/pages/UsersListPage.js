import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function UsersListPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch all users from backend
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

  // Delete user
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data.message);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="container users-page">
      <h2>Users List</h2>
      <div className="table-container">
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
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.age}</td>
                  <td>{user.mobileNumber}</td>
                  <td>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className="nav-btn" onClick={() => navigate("/")}>
        ← Back to Registration
      </button>
    </div>
  );
}

export default UsersListPage;
