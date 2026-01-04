import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../utils/api";


export default function LockPage() {
  const [user, setUser] = useState(null);
  const [time, setTime] = useState(new Date());
  const [password, setPassword] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  const isLoginPage = window.location.pathname === "/";

  useEffect(() => {
    const lockedStatus = localStorage.getItem("isLocked");
    if (lockedStatus === "true") {
      setIsLocked(true);
    }
  }, []);

  // Update waktu setiap detik
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Ambil data user aktif
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || isLoginPage) return;

        const res = JSON.parse(localStorage.getItem("user"));
        setUser(res);
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      }
    };
    fetchUser();
  }, [isLoginPage]);

  // Deteksi idle user
  useEffect(() => {
    if (isLoginPage) return;

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => handleAutoLock(), 5 * 60 * 1000); // 5 menit
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(timeout);
    };
  }, [isLoginPage]);

  // Auto lock
  const handleAutoLock = () => {
    setIsLocked(true);
    localStorage.setItem("isLocked", "true"); 
  };

  const handleUnlock = async () => {
    if (!password) {
      Swal.fire({
        icon: "warning",
        title: "Masukkan kata sandi",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await api.post("/admin/verify-password", { password });

      Swal.fire({
        icon: "success",
        title: "Berhasil dibuka",
        timer: 1200,
        showConfirmButton: false,
      });

      setIsLocked(false);
      setPassword("");
      localStorage.removeItem("isLocked"); 
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Kata sandi salah",
        text: "Silakan coba lagi.",
      });
    }
  };

  // Format tanggal & jam
  const formatTanggal = (date) => {
    const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const bulan = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    return `${hari[date.getDay()]}, ${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatJam = (date) => {
    const h = date.getHours().toString().padStart(2, "0");
    const m = date.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  if (!isLocked || isLoginPage) return null;

  return (
    <div className="fixed inset-0 bg-linear-to-br from-blue-300 via-blue-400 to-blue-600 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-10 w-[420px] text-center text-white">
        <p className="text-lg">{formatTanggal(time)}</p>
        <h1 className="text-6xl font-bold mt-2">{formatJam(time)}</h1>

        {user && (
          <h2 className="mt-6 text-xl font-semibold tracking-wide">
            {user.nama?.toUpperCase()}
          </h2>
        )}

        <input
          type="password"
          placeholder="Masukkan kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
          className="mt-8 w-full bg-white/20 px-4 py-2 rounded-lg placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}
