import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";

const emptyForm = { name: "", email: "", age: "", course: "" };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const loadStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/students/");
      setStudents(res.data);
    } catch {
      setError("Couldn't load students. Try refreshing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2500);
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (student) => {
    // Prefill the edit modal so updates do not wipe the existing student data.
    setForm({
      name: student.name,
      email: student.email,
      age: student.age,
      course: student.course,
    });
    setEditingId(student.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Backend expects the same email field on create and update, so send the full object.
    const payload = { ...form, age: Number(form.age) };

    try {
      if (editingId) {
        await api.put(`/students/${editingId}`, payload);
        flash("Student updated.");
      } else {
        await api.post("/students/", payload);
        flash("Student added.");
      }

      setShowForm(false);
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await api.delete(`/students/${id}`);
      flash("Student deleted.");
      loadStudents();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't delete student.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl mb-1">Students</h1>
            <p className="text-ink/50 text-sm">
              {isAdmin
                ? "Full access - add, edit, and remove records."
                : "Read-only access."}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={openAddForm}
              className="bg-brass text-ink font-medium px-4 py-2 rounded-md hover:brightness-95"
            >
              + Add Student
            </button>
          )}
        </div>

        {notice && (
          <div className="bg-success/10 text-success text-sm rounded-md px-3 py-2 mb-4">
            {notice}
          </div>
        )}
        {error && (
          <div className="bg-danger/10 text-danger text-sm rounded-md px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-ink/50 text-sm">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="text-ink/50 text-sm">
            No students yet. {isAdmin && "Add the first one above."}
          </p>
        ) : (
          <table className="w-full bg-white border border-ink/10 rounded-lg overflow-hidden text-sm">
            <thead className="bg-paper text-ink/60 text-left">
              <tr>
                <th className="px-4 py-3 font-mono">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Course</th>
                {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr
                  key={s.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-paper/40"}
                >
                  <td className="px-4 py-3 font-mono text-ink/60">
                    #{String(s.id).padStart(4, "0")}
                  </td>
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.age}</td>
                  <td className="px-4 py-3">{s.course}</td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-right space-x-3">
                      <button
                        onClick={() => openEditForm(s)}
                        className="text-ink/70 hover:text-ink font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-danger hover:text-danger/80 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-ink/40 flex items-center justify-center">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg p-8 w-full max-w-sm shadow-lg"
            >
              <h2 className="font-display text-2xl mb-6">
                {editingId ? "Edit Student" : "Add Student"}
              </h2>

              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-ink/20 rounded-md px-3 py-2 mb-4"
              />

              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                // This field was missing before; the backend rejects student rows without email.
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-ink/20 rounded-md px-3 py-2 mb-4"
              />

              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                required
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full border border-ink/20 rounded-md px-3 py-2 mb-4"
              />

              <label className="block text-sm font-medium mb-1">Course</label>
              <input
                required
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                className="w-full border border-ink/20 rounded-md px-3 py-2 mb-6"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-md text-ink/60 hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-ink text-paper px-4 py-2 rounded-md font-medium hover:bg-inklight"
                >
                  {editingId ? "Save changes" : "Add student"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
