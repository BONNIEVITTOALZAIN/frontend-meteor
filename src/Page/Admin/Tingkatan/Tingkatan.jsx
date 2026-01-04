import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../../utils/api";

const Tingkatan = () => {
  const [Tingkatan, setTingkatan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTingkatan, setCurrentTingkatan] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ nama: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  useEffect(() => {
    fetchTingkatan();
  }, []);

  const fetchTingkatan = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/tingkatan");
      setTingkatan(res.data);
    } catch (err) {
      console.error("Error fetching Tingkatan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      Swal.fire("Gagal", "Nama Tingkatan wajib diisi!", "error");
      return;
    }

    try {
      if (editMode) {
        await api.put(`/admin/tingkatan/${currentTingkatan.id}`, formData);
        Swal.fire("Berhasil!", "Data Tingkatan telah diperbarui.", "success");
      } else {
        await api.post("/admin/tingkatan", formData);
        Swal.fire("Berhasil!", "Data Tingkatan telah ditambahkan.", "success");
      }

      fetchTingkatan();
      closeModal();
    } catch (err) {
      console.error("Error saving Tingkatan:", err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  const handleEdit = (item) => {
    setEditMode(true);
    setCurrentTingkatan(item);
    setFormData({ nama: item.nama });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data Tingkatan ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      confirmButtonColor: "blue",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/admin/tingkatan/${id}`);
      Swal.fire("Berhasil!", "Data Tingkatan telah dihapus.", "success");
      fetchTingkatan();
    } catch (err) {
      console.error("Error deleting Tingkatan:", err);
      Swal.fire("Gagal!", "Tidak dapat menghapus data.", "error");
    }
  };

  const openAddModal = () => {
    setFormData({ nama: "" });
    setEditMode(false);
    setCurrentTingkatan(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentTingkatan(null);
  };

  // 🔍 Filter
  const filteredTingkatan = Tingkatan.filter((t) =>
    t.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📄 Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredTingkatan.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTingkatan.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-8 shadow-xl shadow-gray-400/50 rounded-2xl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Kelola Tingkatan</h1>
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari Tingkatan..."
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Nama Tingkatan
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-10 text-gray-500"
                  >
                     <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-10 text-gray-500"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      {indexOfFirst + index + 1}
                    </td>
                    <td className="px-6 py-3">{item.nama}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
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
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold">
                  {editMode ? "Edit Tingkatan" : "Tambah Tingkatan"}
                </h2>
                <button onClick={closeModal}>
                  <X size={24} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Nama Tingkatan
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Masukkan nama Tingkatan..."
                  />
                </div>

                <div className="flex gap-3 border-t pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editMode ? "Update" : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tingkatan;
