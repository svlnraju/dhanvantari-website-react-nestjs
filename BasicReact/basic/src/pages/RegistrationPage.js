import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AsYouType } from "libphonenumber-js";
import "../App.css";

function RegistrationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [mobileNumber, setMobileNumber] = useState("");
  const [cleanNumber, setCleanNumber] = useState("");
  const navigate = useNavigate();

  const handleNumberChange = (value) => {
    const formatted = new AsYouType(countryCode).input(value);
    const cleanDigits = value.replace(/\D/g, "").slice(-10);

    setMobileNumber(formatted);
    setCleanNumber(cleanDigits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cleanNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          age: Number(age),
          mobileNumber: cleanNumber,
        }),
      });

      setFirstName("");
      setLastName("");
      setAge("");
      setMobileNumber("");
      setCleanNumber("");
      setCountryCode("IN");

      navigate("/users");
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="full-page">
      <h1 className="page-title">USER REGISTRATION</h1>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <div className="mobile-flex">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
              <option value="IN">🇮🇳 +91</option>
              <option value="US">🇺🇸 +1</option>
              <option value="GB">🇬🇧 +44</option>
              <option value="AU">🇦🇺 +61</option>
              <option value="JP">🇯🇵 +81</option>
              <option value="DE">🇩🇪 +49</option>
            </select>

            <input
              type="tel"
              placeholder="Enter number"
              value={mobileNumber}
              onChange={(e) => handleNumberChange(e.target.value)}
              required
            />
          </div>
        </div>

        <button className="submit-btn">Submit</button>
      </form>

      <button className="nav-btn" onClick={() => navigate("/users")}>
        Go to Users List →
      </button>
    </div>
  );
}

export default RegistrationPage;
