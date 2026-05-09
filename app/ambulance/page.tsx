"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Report {
  id: number;
  kategori?: string;
  deskripsi?: string;
  alamat?: string;
  latitude?: string;
  longitude?: string;
  nama?: string;
  no_hp?: string;
  created_at?: string;
}

export default function AmbulancePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [chartData, setChartData] = useState<
    { name: string; total: number }[]
  >([]);

  // =========================
  // FETCH REPORTS (FIXED)
  // =========================
  const fetchReports = async () => {
    try {
      const res = await fetch(
        "https://emergency-backend-production.up.railway.app/report/get_reports_by_tujuan.php?tujuan=ambulance",
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      // FIX: pastikan array aman
      const safeData = Array.isArray(data) ? data : [];

      setReports(safeData);

      setChartData([
        {
          name: "Ambulance",
          total: safeData.length,
        },
      ]);
    } catch (error) {
      console.error("Fetch error:", error);

      // fallback biar UI tidak rusak
      setReports([]);
      setChartData([{ name: "Ambulance", total: 0 }]);
    }
  };

  useEffect(() => {
    fetchReports();

    const interval = setInterval(() => {
      fetchReports();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-700">
            Dashboard Ambulance
          </h1>
          <p className="text-slate-500 mt-2">
            Monitoring laporan kecelakaan realtime
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-2xl border p-5">
            <p className="text-sm text-slate-500">Total Laporan</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {reports.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl border p-5">
            <p className="text-sm text-slate-500">Status Sistem</p>
            <h2 className="text-lg font-semibold text-slate-900 mt-2">
              Active Monitoring
            </h2>
          </div>

          <div className="bg-white rounded-2xl border p-5">
            <p className="text-sm text-slate-500">Unit</p>
            <h2 className="text-lg font-semibold text-slate-900 mt-2">
              Ambulance Emergency
            </h2>
          </div>

        </div>

        {/* CHART */}
        <div className="bg-white rounded-2xl border p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Grafik Laporan Kecelakaan
          </h2>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REPORT LIST */}
        {reports.length === 0 ? (
          <div className="bg-white rounded-2xl border p-8 text-center text-slate-500">
            Belum ada laporan kecelakaan
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl border p-6 shadow-sm"
              >

                {/* HEADER CARD */}
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-green-700 capitalize">
                      {report.kategori || "tidak ada kategori"}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      ID #{report.id}
                    </p>
                  </div>

                  <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm">
                    Masuk
                  </span>
                </div>

                {/* DESKRIPSI */}
                <p className="mt-4 text-slate-700">
                  {report.deskripsi || "-"}
                </p>

                {/* USER INFO */}
                <div className="grid md:grid-cols-2 gap-4 mt-5">

                  <div className="bg-slate-50 border rounded-2xl p-4">
                    <p className="text-xs text-slate-500">Nama</p>
                    <p className="font-semibold">
                      {report.nama || "-"}
                    </p>
                  </div>

                  <div className="bg-slate-50 border rounded-2xl p-4">
                    <p className="text-xs text-slate-500">No HP</p>
                    <p className="font-semibold">
                      {report.no_hp || "-"}
                    </p>
                  </div>

                </div>

                {/* MAP */}
                {report.latitude && report.longitude && (
                  <div className="mt-5">
                    <a
                      href={report.alamat || "#"}
                      target="_blank"
                      className="text-blue-600 hover:underline block mb-3"
                    >
                      📍 Buka Google Maps
                    </a>

                    <iframe
                      src={`https://maps.google.com/maps?q=${report.latitude},${report.longitude}&z=15&output=embed`}
                      width="100%"
                      height="250"
                      className="rounded-2xl border"
                    />
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}