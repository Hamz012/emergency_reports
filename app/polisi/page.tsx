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
  kategori: string;
  deskripsi: string;
  alamat: string;
  latitude: string;
  longitude: string;
  nama: string;
  no_hp: string;
  created_at: string;
}

export default function PolisiPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);

  const fetchReports = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1/pelaporan-darurat/backend/report/get_reports_by_tujuan.php?tujuan=polisi",
        { cache: "no-store" }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setReports(data);

        setChartData([
          {
            name: "Polisi",
            total: data.length,
          },
        ]);
      } else {
        setReports([]);
        setChartData([{ name: "Polisi", total: 0 }]);
      }
    } catch (error) {
      console.log("FETCH ERROR:", error);
      setReports([]);
      setChartData([{ name: "Polisi", total: 0 }]);
    }
  };

  useEffect(() => {
    fetchReports();

    const interval = setInterval(() => {
      fetchReports();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalReports = reports.length;

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Dashboard Polisi
          </h1>
          <p className="text-slate-500 mt-2">
            Monitoring laporan kriminal realtime
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-sm text-slate-500">Total Laporan</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {totalReports}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-sm text-slate-500">Status Sistem</p>
            <h2 className="text-lg font-semibold text-slate-900 mt-2">
              Active Monitoring
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <p className="text-sm text-slate-500">Unit</p>
            <h2 className="text-lg font-semibold text-slate-900 mt-2">
              Police Department
            </h2>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Grafik Laporan Kriminal
          </h2>

          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REPORT LIST */}
        {totalReports === 0 ? (
          <div className="bg-white rounded-2xl border p-8 text-center text-slate-500">
            Belum ada laporan kriminal
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl shadow-sm border p-6"
              >
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-blue-700 capitalize">
                      {report.kategori}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      ID Laporan #{report.id}
                    </p>
                  </div>

                  <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                    Masuk
                  </span>
                </div>

                <p className="mt-4 text-slate-700 leading-relaxed">
                  {report.deskripsi}
                </p>

                {/* DATA PELAPOR */}
                <div className="grid md:grid-cols-2 gap-4 mt-5">
                  <div className="bg-slate-50 border rounded-2xl p-4">
                    <p className="text-xs text-slate-500">Nama Pelapor</p>
                    <p className="font-semibold text-slate-900">
                      {report.nama || "-"}
                    </p>
                  </div>

                  <div className="bg-slate-50 border rounded-2xl p-4">
                    <p className="text-xs text-slate-500">Nomor HP</p>
                    <p className="font-semibold text-slate-900">
                      {report.no_hp || "-"}
                    </p>
                  </div>
                </div>

                {/* MAP */}
                <div className="mt-5">
                  <a
                    href={report.alamat}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium block mb-3 hover:underline"
                  >
                    📍 Buka lokasi di Google Maps
                  </a>

                  <iframe
                    src={`https://maps.google.com/maps?q=${report.latitude},${report.longitude}&z=15&output=embed`}
                    width="100%"
                    height="250"
                    className="rounded-2xl border"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}