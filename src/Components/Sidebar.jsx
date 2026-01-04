import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronUp,
  Circle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  menuItems,
  onNavigate,
  user,
  title = "Admin Panel",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activePath, setActivePath] = useState(location.pathname);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await api.post("/logout", );
      }
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout gagal:", error);
      localStorage.clear();
      navigate("/");
    }
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <>
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-blue-900 text-white flex items-center justify-between px-4 py-3 shadow-lg z-50">
          <h1 className="font-semibold">Bimbel meteor</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-blue-700 rounded-lg"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      )}

      {/* 🔹 Sidebar utama */}
      <AnimatePresence>
        {(!isMobile || sidebarOpen) && (
          <motion.aside
            initial={{ x: isMobile ? "-100%" : 0 }}
            animate={{ x: 0 }}
            exit={{ x: isMobile ? "-100%" : 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-0 left-0 h-screen w-64 bg-linear-to-br from-blue-600 via-blue-800 to-blue-900 text-white shadow-lg z-40 flex flex-col transition-all duration-300`}
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isOpen = openDropdown === item.id;
                const isActive = activePath === item.path;

                if (item.submenu) {
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                          isOpen
                            ? "bg-linear-to-r from-blue-900 to-blue-700 text-white shadow-md"
                            : "text-gray-300 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={20} />
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="ml-10 mt-1 space-y-1 overflow-hidden"
                          >
                            {item.submenu.map((sub) => {
                              const subActive = activePath === sub.path;
                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => {
                                    onNavigate(sub.path);
                                    if (isMobile) setSidebarOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-2 text-left text-sm px-3 py-2 rounded-lg transition ${
                                    subActive
                                      ? "bg-blue-800 text-white"
                                      : "text-gray-300 hover:text-white hover:bg-white/10"
                                  }`}
                                >
                                  <Circle size={13} />
                                  <span>{sub.label}</span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.path);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-linear-to-r from-blue-900 to-blue-700 text-white shadow-md"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="ml-3 text-sm font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
              <div className="mb-3">
                <p className="text-xs text-gray-400">Logged in as</p>
                <p className="font-semibold truncate text-white">
                  {user?.nama || "Admin"}
                </p>
                <p className="text-s text-gray-400">{user?.role}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-start px-4 py-2 rounded-xl hover:bg-blue-500/20 text-gray-300 hover:text-red-200 transition-all duration-200"
              >
                <LogOut size={20} />
                <span className="ml-3 text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 🔹 Overlay background saat sidebar terbuka di mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
