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
  const [form, setForm] = useState({ student_id: "", date: "", status: "Present" });
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
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="font-display text-3xl mb-1">Attendance</h1>
        <p className="text-ink/50 text-sm mb-8">
          {isAdmin ? "Mark and update daily attendance." : "Read-only access."}
        </p>

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

        {isAdmin && (
          <form
            onSubmit={handleMark}
            className="bg-white border border-ink/10 rounded-lg p-6 mb-8 flex gap-3 items-end flex-wrap"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <select
                required
                value={form.student_id}
                onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                className="border border-ink/20 rounded-md px-3 py-2"
              >
                <option value="">Select…</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border border-ink/20 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border border-ink/20 rounded-md px-3 py-2"
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-brass text-ink font-medium px-4 py-2 rounded-md hover:brightness-95"
            >
              Mark
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-ink/50 text-sm">Loading…</p>
        ) : records.length === 0 ? (
          <p className="text-ink/50 text-sm">No attendance records yet.</p>
        ) : (
          <table className="w-full bg-white border border-ink/10 rounded-lg overflow-hidden text-sm">
            <thead className="bg-paper text-ink/60 text-left">
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
                    <span className={r.status === "Present" ? "text-success" : "text-danger"}>
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
        )}
      </main>
    </div>
  );
}