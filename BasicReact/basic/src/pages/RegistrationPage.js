import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function RegistrationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [countryCode, setCountryCode] = useState("+91"); // Default: India 🇮🇳
  const [mobileNumber, setMobileNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Clean and validate mobile number
    const cleanedNumber = mobileNumber.replace(/\D/g, "");
    if (cleanedNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          age: Number(age),
          mobileNumber: cleanedNumber, // only 10 digits stored
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        alert("Error saving user. Please check backend logs.");
        return;
      }

      const data = await response.json();
      console.log(data.message);

      // Reset form
      setFirstName("");
      setLastName("");
      setAge("");
      setMobileNumber("");
      setCountryCode("+91");

      // Navigate to Users List
      navigate("/users");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to connect to server.");
    }
  };

  return (
    <div className="container registration-page">
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        {/* 📱 Country Code + Mobile Number */}
        <div className="form-group">
          <label>Mobile Number:</label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
              }}
              required
            >
              <option value="+91">🇮🇳 +91 (India)</option>
              <option value="+1">🇺🇸 +1 (USA)</option>
              <option value="+44">🇬🇧 +44 (UK)</option>
              <option value="+61">🇦🇺 +61 (Australia)</option>
              <option value="+81">🇯🇵 +81 (Japan)</option>
              <option value="+49">🇩🇪 +49 (Germany)</option>
            </select>

            <input
              type="text"
              placeholder="Enter 10-digit number"
              value={mobileNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(-10); // only numbers, last 10 digits
                setMobileNumber(value);
              }}
              required
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
              }}
            />
          </div>
        </div>

        <button type="submit">Submit</button>
      </form>

      <button
        className="nav-btn"
        onClick={() => navigate("/users")}
      >
        Go to Users List →
      </button>
    </div>
  );
}

export default RegistrationPage;
