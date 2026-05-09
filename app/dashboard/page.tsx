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

  const fetchReports = async (userId: number) => {
    try {
      const res = await fetch(
        `http://localhost/pelaporan-darurat/backend/report/get_user_reports.php?user_id=${userId}`
      );

      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("user");

    if (!data) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(data);
    setUser(parsed);

    let interval: NodeJS.Timeout;

    if (parsed?.id) {
      fetchReports(parsed.id);

      interval = setInterval(() => {
        fetchReports(parsed.id);
      }, 5000);
    }

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
        {
          enableHighAccuracy: true,
        }
      );
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [router]);

  const acceptedReports = reports.filter(
    (r) => r.operator_confirm === "diterima"
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
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

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border rounded-3xl shadow-sm p-5"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-blue-600" size={20} />
              <span className="text-slate-500 text-sm">Total Laporan</span>
            </div>
            <h2 className="text-3xl font-bold mt-3 text-slate-900">
              {reports.length}
            </h2>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border rounded-3xl shadow-sm p-5"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600" size={20} />
              <span className="text-slate-500 text-sm">Diterima</span>
            </div>
            <h2 className="text-3xl font-bold mt-3 text-green-600">
              {acceptedReports}
            </h2>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-white border rounded-3xl shadow-sm p-5"
          >
            <div className="flex items-center gap-3">
              <Bell className="text-yellow-600" size={20} />
              <span className="text-slate-500 text-sm">Diproses</span>
            </div>
            <h2 className="text-3xl font-bold mt-3 text-yellow-600">
              {reports.length - acceptedReports}
            </h2>
          </motion.div>
        </div>

        {/* Action Card */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 shadow-lg"
        >
          <h2 className="text-xl font-bold">Lapor Darurat</h2>
          <p className="text-blue-100 text-sm mt-2 mb-5">
            Kirim laporan kejadian secara cepat berdasarkan lokasi realtime Anda
          </p>

          <button
            onClick={() => router.push("/report")}
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-2xl hover:bg-slate-100 transition"
          >
            Buat Laporan
          </button>
        </motion.div>

        {/* Reports */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border rounded-3xl shadow-sm p-6"
        >
          <h3 className="font-semibold text-slate-900 mb-4">
            Riwayat Laporan
          </h3>

          {reports.length === 0 ? (
            <p className="text-slate-400 text-sm">
              Belum ada laporan tersedia
            </p>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl border bg-slate-50"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold capitalize text-slate-900">
                      {r.kategori}
                    </h4>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        r.operator_confirm === "diterima"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {r.operator_confirm === "diterima"
                        ? "Diterima"
                        : "Diproses"}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-2">
                    {r.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white border rounded-3xl shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b flex items-center gap-2">
            <MapPin className="text-blue-600" size={18} />
            <h3 className="font-semibold text-slate-900">
              Lokasi Realtime
            </h3>
          </div>

          {!locationReady ? (
            <div className="h-[280px] flex items-center justify-center text-red-500">
              Aktifkan GPS untuk melihat lokasi realtime
            </div>
          ) : (
            <iframe
              src={`https://maps.google.com/maps?q=${location.lat},${location.lng}&z=16&output=embed`}
              width="100%"
              height="280"
              loading="lazy"
              className="pointer-events-none"
            />
          )}
        </motion.div>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2 transition"
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </div>
    </main>
  );
}