import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import ScanPage from './ScanPage';

const SESSION_KEY = 'holi_admin_auth';

export default function App() {
  const [isAuthed, setIsAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  );

  // /admin/leo is its own self-contained page (has its own login)
  // so we render it WITHOUT the global scan-page auth gate
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin ticket-adding panel — has its own password (3421) */}
        <Route path="/admin/leo" element={<AdminPanel />} />

        {/* All other routes go through the scan-page PIN gate (3241) */}
        <Route
          path="/:id"
          element={
            isAuthed
              ? <ScanPage />
              : <AdminLogin onSuccess={() => {
                sessionStorage.setItem(SESSION_KEY, 'true');
                setIsAuthed(true);
              }} />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/demo" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
