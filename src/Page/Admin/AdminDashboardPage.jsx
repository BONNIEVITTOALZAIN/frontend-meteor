import { useEffect, useState } from "react";
import { Users, Calendar, BarChart2, UserCheck } from "lucide-react";
import api from "../../utils/api";


export default function AdminDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/dashboard`).then((res) => setData(res.data));
  }, []);

  if (!data) return <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Dashboard Admin
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total User"
          value={data.total_users}
          icon={<Users className="w-6 h-6 text-blue-500" />}
        />
        <StatCard
          title="Total Pengajar"
          value={data.total_pengajar}
          icon={<UserCheck className="w-6 h-6 text-green-500" />}
        />
        <StatCard
          title="Total Siswa"
          value={data.total_siswa}
          icon={<BarChart2 className="w-6 h-6 text-purple-500" />}
        />
        <StatCard
          title="Total Jadwal"
          value={data.total_jadwal}
          icon={<Calendar className="w-6 h-6 text-orange-500" />}
        />
      </div>

      <div className="mt-10 bg-white rounded-xl shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700">
            Pengguna Terbaru
          </h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-gray-600 text-sm">Nama</th>
              <th className="px-6 py-3 text-gray-600 text-sm">Email</th>
              <th className="px-6 py-3 text-gray-600 text-sm">Role</th>
            </tr>
          </thead>
          <tbody>
            {data.latest_users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-3">{u.nama}</td>
                <td className="px-6 py-3">{u.email}</td>
                <td className="px-6 py-3 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
