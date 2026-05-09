"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  FileText,
  LogOut,
  Bell,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [location, setLocation] = useState({
    lat: -8.6500,
    lng: 116.3249,
  });
  const [locationReady, setLocationReady] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  // =========================
  // FETCH REPORTS (FIXED)
  // =========================
  const fetchReports = async (userId: number) => {
    try {
      const res = await fetch(
        `https://emergency-backend-production.up.railway.app/report/get_user_reports.php?user_id=${userId}`
      );

      const data = await res.json();

      // FIX: pastikan array valid
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setReports([]);
    }
  };

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    const data = localStorage.getItem("user");

    if (!data) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(data);
    setUser(parsed);

    if (parsed?.id) {
      fetchReports(parsed.id);

      const interval = setInterval(() => {
        fetchReports(parsed.id);
      }, 5000);

      return () => clearInterval(interval);
    }

    // GPS
    if ("geolocation" in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setLocationReady(true);
        },
        () => setLocationReady(false),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // =========================
  // FIX STATUS LOGIC
  // =========================
  const getStatus = (r: any) => {
    // fallback multi field (biar gak error)
    return r.status || r.operator_confirm || "pending";
  };

  const totalReports = reports.length;

  const doneReports = reports.filter(
    (r) => getStatus(r) === "done" || getStatus(r) === "diterima"
  ).length;

  const pendingReports = totalReports - doneReports;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border rounded-3xl shadow-sm p-6"
        >
          <h1 className="text-3xl font-bold text-slate-900">
            Halo, {user?.nama || "User"}
          </h1>
          <p className="text-slate-500 mt-2">
            Emergency Reporting Dashboard
          </p>
        </motion.div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-5">

          {/* TOTAL */}
          <motion.div className="bg-white border rounded-3xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={20} />
              <span className="text-slate-500 text-sm">Total Laporan</span>
            </div>
            <h2 className="text-3xl font-bold mt-3 text-slate-900">
              {totalReports}
            </h2>
          </motion.div>

          {/* SELESAI */}
          <motion.div className="bg-white border rounded-3xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600" size={20} />
              <span className="text-slate-500 text-sm">Selesai</span>
            </div>
            <h2 className="text-3xl font-bold mt-3 text-green-600">
              {doneReports}
            </h2>
          </motion.div>

          {/* DIPROSES */}
          <motion.div className="bg-white border rounded-3xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <Bell className="text-yellow-600" size={20} />
              <span className="text-slate-500 text-sm">Diproses</span>
            </div>
            <h2 className="text-3xl font-bold mt-3 text-yellow-600">
              {pendingReports}
            </h2>
          </motion.div>

        </div>

        {/* ACTION */}
        <motion.div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-xl font-bold">Lapor Darurat</h2>
          <p className="text-blue-100 text-sm mt-2 mb-5">
            Kirim laporan dengan lokasi realtime
          </p>

          <button
            onClick={() => router.push("/report")}
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-2xl"
          >
            Buat Laporan
          </button>
        </motion.div>

        {/* LIST REPORT */}
        <motion.div className="bg-white border rounded-3xl shadow-sm p-6">
          <h3 className="font-semibold mb-4">Riwayat Laporan</h3>

          {reports.length === 0 ? (
            <p className="text-slate-400">Belum ada laporan</p>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => {
                const status = getStatus(r);

                return (
                  <div key={r.id} className="p-4 border rounded-2xl bg-slate-50">

                    <div className="flex justify-between">
                      <h4 className="font-semibold capitalize">
                        {r.kategori}
                      </h4>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          status === "done" || status === "diterima"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {status === "done" || status === "diterima"
                          ? "Selesai"
                          : "Diproses"}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 mt-2">
                      {r.deskripsi}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* MAP */}
        <motion.div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
          <div className="p-5 border-b flex items-center gap-2">
            <MapPin className="text-blue-600" size={18} />
            <h3 className="font-semibold">Lokasi Realtime</h3>
          </div>

          {!locationReady ? (
            <div className="h-[280px] flex items-center justify-center text-red-500">
              Aktifkan GPS
            </div>
          ) : (
            <iframe
              src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`}
              width="100%"
              height="280"
              className="pointer-events-none"
            />
          )}
        </motion.div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="w-full bg-red-500 text-white py-3 rounded-2xl font-semibold"
        >
          Logout
        </button>

      </div>
    </main>
  );
}