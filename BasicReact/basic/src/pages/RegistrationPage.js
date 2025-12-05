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
  const [problem, setProblem] = useState("");

  const navigate = useNavigate();

  const handleNumberChange = (value) => {
    const formatted = new AsYouType(countryCode).input(value);
    const digits = value.replace(/\D/g, "").slice(-10);

    setMobileNumber(formatted);
    setCleanNumber(digits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cleanNumber.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          age: Number(age),
          mobileNumber: cleanNumber,
          problem,
        }),
      });

      if (!res.ok) throw new Error("Failed to save patient");

      alert("Patient Registered Successfully!");

      setFirstName("");
      setLastName("");
      setAge("");
      setMobileNumber("");
      setCleanNumber("");
      setProblem("");
      setCountryCode("IN");

      navigate("/users");
    } catch (err) {
      console.error(err);
      alert("Failed to register patient. Check console.");
    }
  };

  return (
    <div className="full-page">
      <h1 className="page-title">PATIENT REGISTRATION</h1>

      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="floating-container">
          <input
            type="text"
            value={firstName}
            placeholder=" "
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label>First Name</label>
        </div>

        <div className="floating-container">
          <input
            type="text"
            value={lastName}
            placeholder=" "
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <label>Last Name</label>
        </div>

        <div className="floating-container">
          <input
            type="number"
            value={age}
            placeholder=" "
            onChange={(e) => setAge(e.target.value)}
            required
          />
          <label>Age</label>
        </div>

        <div className="mobile-flex floating-mobile">
          <select
            className="country-select"
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

          <div className="floating-container phone-box">
            <input
              type="tel"
              value={mobileNumber}
              placeholder=" "
              onChange={(e) => handleNumberChange(e.target.value)}
              required
            />
            <label>Mobile Number</label>
          </div>
        </div>

        <div className="problem-box">
          <div className="floating-container full-width">
            <textarea
              rows="4"
              value={problem}
              placeholder=" "
              onChange={(e) => setProblem(e.target.value)}
              required
            />
            <label>Patient Problem</label>
          </div>
        </div>

        <button className="btn-modern">Submit</button>
      </form>

      <button className="nav-btn" onClick={() => navigate("/users")}>
        Go to Patients List →
      </button>
    </div>
  );
}

export default RegistrationPage;
