import { useState, useEffect } from "react";
import { X, Clock, GraduationCap, BookOpen, MapPin, User } from "lucide-react";
import api from "../../../utils/api";

export default function JadwalSiswa() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/jadwal');
      const transformedData = transformJadwalData(response.data);
      setJadwal(transformedData);
      
    } catch (err) {
      console.error('Error fetching jadwal:', err);
      setError(err.response?.data?.message || 'Gagal memuat jadwal');
    } finally {
      setLoading(false);
    }
  };

const transformJadwalData = (apiData) => {
  const grouped = {};

  apiData.forEach((item) => {
    const timeKey = `${item.waktu_mulai}–${item.waktu_selesai}`;

    if (!grouped[timeKey]) {
      grouped[timeKey] = {};
    }

    if (!grouped[timeKey][item.hari]) {
      grouped[timeKey][item.hari] = [];
    }

    grouped[timeKey][item.hari].push({
      jenis:
        item.jenis?.nama ||
        item.jenis_id?.nama ||
        item.jenis_id ||
        '-',
      tingkatan:
        item.tingkatan?.nama ||
        item.tingkatan_id?.nama ||
        item.tingkatan_id ||
        '-',
      kelas:
        item.kelas?.nama ||
        item.kelas_id?.nama ||
        item.kelas_id ||
        '-',
      ruangan:
        item.ruangan?.nama ||
        item.ruangan_id?.nama ||
        item.ruangan_id ||
        '-',
      pengajar:
        item.pengajar?.nama ||
        item.pengajar_id?.nama ||
        item.pengajar_id ||
        '-',
      waktu: timeKey,
      hari: item.hari,
    });
  });

  const result = [];
  Object.keys(grouped).forEach((timeKey) => {
    Object.keys(grouped[timeKey]).forEach((hari) => {
      result.push({
        jam: timeKey,
        hari: [hari],
        items: grouped[timeKey][hari],
      });
    });
  });

  return result;
};


  const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const getUniqueTimeSlots = () => {
    const timeSlots = [...new Set(jadwal.map(j => j.jam))];
    return timeSlots.sort();
  };

  const getJenisColor = (jenis) => {
    const colors = {
      'Calistung': 'bg-purple-500',
      'English': 'bg-blue-500',
      'Matematika': 'bg-green-500',
      'Sains': 'bg-orange-500',
    };
    return colors[jenis] || 'bg-gray-500';
  };

  const openModal = (item) => {
    setSelectedClass(item);
  };

  const closeModal = () => {
    setSelectedClass(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Jadwal Kelas</h1>
          <p className="text-gray-500 text-sm">Klik pada kelas untuk melihat detail</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
             <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
          </div>
        )}

        {error && (
          <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchJadwal}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Waktu
                    </th>
                    {hariList.map((hari) => (
                      <th key={hari} className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[140px]">
                        {hari}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getUniqueTimeSlots().map((jam) => (
                    <tr key={jam} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        {jam}
                      </td>
                      {hariList.map((hari) => {
                        const found = jadwal.find(
                          (j) => j.jam === jam && j.hari.includes(hari)
                        );
                        return (
                          <td key={hari} className="px-4 py-4">
                            {found ? (
                              <div className="space-y-1.5">
                                {found.items.map((item, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => openModal(item)}
                                    className={`${getJenisColor(item.jenis)} text-white px-3 py-1.5 rounded-md text-xs font-medium hover:opacity-90 active:scale-95 transition-all w-full text-left shadow-sm`}
                                  >
                                    {item.jenis}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center text-gray-300 text-xs">—</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedClass && (
        <div 
          className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center p-4 z-50 "
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`${getJenisColor(selectedClass.jenis)} p-6 text-white relative`}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-1">{selectedClass.jenis}</h2>
              <p className="text-white text-opacity-90 text-sm">Detail Kelas</p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Waktu</p>
                  <p className="text-gray-900 font-semibold">{selectedClass.waktu}</p>
                  <p className="text-sm text-gray-600">{selectedClass.hari}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Tingkatan</p>
                  <p className="text-gray-900 font-semibold">{selectedClass.tingkatan}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Kelas</p>
                  <p className="text-gray-900 font-semibold">{selectedClass.kelas}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Ruangan</p>
                  <p className="text-gray-900 font-semibold">{selectedClass.ruangan}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Pengajar</p>
                  <p className="text-gray-900 font-semibold">{selectedClass.pengajar}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={closeModal}
                className="w-full py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

     <style>{`
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes scale-in {
    from { 
      opacity: 0;
      transform: scale(0.95);
    }
    to { 
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
  
  .animate-scale-in {
    animation: scale-in 0.2s ease-out;
  }
`}</style>

    </div>
  );
}