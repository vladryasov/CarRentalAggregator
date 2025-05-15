import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { autoLogin } from './services/api';

const App: React.FC = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await autoLogin();
        navigate('/dashboard');
      } catch {
        // not logged in, stay on login page
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, [navigate]);

  if (!isAuthChecked) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<div>Dashboard (to be implemented)</div>} />
    </Routes>
  );
};

export default App;
