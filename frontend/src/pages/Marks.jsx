import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";

export default function Marks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ student_id: "", subject: "", marks: "" });
  const [editingId, setEditingId] = useState(null);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [marksRes, stuRes] = await Promise.all([
        api.get("/marks/"),
        api.get("/students/"),
      ]);
      setMarks(marksRes.data);
      setStudents(stuRes.data);
    } catch {
      setError("Couldn't load marks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Keep the student list and marks list in sync whenever the page opens.
    load();
  }, []);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2500);
  };

  const studentName = (id) => students.find((s) => s.id === id)?.name || `#${id}`;

  const resetForm = () => {
    setForm({ student_id: "", subject: "", marks: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/marks/${editingId}`, { marks: Number(form.marks) });
        flash("Marks updated.");
      } else {
        await api.post("/marks/", {
          student_id: Number(form.student_id),
          subject: form.subject,
          marks: Number(form.marks),
        });
        flash("Marks added.");
      }
      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't save marks.");
    }
  };

  const startEdit = (m) => {
    setForm({
      student_id: String(m.student_id),
      subject: m.subject,
      marks: String(m.marks),
    });
    setEditingId(m.id);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-paper/60">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <h1 className="font-display text-3xl mb-1">Marks</h1>
        <p className="text-ink/60 text-sm mb-8">
          {isAdmin ? "Add and update subject marks." : "Read-only access."}
        </p>

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

        {isAdmin && (
          <form
            onSubmit={handleSubmit}
            className="bg-surface border border-ink/10 rounded-2xl p-5 sm:p-6 mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 items-end shadow-sm"
          >
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-1">Student</label>
              <select
                required
                disabled={!!editingId}
                value={form.student_id}
                onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                className="w-full border border-ink/20 rounded-xl px-3 py-3 bg-white"
              >
                <option value="">Select...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                required
                disabled={!!editingId}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-ink/20 rounded-xl px-3 py-3 bg-white"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-1">Marks</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={form.marks}
                onChange={(e) => setForm({ ...form, marks: e.target.value })}
                className="w-full border border-ink/20 rounded-xl px-3 py-3 bg-white"
              />
            </div>
            <button
              type="submit"
              className="bg-brass text-ink font-semibold px-4 py-3 rounded-xl hover:brightness-95 shadow-sm"
            >
              {editingId ? "Save" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-3 rounded-xl text-ink/70 hover:text-ink border border-ink/10"
              >
                Cancel
              </button>
            )}
          </form>
        )}

        {loading ? (
          <p className="text-ink/60 text-sm">Loading...</p>
        ) : marks.length === 0 ? (
          <p className="text-ink/60 text-sm">No marks recorded yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-surface shadow-sm">
            <table className="min-w-[640px] w-full text-sm">
              <thead className="bg-paper/90 text-ink/70 text-left">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Marks</th>
                  {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {marks.map((m, i) => (
                  <tr key={m.id} className={i % 2 === 0 ? "bg-white" : "bg-paper/40"}>
                    <td className="px-4 py-3">{studentName(m.student_id)}</td>
                    <td className="px-4 py-3">{m.subject}</td>
                    <td className="px-4 py-3 font-mono">{m.marks}</td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => startEdit(m)}
                          className="text-ink/70 hover:text-ink font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
