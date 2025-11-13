const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL pool connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Raju@2004",
  database: "reactbasic",
});

// Create table if not exists
db.query(`
  CREATE TABLE IF NOT EXISTS persons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    age INT,
    mobileNumber VARCHAR(20)
  )
`);

// ✅ Add a new person
app.post("/add", (req, res) => {
  const { firstName, lastName, age, mobileNumber } = req.body;

  if (!firstName || !lastName || !age || !mobileNumber)
    return res.status(400).json({ message: "All fields are required" });

  const sql = "INSERT INTO persons (firstName, lastName, age, mobileNumber) VALUES (?, ?, ?, ?)";
  db.query(sql, [firstName, lastName, age, mobileNumber], (err) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
});

// ✅ Get all people
app.get("/list", (req, res) => {
  const sql = "SELECT * FROM persons ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ message: "Database fetch error" });
    }
    res.status(200).json(results);
  });
});

// ✅ Delete person
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM persons WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error deleting data:", err);
      return res.status(500).json({ message: "Database delete error" });
    }
    res.status(200).json({ message: "Person deleted successfully" });
  });
});

// ✅ Update person
app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, age, mobileNumber } = req.body;

  const sql =
    "UPDATE persons SET firstName = ?, lastName = ?, age = ?, mobileNumber = ? WHERE id = ?";

  db.query(sql, [firstName, lastName, age, mobileNumber, id], (err) => {
    if (err) {
      console.error("Error updating data:", err);
      return res.status(500).json({ message: "Database update error" });
    }
    res.status(200).json({ message: "Person updated successfully" });
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
