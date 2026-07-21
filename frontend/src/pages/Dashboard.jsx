import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    api.get("/dashboard/stats").then((res) => setStats(res.data));
  }, []);

  const cards = [
    { label: "Total Students", value: stats?.total_students },
    { label: "Present Today", value: stats?.present_today },
    { label: "Absent Today", value: stats?.absent_today },
    { label: "Average Marks", value: stats?.average_marks },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="font-display text-3xl mb-1">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-ink/50 mb-8">Here's today's overview.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="bg-white border border-ink/10 rounded-lg p-6 shadow-sm"
            >
              <p className="text-ink/50 text-sm mb-1">{c.label}</p>
              <p className="font-display text-3xl font-mono">
                {c.value === undefined || c.value === null ? "…" : c.value}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
