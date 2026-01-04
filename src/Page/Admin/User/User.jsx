import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../../utils/api";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [searchTerm, setSearchTerm] = useState("");
  const [userRole, setUserRole] = useState(null);

  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    role: "",
    status: 1, // default aktif
  });

  useEffect(() => {
    const role = localStorage.getItem("role"); // ambil role dari login
    setUserRole(role);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/user");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let val = value;
    if (type === "checkbox") val = e.target.checked ? 1 : 0;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama || !formData.username || !formData.email || !formData.role) {
      alert("Nama, Username, Email, dan Role wajib diisi!");
      return;
    }

    try {
      if (editMode) {
        await api.put(`/admin/user/${currentUser.id}`, formData);
        Swal.fire("Berhasil!", "Data telah diperbarui.", "success");
      } else {
        await api.post("/admin/user", formData);
        Swal.fire("Berhasil!", "Data telah disimpan.", "success");
      }
      fetchUsers();
      closeModal();
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Gagal menyimpan data.");
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      nama: user.nama,
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status ?? 1,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data user ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      confirmButtonColor: "blue",
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/admin/user/${id}`);
      Swal.fire("Berhasil!", "Data user telah dihapus.", "success");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Gagal menghapus user.");
    }
  };

  // 🔍 Filter hasil pencarian + role login
  const filteredUsers = users
    .filter((u) => {
      const term = searchTerm.toLowerCase();
      return (
        u.nama.toLowerCase().includes(term) ||
        u.username.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.role.toLowerCase().includes(term)
      );
    })
    .filter((u) => {
      if (userRole === "pengajar") return u.role === "siswa";
      return true;
    });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const openAddModal = () => {
    setFormData({ nama: "", username: "", email: "", password: "", role: "", status: 1 });
    setEditMode(false);
    setCurrentUser(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentUser(null);
  };

  // Role yang bisa dipilih tergantung role login
  const roleOptions =
    userRole === "pengajar" ? ["siswa"] : ["admin", "pengajar", "siswa"];

  return (
    <div className="min-h-screen bg-gray-50 p-8 shadow-xl shadow-gray-400/50 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Kelola User</h1>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={20} /> Tambah
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-xl shadow-gray-400/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                {userRole === "admin" && (
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">
                    <div className="flex justify-center items-center h-64">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-gray-500">Tidak ada data</td>
                </tr>
              ) : (
                currentItems.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">{u.nama}</td>
                    <td className="px-6 py-3">{u.username}</td>
                    <td className="px-6 py-3">{u.email}</td>
                    <td className="px-6 py-3 capitalize">{u.role}</td>
                    {userRole === "admin" && (
                      <td className="px-6 py-3">
                        <span
                          className={`px-4 py-1 rounded-full text-xs font-medium ${
                            u.status === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {u.status === 1 ? "Aktif" : "Non Aktif"}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(u)} className="text-blue-600 hover:text-blue-900">
                          <Edit2 size={20} />
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-3 bg-gray-50">
            <p className="text-sm text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold">{editMode ? "Edit User" : "Tambah User"}</h2>
                <button onClick={closeModal}>
                  <X size={24} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Nama</label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={editMode ? "Kosongkan jika tidak ingin diubah" : ""}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-3 py-2`}
                  >
                    <option value="">Pilih Role</option>
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hanya tampil untuk admin */}
               {userRole === "admin" && (
              <div className="col-span-2">
                   <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                            <option value={1}>Aktif</option>
                            <option value={0}>Non Aktif</option>
                        </select>
                </div>
                )}
              </div>

              <div className="flex gap-3 p-6 border-t">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editMode ? "Update" : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
