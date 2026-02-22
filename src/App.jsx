import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import ScanPage from './ScanPage';

const SESSION_KEY = 'holi_admin_auth';

export default function App() {
  // Check sessionStorage so auth survives React re-renders & route changes,
  // but resets when the browser tab is closed.
  const [isAuthed, setIsAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  );

  // Show admin PIN gate until authenticated
  if (!isAuthed) {
    return <AdminLogin onSuccess={() => setIsAuthed(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Dynamic ticket ID route */}
        <Route path="/:id" element={<ScanPage />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/demo" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
