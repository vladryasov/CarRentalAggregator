import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import AdminPage from './pages/AdminPage';
import { autoLogin } from './services/api';

const App: React.FC = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const remembered = localStorage.getItem('currentUser');

      //if (remembered?.includes("true")) {
        try {
          await autoLogin(); // только если не помечен как remembered
          navigate('/main');
        } catch {
          // не авторизован
        }
      }

      setIsAuthChecked(true);
    //};

    checkAuth();
  }, [navigate]);

  if (!isAuthChecked) return <div>Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage setIsAuthChecked={setIsAuthChecked} />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </>
  );
};

export default App;
