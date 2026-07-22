import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    student_id: "",
    date: "",
    status: "Present",
  });
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [attRes, stuRes] = await Promise.all([
        api.get("/attendance/"),
        api.get("/students/"),
      ]);
      setRecords(attRes.data);
      setStudents(stuRes.data);
    } catch {
      setError("Couldn't load attendance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load both attendance rows and students together so the form is ready.
    load();
  }, []);

  const flash = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2500);
  };

  const studentName = (id) => students.find((s) => s.id === id)?.name || `#${id}`;

  const handleMark = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/attendance/", {
        ...form,
        student_id: Number(form.student_id),
      });
      flash("Attendance marked.");
      setForm({ student_id: "", date: "", status: "Present" });
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't mark attendance.");
    }
  };

  const toggleStatus = async (record) => {
    try {
      await api.put(`/attendance/${record.id}`, {
        status: record.status === "Present" ? "Absent" : "Present",
      });
      flash("Attendance updated.");
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't update attendance.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-paper/60">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10">
        <h1 className="font-display text-3xl mb-1">Attendance</h1>
        <p className="text-ink/60 text-sm mb-8">
          {isAdmin ? "Mark and update daily attendance." : "Read-only access."}
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
            onSubmit={handleMark}
            className="bg-surface border border-ink/10 rounded-2xl p-5 sm:p-6 mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 items-end shadow-sm"
          >
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-1">Student</label>
              <select
                required
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
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-ink/20 rounded-xl px-3 py-3 bg-white"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-ink/20 rounded-xl px-3 py-3 bg-white"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-brass text-ink font-semibold px-4 py-3 rounded-xl hover:brightness-95 shadow-sm"
            >
              Mark
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-ink/60 text-sm">Loading...</p>
        ) : records.length === 0 ? (
          <p className="text-ink/60 text-sm">No attendance records yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-surface shadow-sm">
            <table className="min-w-[640px] w-full text-sm">
              <thead className="bg-paper/90 text-ink/70 text-left">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  {isAdmin && <th className="px-4 py-3 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-paper/40"}>
                    <td className="px-4 py-3">{studentName(r.student_id)}</td>
                    <td className="px-4 py-3">{r.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          r.status === "Present"
                            ? "text-success font-medium"
                            : "text-danger font-medium"
                        }
                      >
                        {r.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => toggleStatus(r)}
                          className="text-ink/70 hover:text-ink font-medium"
                        >
                          Toggle
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
