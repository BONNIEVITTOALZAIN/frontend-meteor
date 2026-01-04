import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, Search } from "lucide-react";
import Swal from 'sweetalert2';
import api from "../../../utils/api";

const Jadwal = () => {
  const [jadwals, setJadwals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentJadwal, setCurrentJadwal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  // 🔍 SEARCH FEATURE
  const [searchTerm, setSearchTerm] = useState("");

  const [jenisList, setJenisList] = useState([]);
  const [tingkatanList, setTingkatanList] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [ruanganList, setRuanganList] = useState([]);
  const [userList, setUserList] = useState([]);

  const [formData, setFormData] = useState({
    hari: "",
    waktu_mulai: "",
    waktu_selesai: "",
    jenis_id: "",
    tingkatan_id: "",
    kelas_id: "",
    ruangan_id: "",
    pengajar_id: "",
    barcode: "",
  });

  const hariOptions = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  useEffect(() => {
    fetchJadwals();
    fetchDropdownData();
  }, []);

  const fetchJadwals = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jadwal");
      setJadwals(res.data);
    } catch (err) {
      console.error("Error fetching jadwals:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [jenis, tingkatan, kelas, ruangan, user] = await Promise.all([
        api.get("/admin/jenis"),
        api.get("/admin/tingkatan"),
        api.get("/admin/kelas"),
        api.get("/admin/ruangan"),
        api.get("/admin/user"),
      ]);
      setJenisList(jenis.data);
      setTingkatanList(tingkatan.data);
      setKelasList(kelas.data);
      setRuanganList(ruangan.data);
      setUserList(user.data);
    } catch (err) {
      console.error("Error fetching dropdown data:", err);
    }
  };

  const generateBarcode = (hari) => {
  if (!hari) return "";
  const prefix = "JDW";
  const hariCode = hari.slice(0, 3).toUpperCase(); 
  const random = Math.random().toString(36).substring(2, 8).toUpperCase(); 
  return `${prefix}-${hariCode}-${random}`;
};


  const handleInputChange = (e) => {
  const { name, value } = e.target;

  // jika user mengganti hari, generate barcode baru otomatis
  if (name === "hari") {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      barcode: generateBarcode(value),
    }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.hari ||
      !formData.waktu_mulai ||
      !formData.waktu_selesai ||
      !formData.jenis_id ||
      !formData.tingkatan_id ||
      !formData.kelas_id ||
      !formData.ruangan_id ||
      !formData.pengajar_id ||
      !formData.barcode
    ) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      if (editMode) {
        await api.put(`/jadwal/${currentJadwal.id}`, formData);
        Swal.fire("Berhasil!", "Data telah diperbarui.", "success");
      } else {
        await api.post("/jadwal", formData);
        Swal.fire("Berhasil!", "Data telah disimpan.", "success");
      }
      fetchJadwals();
      closeModal();
    } catch (err) {
      console.error("Error saving jadwal:", err);
      alert("Gagal menyimpan data.");
    }
  };

  const handleEdit = (jadwal) => {
    setCurrentJadwal(jadwal);
    setFormData({
      hari: jadwal.hari,
      waktu_mulai: jadwal.waktu_mulai,
      waktu_selesai: jadwal.waktu_selesai,
      jenis_id: jadwal.jenis_id,
      tingkatan_id: jadwal.tingkatan_id,
      kelas_id: jadwal.kelas_id,
      ruangan_id: jadwal.ruangan_id,
      pengajar_id: jadwal.pengajar_id
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data jadwal ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      confirmButtonColor: "blue",
    });
    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/jadwal/${id}`);
      Swal.fire("Berhasil!", "Data jadwal telah dihapus.", "success");
      fetchJadwals();
    } catch (err) {
      console.error("Error deleting jadwal:", err);
      alert("Gagal menghapus jadwal.");
    }
  };

  //Filter data berdasarkan search
  const filteredJadwals = jadwals.filter((j) => {
    const term = searchTerm.toLowerCase();
    return (
      j.hari.toLowerCase().includes(term) ||
      j.jenis?.nama?.toLowerCase().includes(term) ||
      j.tingkatan?.nama?.toLowerCase().includes(term) ||
      j.kelas?.nama?.toLowerCase().includes(term) ||
      j.ruangan?.nama?.toLowerCase().includes(term) ||
      j.pengajar?.nama?.toLowerCase().includes(term)
    );
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredJadwals.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredJadwals.length / itemsPerPage);

  const openAddModal = () => {
    setFormData({
      hari: "",
      waktu_mulai: "",
      waktu_selesai: "",
      jenis_id: "",
      tingkatan_id: "",
      kelas_id: "",
      ruangan_id: "",
      pengajar_id: "",
    });
    setEditMode(false);
    setCurrentJadwal(null);
    setShowModal(true);
  };

  

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentJadwal(null);
  };

  return (
     <div className="min-h-screen bg-gray-50 p-8 shadow-xl shadow-gray-400/50 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Kelola Jadwal</h1>
          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* 🔍 Input Search */}
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari jadwal..."
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Hari</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Waktu</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Jenis</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tingkatan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Kelas</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ruangan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Pengajar</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Barcode</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="8" className="text-center py-10 text-gray-500"> 
                <div className="flex justify-center items-center h-64">
         <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          </td></tr>
              ) : currentItems.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-10 text-gray-500">Tidak ada data</td></tr>
              ) : (
                currentItems.map((j) => (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">{j.hari}</td>
                    <td className="px-6 py-3">{j.waktu_mulai} - {j.waktu_selesai}</td>
                    <td className="px-6 py-3">{j.jenis?.nama || "-"}</td>
                    <td className="px-6 py-3">{j.tingkatan?.nama || "-"}</td>
                    <td className="px-6 py-3">{j.kelas?.nama || "-"}</td>
                    <td className="px-6 py-3">{j.ruangan?.nama || "-"}</td>
                    <td className="px-6 py-3">{j.pengajar?.nama || "-"}</td>
                    <td className="px-6 py-3">{j.barcode}</td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(j)} className="text-blue-600 hover:text-blue-900">
                          <Edit2 size={20} />
                        </button>
                        <button onClick={() => handleDelete(j.id)} className="text-red-600 hover:text-red-900">
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
                <h2 className="text-xl font-bold">
                  {editMode ? "Edit Jadwal" : "Tambah Jadwal"}
                </h2>
                <button onClick={closeModal}>
                  <X size={24} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-2 gap-4">
                {/* Hari */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Hari</label>
                  <select
                    name="hari"
                    value={formData.hari}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Pilih Hari</option>
                    {hariOptions.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Waktu Mulai */}
                <div>
                  <label className="block text-sm font-medium mb-1">Waktu Mulai</label>
                  <input
                    type="time"
                    name="waktu_mulai"
                    value={formData.waktu_mulai}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* Waktu Selesai */}
                <div>
                  <label className="block text-sm font-medium mb-1">Waktu Selesai</label>
                  <input
                    type="time"
                    name="waktu_selesai"
                    value={formData.waktu_selesai}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                {/* Jenis */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Jenis</label>
                  <select
                    name="jenis_id"
                    value={formData.jenis_id}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Pilih Jenis</option>
                    {jenisList.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tingkatan */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Tingkatan</label>
                  <select
                    name="tingkatan_id"
                    value={formData.tingkatan_id}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Pilih Tingkatan</option>
                    {tingkatanList.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Kelas */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Kelas</label>
                  <select
                    name="kelas_id"
                    value={formData.kelas_id}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ruangan */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Ruangan</label>
                  <select
                    name="ruangan_id"
                    value={formData.ruangan_id}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Pilih Ruangan</option>
                    {ruanganList.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pengajar */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Pengajar</label>
                  <select
                    name="pengajar_id"
                    value={formData.pengajar_id}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Pilih Pengajar</option>                
                      {userList
                        .filter((p) => p.role === "pengajar") // hanya tampilkan role pengajar
                          .map((p) => (
                      <option key={p.id} value={p.id}>
                            {p.nama}
                      </option>
                       ))} 
                  </select>
                </div>

                {/*barcode*/}
                <div>
                  <label className="block text-sm font-medium mb-1">Barcode</label>
                 <input
                    type="text"
                    name="barcode"
                    value={formData.barcode || ""}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                         Barcode dibuat otomatis berdasarkan hari.
                  </p>
                </div>
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

export default Jadwal;
