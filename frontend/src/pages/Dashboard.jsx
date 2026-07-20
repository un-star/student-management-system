import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";

export default function Dashboard() {
  const [total, setTotal] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Load the student count on mount so the dashboard shows live data.
    api.get("/students/").then((res) => setTotal(res.data.length));
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="font-display text-3xl mb-1">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-ink/50 mb-8">Here's today's overview.</p>

        <div className="bg-white border border-ink/10 rounded-lg p-6 w-64 shadow-sm">
          <p className="text-ink/50 text-sm mb-1">Total Students</p>
          <p className="font-display text-4xl font-mono">
            {/* Show an in-progress placeholder until the API responds. */}
            {total === null ? "..." : total}
          </p>
        </div>
      </main>
    </div>
  );
}
