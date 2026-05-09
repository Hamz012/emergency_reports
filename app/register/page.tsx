"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

export default function RegisterPage() {
  const [nama, setNama] = useState("");
  const [noHp, setNoHp] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
  try {
    setLoading(true);

    const res = await axios.post(
      "https://emergency-backend-production.up.railway.app/auth/register.php",
      {
        nama,
        no_hp: noHp,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log(res.data);

    if (res?.data?.success) {
      alert("Register berhasil");
      router.push("/login");
    } else {
      alert(res?.data?.message || "Register gagal");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

      {/* Background */}
      <Image
        src="/ff.png"
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      {/* Blur overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

      {/* Register card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Register
          </h1>

          <p className="text-slate-600 mt-2 text-sm">
            Buat akun baru untuk mengakses sistem pelaporan
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Nama */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Nama Lengkap
            </label>

            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full mt-2 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Nomor HP */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Nomor HP
            </label>

            <input
              type="text"
              placeholder="Masukkan nomor HP"
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              className="w-full mt-2 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-2xl font-semibold text-white transition ${
            loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Memproses..." : "Register"}
        </button>

        {/* Login link */}
        <p className="text-center mt-6 text-sm text-slate-700">
          Sudah punya akun?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </motion.div>
    </main>
  );
}