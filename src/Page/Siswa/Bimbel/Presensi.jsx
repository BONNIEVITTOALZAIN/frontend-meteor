import { useEffect, useState } from "react";
import { QrCode, X } from "lucide-react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Swal from "sweetalert2";
import api from "../../../utils/api";


export default function Presensi() {
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchAbsensi = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/absensi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataUser = res.data.filter((item) => item.siswa_id === user.id);
      setAbsensi(dataUser);
    } catch (err) {
      console.error("Gagal mengambil data absensi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsensi();
  }, []);

  const handleScan = async (data) => {
    if (data && !scanResult) {
      setScanResult(data.text);
      setScanning(false);

      try {
        const token = localStorage.getItem("token");
        const res = await api.post(
          `/absensi/scan`,
          { barcode: data.text, siswa_id: user?.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: res.data.message || "Absensi berhasil direkam.",
          timer: 2000,
          showConfirmButton: false,
        });

        await fetchAbsensi();
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: err.response?.data?.message || "Gagal melakukan absensi.",
        });
      } finally {
        setTimeout(() => setScanResult(null), 1500);
      }
    }
  };

  const handleError = (err) => {
    if (err?.name !== "NotFoundException") {
      console.error("Scanner Error:", err);
    }
  };

  const processAbsensiData = () => {
    const grouped = {};
    const bulanSekarang = new Date().getMonth();
    const tahunSekarang = new Date().getFullYear();

    const dataBulanIni = absensi.filter((item) => {
      const tanggal = new Date(item.tanggal);
      return (
        tanggal.getMonth() === bulanSekarang &&
        tanggal.getFullYear() === tahunSekarang
      );
    });

    dataBulanIni.forEach((item) => {
      const jenis = item.jadwal?.jenis?.nama || "Tidak Diketahui";
      const kelas = item.jadwal?.kelas?.nama || "-";
      const tingkatan = item.jadwal?.tingkatan?.nama || "-";
      const waktu = `${item.jadwal?.waktu_mulai || "-"} - ${item.jadwal?.waktu_selesai || "-"}`;
      const key = `${jenis}-${kelas}-${tingkatan}`;

      if (!grouped[key]) {
        grouped[key] = { jenis, kelas, tingkatan, waktu, pertemuan: [] };
      }

      grouped[key].pertemuan.push({
        tanggal: item.tanggal,
        status: item.status,
      });
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key].pertemuan = grouped[key].pertemuan
        .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal))
        .slice(-8);
    });

    return Object.values(grouped);
  };

  const tableData = processAbsensiData();
  const maxPertemuan = 8;

  const hitungPersentase = (pertemuan) => {
    const total = pertemuan.length;
    if (total === 0) return "0 %";
    const hadir = pertemuan.filter((p) => p.status === "Hadir").length;
    return `${((hadir / total) * 100).toFixed(2)} %`;
  };

  const renderStatusCell = (status, key) => {
    if (!status || status === "-") {
      return (
        <td key={key} className="border border-gray-300 p-2 text-center bg-white text-gray-400 text-xs">
          -
        </td>
      );
    }

    let bgColor = "bg-green-500";
    let displayText = "H";

    if (status === "Izin") {
      bgColor = "bg-orange-500";
      displayText = "I";
    } else if (status === "Alpha" || status === "Alpa") {
      bgColor = "bg-red-500";
      displayText = "A";
    } else if (status === "Sakit") {
      bgColor = "bg-blue-500";
      displayText = "S";
    }

    return (
      <td key={key} className={`border border-gray-300 p-2 text-center ${bgColor}`}>
        <span className="font-bold text-white">{displayText}</span>
      </td>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat presensi...</p>
        </div>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full max-w-6xl mx-auto px-4 sm:px-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
          📋 Daftar Presensi Berdasarkan Jadwal
        </h2>

        <button
          onClick={() => setScanning(true)}
          className="flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md w-full sm:w-auto"
        >
          <QrCode size={20} />
          Scan Barcode
        </button>
      </div>

      {/* MODAL SCANNER */}
      {scanning && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 px-4">
          <div className="bg-white p-5 rounded-2xl shadow-lg relative w-full max-w-md">
            <button
              onClick={() => setScanning(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
            >
              <X size={24} />
            </button>

            <h3 className="text-base sm:text-lg font-semibold text-center mb-3">
              Arahkan kamera ke barcode
            </h3>

            <div className="overflow-hidden rounded-xl border border-gray-300">
              <BarcodeScannerComponent
                width={"100%"}
                height={250}
                onUpdate={(err, result) => {
                  if (result) handleScan(result);
                  if (err) handleError(err);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* LEGEND */}
      <div className="mb-4 flex flex-wrap gap-4 sm:gap-6 items-center bg-white p-4 rounded-lg shadow justify-center sm:justify-start">
        {[
          { color: "green-500", text: "Hadir", code: "H" },
          { color: "orange-500", text: "Izin", code: "I" },
          { color: "red-500", text: "Alpha (Tanpa Keterangan)", code: "A" },
          { color: "blue-500", text: "Sakit", code: "S" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 bg-${item.color} rounded flex items-center justify-center`}>
              <span className="font-bold text-white text-sm">{item.code}</span>
            </div>
            <span className="text-sm text-gray-700 font-medium">{item.text}</span>
          </div>
        ))}
      </div>

      {/* TABEL ABSENSI */}
      {absensi.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">Belum ada data absensi.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-[900px] w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th rowSpan="2" className="border border-gray-300 p-2 sm:p-3 text-left font-bold text-gray-800 w-36 sm:w-48">
                  JENIS
                </th>
                <th rowSpan="2" className="border border-gray-300 p-2 sm:p-3 text-center font-bold text-gray-800 w-24 sm:w-32">
                  KELAS
                </th>
                <th rowSpan="2" className="border border-gray-300 p-2 sm:p-3 text-center font-bold text-gray-800 w-24 sm:w-32">
                  TINGKATAN
                </th>
                <th rowSpan="2" className="border border-gray-300 p-2 sm:p-3 text-center font-bold text-gray-800 w-32 sm:w-40">
                  WAKTU
                </th>
                <th colSpan={maxPertemuan} className="border border-gray-300 p-2 sm:p-3 text-center font-bold text-gray-800">
                  PERTEMUAN
                </th>
                <th rowSpan="2" className="border border-gray-300 p-2 sm:p-3 text-center font-bold text-gray-800 w-32 sm:w-40">
                  PERSENTASE KEHADIRAN (%)
                </th>
              </tr>
              <tr className="bg-gray-200">
                {[...Array(maxPertemuan)].map((_, i) => (
                  <th key={i} className="border border-gray-300 p-1 sm:p-2 text-center text-[10px] sm:text-xs font-bold text-gray-700 w-8 sm:w-10">
                    {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, idx) => {
                const persentase = hitungPersentase(row.pertemuan);
                const persentaseNum = parseFloat(persentase);
                const isZeroPercent = persentaseNum === 0;

                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-2 sm:p-3 font-medium text-gray-800 bg-white">{row.jenis}</td>
                    <td className="border border-gray-300 p-2 sm:p-3 text-center text-gray-700">{row.kelas}</td>
                    <td className="border border-gray-300 p-2 sm:p-3 text-center text-gray-700">{row.tingkatan}</td>
                    <td className="border border-gray-300 p-2 sm:p-3 text-center text-gray-700 text-xs">{row.waktu}</td>
                    {[...Array(maxPertemuan)].map((_, i) => {
                      const pertemuan = row.pertemuan[i];
                      const status = pertemuan?.status;
                      return renderStatusCell(status, `${idx}-${i}`);
                    })}
                    <td className={`border border-gray-300 p-2 sm:p-3 text-center font-bold ${
                      isZeroPercent ? "bg-red-500 text-white" : "text-gray-800"
                    }`}>
                      {persentase}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
