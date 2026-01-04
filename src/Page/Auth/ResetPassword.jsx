import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../utils/api";

export default function ResetPassword() {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    old_password: "",
    password: "",
    confirm_password: "",
  });

  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Gagal", "Token tidak ditemukan. Silakan login ulang.", "error");
        setLoading(false);
        return;
      }

      const res = await api.post(`/user/reset-password/${userId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Berhasil", res.data.message, "success");
      setForm({ old_password: "", password: "", confirm_password: "" });
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan. Coba lagi.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Perubahan Kata Sandi
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Password lama */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Kata Sandi Lama
            </label>
            <div className="relative">
              <input
                type={show.old ? "text" : "password"}
                name="old_password"
                value={form.old_password}
                onChange={handleChange}
                className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setShow({ ...show, old: !show.old })}
              >
                {show.old ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Password baru */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={show.new ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setShow({ ...show, new: !show.new })}
              >
                {show.new ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Konfirmasi password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                type={show.confirm ? "text" : "password"}
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={() => setShow({ ...show, confirm: !show.confirm })}
              >
                {show.confirm ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition w-full font-semibold"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Ubah Kata Sandi"}
          </button>
        </form>
      </div>
    </div>
  );
}
