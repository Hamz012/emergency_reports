"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportPage() {
  const router = useRouter();

  const [kategori, setKategori] = useState("kecelakaan");
  const [deskripsi, setDeskripsi] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung GPS");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      },
      () => {
        alert("Izinkan akses lokasi terlebih dahulu");
      }
    );
  }, []);

  const handleSubmit = async () => {
    if (!deskripsi) {
      alert("Deskripsi wajib diisi");
      return;
    }

    if (!latitude || !longitude) {
      alert("Lokasi belum terdeteksi");
      return;
    }

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const alamat = `https://maps.google.com/?q=${latitude},${longitude}`;

      const res = await fetch(
  "https://emergency-backend-production.up.railway.app/report/create_report.php",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user.id,
      kategori,
      deskripsi,
      alamat,
      latitude,
      longitude,
    }),
  }
);

      const data = await res.json();
      console.log(data);

      if (data.success) {
        alert("Laporan berhasil dikirim");
        router.push("/dashboard");
      } else {
        alert(data.message || "Gagal mengirim laporan");
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl border shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Form Pelaporan Darurat
          </h1>
          <p className="text-slate-500 mt-2">
            Lokasi akan otomatis diambil dari perangkat Anda
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 text-blue-700 p-4 rounded-2xl mb-6 text-sm">
          📍 Lokasi aktif: {latitude || "loading..."},{" "}
          {longitude || "loading..."}
        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kategori
            </label>

            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-slate-800"
            >
              <option value="kecelakaan">Kecelakaan</option>
              <option value="kriminal">Kriminal</option>
              <option value="kebakaran">Kebakaran</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Deskripsi
            </label>

            <textarea
              rows={5}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan kejadian..."
              className="w-full border rounded-xl px-4 py-3 text-slate-800"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-semibold text-white ${
              loading
                ? "bg-slate-400"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Mengirim..." : "Kirim Laporan"}
          </button>
        </div>
      </div>
    </main>
  );
}