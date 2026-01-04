import { useState, useEffect } from "react";
import {
  Cuboid,
  PanelLeft,
  Calendar,
  Tag,
  Users,
  Building,
  BarChart,
  Send,
} from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";

export default function AdminRoute() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Fungsi untuk update sidebar sesuai ukuran layar
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true); // Desktop → sidebar selalu terbuka
      } else {
        setSidebarOpen(false); // Mobile → sidebar tertutup
      }
    };

    // Jalankan saat pertama kali dan saat resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Bersihkan event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart,
      path: "/admin",
    },
    {
      id: "pengumuman",
      label: "Pengumuman",
      icon: Send,
      path: "/admin/pengumuman",
    },
    {
      id: "jadwal",
      label: "Jadwal",
      icon: Calendar,
      submenu: [{ id: "jadwal", label: "Kelola Jadwal", path: "/admin/jadwal" }],
    },
    {
      id: "kelas",
      label: "Kelas",
      icon: Cuboid,
      submenu: [{ id: "kelas", label: "Kelola Kelas", path: "/admin/kelas" }],
    },
    {
      id: "tingkatan",
      label: "Tingkatan",
      icon: Tag,
      submenu: [{ id: "tingkatan", label: "Kelola Tingkatan", path: "/admin/tingkatan" }],
    },
    {
      id: "jenis",
      label: "Jenis",
      icon: PanelLeft,
      submenu: [{ id: "jenis", label: "Kelola Jenis", path: "/admin/jenis" }],
    },
    {
      id: "ruangan",
      label: "Ruangan",
      icon: Building,
      submenu: [{ id: "ruangan", label: "Kelola Ruangan", path: "/admin/ruangan" }],
    },
    {
      id: "pengguna",
      label: "Pengguna",
      icon: Users,
      submenu: [{ id: "pengguna", label: "Kelola Pengguna", path: "/admin/pengguna" }],
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

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

      {/* Overlay (khusus mobile) */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Konten utama */}
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
