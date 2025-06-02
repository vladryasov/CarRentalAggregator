import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout, api } from '../services/api';

interface Props {
  setIsAuthChecked: (value: boolean) => void;
  isOpen: boolean;
  toggleMenu: () => void;
}

const AccountIcon: React.FC<Props> = ({ setIsAuthChecked, isOpen, toggleMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Всегда вызываем useEffect
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        toggleMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleMenu]);

  // Только после хуков — проверка пути
  if (location.pathname === '/') return null;

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('currentUser');
      delete api.defaults.headers.Authorization;
      setIsAuthChecked(false);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        style={{
          position: 'fixed',
          top: '15px',
          left: '15px',
          fontSize: '24px',
          zIndex: 100,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        👤
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.3)',
              zIndex: 800
            }}
          />
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100%',
              width: '250px',
              backgroundColor: '#fff',
              boxShadow: '2px 0 6px rgba(0,0,0,0.2)',
              zIndex: 900,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '20px'
            }}
          >
            <div>
              <h3>Account</h3>
              <p style={{ marginTop: '30px' }}>Profile settings</p>
              <p 
                onClick={() => {
                  navigate('/rentals');
                  toggleMenu();
                }}
                style={{
                  cursor: 'pointer',
                  color: '#2c3e50',
                  transition: 'color 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#3498db'}
                onMouseOut={(e) => e.currentTarget.style.color = '#2c3e50'}
              >
                Rental history
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
                marginBottom: '40px'
              }}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default AccountIcon;
