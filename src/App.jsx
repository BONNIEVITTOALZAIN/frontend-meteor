import './App.css'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import LoginPage from './Page/Auth/LoginPage';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminRoute from './Page/Admin/AdminRoute';
import SiswaRoute from './Page/Siswa/SiswaRoute';
import LockPage from './Page/Auth/LockPage';
import ResetPassword from './Page/Auth/ResetPassword';
import SiswaDashboardPage from './Page/Siswa/SiswaDashboardPage';
import AdminDashboardPage from './Page/Admin/AdminDashboardPage';
import Pengumuman from './Page/Admin/Pengumuman/Pengumuman';
import Jadwal from './Page/Admin/Jadwal/Jadwal';
import Kelas from './Page/Admin/Kelas/Kelas';
import Tingkatan from './Page/Admin/Tingkatan/Tingkatan';
import Jenis from './Page/Admin/Jenis/Jenis';
import Ruangan from './Page/Admin/Ruangan/Ruangan';
import User from './Page/Admin/User/User';
import JadwalSiswa from './Page/Siswa/Bimbel/JadwalSiswa';
import Presensi from './Page/Siswa/Bimbel/Presensi';
import PengajarRoute from './Page/Pengajar/PengajarRoute';
import PengajarDashboardPage from './Page/Pengajar/PengajarDashboard';

function App() {

  return (
   <>
      <BrowserRouter>  
      <Routes>
        {/* Login default */}
        <Route path="/" element={<LoginPage />} />

        {/* Halaman khusus admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute ProtectedRoute allowedRoles={["admin"]}>
                <AdminRoute />
            </ProtectedRoute>
          }
        >
             {/* child routes (nested) */}
            <Route index element={<AdminDashboardPage />} />
            <Route path="pengumuman" element={<Pengumuman />} />
            <Route path="jadwal" element={<Jadwal />} />
            <Route path="kelas" element={<Kelas />} />
            <Route path="tingkatan" element={<Tingkatan />} />
            <Route path="jenis" element={<Jenis />} />
            <Route path="ruangan" element={<Ruangan />} />
            <Route path="pengguna" element={<User />} />
          </Route>


        {/* Halaman khusus pengajar */}
        <Route 
          path="/pengajar"
          element={
            <ProtectedRoute allowedRoles={['pengajar', 'admin']}>
              <PengajarRoute />
            </ProtectedRoute>
          }
        >
          {/* nested routes */}
          <Route index element={<PengajarDashboardPage />} />
          <Route path="profil/reset-password" element={<ResetPassword />} />
          <Route path="siswa" element={<User />} />
        </Route>

        <Route
           path="/siswa"
          element={
            <ProtectedRoute allowedRoles={["siswa"]}>
                  <SiswaRoute />
            </ProtectedRoute>
            }
        >
           {/* nested routes */}
            <Route index element={<SiswaDashboardPage />} /> 
            <Route path="profil/reset-password" element={<ResetPassword />} />
            <Route path="perbimbelan" element={<JadwalSiswa/>} />
            <Route path="presensi" element={<Presensi />} />
          </Route>


        {/* Jika user tidak punya izin */}
        <Route path="/unauthorized" element={<h1>Akses Ditolak ❌</h1>} />
      </Routes>
    </BrowserRouter>
    <LockPage />
   </>
  )
}

export default App;
