import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import * as Icons from "lucide-react";
import Sidebar from "../../Components/Sidebar";

export default function PengajarRoute() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Icons.BarChart,
      path: "/pengajar",
    },
    {
      id: "profil",
      label: "Profil",
      icon: Icons.CircleUserRound,
      submenu: [
        {
          id: "profil-change-password",
          label: "Ganti Kata Sandi",
          path: "/pengajar/profil/reset-password",
        },
      ],
    },
    {
      id: "siswa",
      label: "Siswa",
      icon: Icons.Users,
      submenu: [{ id: "siswa", label: "Kelola Siswa", path: "/pengajar/siswa" }],
    },
    {
      id: "presensi",
      label: "Presensi",
      icon: Icons.SquareChartGantt,
      path: "/pengajar/presensi",
    },


  ];

  const handleNavigate = (path) => navigate(path);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
        onNavigate={handleNavigate}
        user={user}
        title="Bimbel Meteor"
      />

      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <main
        className={`flex-1 overflow-auto transition-all duration-300 ease-in-out p-10
        ${sidebarOpen && window.innerWidth >= 1024 ? "lg:ml-64" : "lg:ml-20"}
        ml-0`}
      >
        <div className="flex-1 p-8 sm:p-8 md:p-6 lg:p-1 bg-gray-100 transition-all duration-300 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
