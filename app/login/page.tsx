"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const [noHp, setNoHp] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    if (!noHp.trim()) {
      alert("Nomor HP wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
  "https://emergency-backend-production.up.railway.app/auth/login.php",
  JSON.stringify({
    no_hp: noHp.trim(),
  }),
  {
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 10000,
  }
);

      console.log("LOGIN RESPONSE:", res.data);

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const role = res.data.user.role;

        switch (role) {
          case "polisi":
            router.push("/polisi");
            break;

          case "pemadam":
            router.push("/pemadam");
            break;

          case "ambulance":
            router.push("/ambulance");
            break;

          case "admin":
            router.push("/admin");
            break;

          default:
            router.push("/dashboard");
            break;
        }
      } else {
        alert(res.data.message || "Login gagal");
      }
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        alert(error.response.data?.message || "Backend error");
      } else if (error.request) {
        alert("Backend PHP tidak merespon");
      } else {
        alert("Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <Image
        src="/ff.png"
        alt="Background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/40"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">LaporKuy</h1>

          <p className="text-slate-600 mt-2 text-sm">
            Login untuk mengakses sistem pelaporan darurat
          </p>
        </div>

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

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full mt-6 py-3 rounded-2xl font-semibold text-white transition ${
            loading
              ? "bg-slate-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Memproses..." : "Login"}
        </button>

        <p className="text-center mt-6 text-sm text-slate-700">
          Belum punya akun?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </motion.div>
    </main>
  );
}