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
    // Fetch the list once so the table is ready immediately.
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
    // Reuse the same modal for edit mode by pre-filling the current row values.
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-paper/60">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="max-w-xl">
            <h1 className="font-display text-3xl mb-1">Students</h1>
            <p className="text-ink/60 text-sm">
              {isAdmin
                ? "Full access - add, edit, and remove records."
                : "Read-only access."}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={openAddForm}
              className="bg-brass text-ink font-semibold px-4 py-3 rounded-xl hover:brightness-95 shadow-sm"
            >
              + Add Student
            </button>
          )}
        </div>

        {notice && (
          <div className="bg-success/10 text-success text-sm rounded-xl px-3 py-3 mb-4 border border-success/15">
            {notice}
          </div>
        )}
        {error && (
          <div className="bg-danger/10 text-danger text-sm rounded-xl px-3 py-3 mb-4 border border-danger/15">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-ink/60 text-sm">Loading students...</p>
        ) : students.length === 0 ? (
          <p className="text-ink/60 text-sm">
            No students yet. {isAdmin && "Add the first one above."}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-surface shadow-sm">
            <table className="min-w-[760px] w-full text-sm">
              <thead className="bg-paper/90 text-ink/70 text-left">
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
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm p-4 flex items-center justify-center">
            <form
              onSubmit={handleSubmit}
              className="bg-surface rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-ink/10"
            >
              <h2 className="font-display text-2xl mb-6">
                {editingId ? "Edit Student" : "Add Student"}
              </h2>

              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-ink/20 rounded-xl px-3 py-3 mb-4 bg-white"
              />

              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                // The backend uses email as the unique identifier for each student.
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-ink/20 rounded-xl px-3 py-3 mb-4 bg-white"
              />

              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                required
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full border border-ink/20 rounded-xl px-3 py-3 mb-4 bg-white"
              />

              <label className="block text-sm font-medium mb-1">Course</label>
              <input
                required
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                className="w-full border border-ink/20 rounded-xl px-3 py-3 mb-6 bg-white"
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-3 rounded-xl text-ink/70 hover:text-ink border border-ink/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-info text-white px-4 py-3 rounded-xl font-semibold hover:brightness-95"
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
