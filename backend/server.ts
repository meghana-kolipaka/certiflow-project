import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Temporary student storage
let students = [
  {
    id: 1,
    name: "Meghana",
    course: "Python",
    status: "pending"
  },
  {
    id: 2,
    name: "Harshitha",
    course: "Web Development",
    status: "pending"
  }
];

// Test API
app.get("/", (req, res) => {
  res.send("CertiFlow Backend is Running!");
});

// Get all students
app.get("/api/students", (req, res) => {
  res.json(students);
});

// Add a new student
app.post("/api/students", (req, res) => {
  const { name, course } = req.body;

  if (!name?.trim() || !course?.trim()) {
    return res.status(400).json({
      message: "Name and course are required"
    });
  }

  const newStudent = {
    id: Date.now(),
    name: name.trim(),
    course: course.trim(),
    status: "pending"
  };

  students.push(newStudent);

  res.status(201).json(newStudent);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`CertiFlow backend running on port ${PORT}`);
});