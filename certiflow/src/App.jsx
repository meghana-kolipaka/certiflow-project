import { jsPDF } from "jspdf";
import { useState ,useEffect} from "react";
import "./App.css";
function App() {
  const [page, setPage] =
useState("Dashboard");
  const [students, setStudents] =
useState([
  { id: 1, name: "Meghana",course: "python", status:"pending",officer1:false,officer2:false},
  { id: 2, name: "Harshitha",course:"web development",status:"pending",officer1:false,officer2:false},
  { id: 3, name:"Srujana",course:"Data analytics",status:"Approved"}
]);
useEffect(() => {
  fetch("http://localhost:5000/api/students")
    .then(response => response.json())
    .then(data => setStudents(data))
    .catch(error => console.log("Error:", error));
}, []);
  const [name, setName] = 
useState("");
  const [course, setCourse] = 
useState("");
  const [search, setSearch] =
useState("");
function generateCertificate(student) {
  const doc = new jsPDF();

  const certificateId =
    student.certificateId = `CERT-${student.id}`;

  doc.setDrawColor(180, 140, 50);
  doc.setLineWidth(3);
  doc.rect(10, 10, 190, 277);

  doc.setFontSize(28);
  doc.setTextColor(23, 37, 84);
  doc.text("CERTIFICATE", 105, 65, {
    align: "center"
  });

  doc.setFontSize(18);
  doc.text("OF COMPLETION", 105, 80, {
    align: "center"
  });

  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text("This certificate is proudly presented to", 105, 115, {
    align: "center"
  });

  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.text(student.name, 105, 140, {
    align: "center"
  });

  doc.setFontSize(16);
  doc.setTextColor(50, 50, 50);
  doc.text("For successfully completing", 105, 165, {
    align: "center"
  });

  doc.text(student.course, 105, 180, {
    align: "center"
  });

  doc.setFontSize(12);
  doc.text(`Certificate ID: ${certificateId}`, 105, 220, {
    align: "center"
  });

  doc.text("CertiFlow Skilling Platform", 105, 250, {
    align: "center"
  });

  doc.save(`${student.name}_Certificate.pdf`);
}
function cancelCertificate(id) {
  setStudents(prev =>
    prev.map(student =>
      student.id === id
        ? { ...student, status: "Cancelled" }
        : student
    )
  );
}
  async function addStudent(e) {
  e.preventDefault();

  if (!name.trim() || !course.trim()) return;

  try {
    const response = await fetch(
      "http://localhost:5000/api/students",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, course })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add student");
    }

    const newStudent = await response.json();

    setStudents(prev => [...prev, newStudent]);

    setName("");
    setCourse("");

    alert("Student added successfully!");

  } catch (error) {
    console.error(error);
    alert("Could not add student. Check backend.");
  }
}
  function approveStudent(id, officer) {
  setStudents(prevStudents =>
    prevStudents.map(student => {
      if (student.id !== id) return student;

      const updatedStudent = {
        ...student,
        [officer]: true
      };

      return {
        ...updatedStudent,
        status:
          updatedStudent.officer1 && updatedStudent.officer2
            ? "Approved"
            : "pending"
      };
    })
  );
}
  const filtered = students.filter(student =>
  student.name.toLowerCase().includes(search.toLowerCase()) ||
  `CERT-${student.id}`.toLowerCase().includes(search.trim().toLowerCase())
);
  return (
    <div className="app">
      <aside className="sidebar">
        <h2>CertiFlow</h2>
        <p>Certificate Platform</p>
        {["Dashboard","Students","Approvals","Verification"].map(item=>(
          <button
          className={page===item?"active":""}
          onClick={() =>
            setPage(item)}
            key={item}
            >
              {item}
              </button>
        ))}
      </aside>
      <main className="main">
        <header>
          <div>
            <h1>{page}</h1>
            <p>Skilling Certificate Issuance Platform</p>
          </div>
          <span>Admin | Anika</span>
        </header>
        {page==="Dashboard"&&(
          <>
          <div className="cards">
            <div className="card">
              <h3>Total Students</h3>
<h2>{students.length}</h2>
            </div>
            <div className="card">
               <h3>pending</h3>
<h2>{students.filter(s=>s.status==="pending").length}</h2>
            </div>
            <div className="card">
              <h3>Approved</h3>
<h2>{students.filter(s=> s.status==="Approved").length}</h2>
            </div>
          </div>
          <h2>Welcome to CertiFlow</h2>
          <p>Manage student batches and status approvals.</p>
          </>
        )}
        {page === "Students" && (
  <>
    <h2>Add Student</h2>
    <form onSubmit={addStudent}>
      <input
        placeholder="Student name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="Course name"
        value={course}
        onChange={e => setCourse(e.target.value)}
      />

      <button type="submit">Add Student</button>
    </form>

    <h2>Student List</h2>

<input
  placeholder="Search student name"
  value={search}
  onChange={e => setSearch(e.target.value)}
/>

<StudentTable students={filtered} />
  </>
)}

{page === "Approvals" && (
  <>
    <h2>Pending Approvals</h2>
    <StudentTable
      students={students}
      onApprove={approveStudent}
  onGenerate={generateCertificate}
  onCancel = {cancelCertificate}
    />
  </>
)}
{page === "Verification" && (
  <>
    <h2>Certificate Verification</h2>
    <p>Search for a student to check certificate status.</p>

    <input
      type="text"
      placeholder="Enter student name or Certificate ID"
      value={search}
      onChange={e => setSearch(e.target.value)}
    />

    <StudentTable students={filtered} />
  </>
)}
      </main>
    </div>
  );
}
function StudentTable({ students, onApprove ,onGenerate,onCancel}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Course</th>
          <th>Status</th>
          {onApprove && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {students.map(student => (
          <tr key={student.id}>
            <td>{student.name}</td>
            <td>{student.course}</td>
            <td>
              <span className={student.status === "Approved" ? "approved" : "pending"}>
                {student.status}
              </span>
            </td>
            {onApprove && (
  <td>
    {student.status === "Approved" ? (
      <>
  <span>Completed</span>
  {onGenerate && (
    <button onClick={() => onGenerate(student)}>
      Generate Certificate
    </button>
  )}
  {onCancel && (
  <button onClick={() => onCancel(student.id)}>
    Cancel Certificate
  </button>
)}

</>
    ) : (
      <>
        <button
          disabled={student.officer1}
          onClick={() => onApprove(student.id, "officer1")}
        >
          {student.officer1 ? "Officer 1 Approved" : "Officer 1 Approve"}
        </button>

        <button
          disabled={student.officer2}
          onClick={() => onApprove(student.id, "officer2")}
        >
          {student.officer2 ? "Officer 2 Approved" : "Officer 2 Approve"}
        </button>
      </>
    )}
  </td>
)}
          </tr>
        ))}
        {students.length === 0 && (
          <tr><td colSpan="4">No records found</td></tr>
        )}
      </tbody>
    </table>
  );
}

export default App;
    