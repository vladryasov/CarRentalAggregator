import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import { autoLogin } from './services/api';

const App: React.FC = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const remembered = localStorage.getItem('rememberedUser');

      if (!remembered) {
        try {
          await autoLogin(); // только если не помечен как remembered
          navigate('/main');
        } catch {
          // не авторизован
        }
      }

      setIsAuthChecked(true);
    };

    checkAuth();
  }, [navigate]);

  if (!isAuthChecked) return <div>Loading...</div>;

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/main" element={<MainPage setIsAuthChecked={setIsAuthChecked} />} />
      </Routes>
    </>
  );
};

export default App;

