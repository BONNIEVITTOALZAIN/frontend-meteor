import { useState, useEffect } from "react";
import axios from "axios";


const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function SiswaDashboardPage() {
  let username = "";
  let user = "";
  const [jadwal, setJadwal] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [tingkatan, setTingkatan] = useState([]);
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [jadwalRes, kelasRes, tingkatanRes, pengumumanRes] = await Promise.all([
          api.get("/jadwal"),
          api.get("/admin/kelas"),
          api.get("/admin/tingkatan"),
          api.get("/pengumuman"),
        ]);
        setJadwal(jadwalRes.data);
        setKelas(kelasRes.data);
        setTingkatan(tingkatanRes.data);
        setPengumuman(pengumumanRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  user = localStorage.getItem("user");
  username = JSON.parse(user).nama;

 if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 ">
      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-600 to-blue-600 text-white p-4 sm:p-6 md:p-8 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-indigo-100 text-sm sm:text-base md:text-lg">Selamat datang kembali {username}!
            <br /> 
            Semangat belajar hari ini 🎓</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 -mt-8 sm:-mt-12">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-linear-to-br from-blue-500 to-blue-600 p-3 sm:p-4 rounded-xl shadow-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="bg-blue-50 px-3 sm:px-4 py-1 rounded-full">
                <span className="text-blue-600 font-semibold text-xs sm:text-sm">Aktif</span>
              </div>
            </div>
            <h3 className="text-gray-600 font-medium mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-wide">Total Jadwal</h3>
            <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">{jadwal.length}</p>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span>Jadwal aktif</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-linear-to-br from-green-500 to-green-600 p-3 sm:p-4 rounded-xl shadow-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="bg-green-50 px-3 sm:px-4 py-1 rounded-full">
                <span className="text-green-600 font-semibold text-xs sm:text-sm">Tersedia</span>
              </div>
            </div>
            <h3 className="text-gray-600 font-medium mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-wide">Total Kelas</h3>
            <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">{kelas.length}</p>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Kelas tersedia</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="bg-linear-to-br from-purple-500 to-purple-600 p-3 sm:p-4 rounded-xl shadow-lg">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="bg-purple-50 px-3 sm:px-4 py-1 rounded-full">
                <span className="text-purple-600 font-semibold text-xs sm:text-sm">Level</span>
              </div>
            </div>
            <h3 className="text-gray-600 font-medium mb-1 sm:mb-2 text-xs sm:text-sm uppercase tracking-wide">Total Tingkatan</h3>
            <p className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">{tingkatan.length}</p>
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span>Tingkat belajar</span>
            </div>
          </div>
        </div>

        {/* Pengumuman Section */}
        <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-linear-to-br from-pink-500 to-red-500 p-2 sm:p-3 rounded-xl shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">📢 Pengumuman</h2>
            </div>
          </div>

          {pengumuman.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="bg-linear-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg sm:text-xl font-semibold">Belum ada pengumuman</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-2">Pengumuman baru akan muncul di sini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {pengumuman.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative overflow-hidden">
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-48 sm:h-56 bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}