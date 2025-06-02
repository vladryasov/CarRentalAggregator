import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import AdminPage from './pages/AdminPage';
import CarDetailsPage from './pages/CarDetailsPage';
import RentalHistoryPage from './pages/RentalHistoryPage';
import { autoLogin } from './services/api';

interface PageProps {
  setIsAuthChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const App: React.FC = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const remembered = localStorage.getItem('currentUser');
      
      if (remembered) {
        try {
          await autoLogin();
          setIsAuthChecked(true);
        } catch {
          localStorage.removeItem('currentUser');
          setIsAuthChecked(false);
        }
      } else {
        setIsAuthChecked(false);
      }
    };

    checkAuth();
  }, []);

  if (!isAuthChecked) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthChecked={setIsAuthChecked} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/main" element={<MainPage setIsAuthChecked={setIsAuthChecked} />} />
      <Route path="/admin" element={<AdminPage setIsAuthChecked={setIsAuthChecked} />} />
      <Route path="/car/:id" element={<CarDetailsPage />} />
      <Route path="/rentals" element={<RentalHistoryPage />} />
      <Route path="/" element={<Navigate to="/main" replace />} />
      <Route path="*" element={<Navigate to="/main" replace />} />
    </Routes>
  );
};

export default App;
