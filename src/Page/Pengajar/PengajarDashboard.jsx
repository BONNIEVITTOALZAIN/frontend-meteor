import { useEffect, useState } from "react";
import { BookOpen, Users, CalendarDays } from "lucide-react";
import api from "../../utils/api";

export default function PengajarDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get(`/pengajar/dashboard`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data)
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Dashboard Pengajar
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <StatCard
          title="Kelas yang Diajarkan"
          value={data.total_kelas}
          icon={<BookOpen className="w-6 h-6 text-blue-500" />}
        />
        <StatCard
          title="Siswa Aktif"
          value={data.total_siswa_aktif}
          icon={<Users className="w-6 h-6 text-green-500" />}
        />
      </div>

     
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="flex items-center justify-between bg-white p-5 rounded-xl shadow hover:shadow-md transition-all">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="bg-gray-100 p-3 rounded-full">{icon}</div>
    </div>
  );
}
