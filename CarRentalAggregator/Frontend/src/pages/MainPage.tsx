import React, { useEffect, useState } from 'react';
import CarCard from '../components/CarCard';
import FilterPanel from '../components/FilterPanel';
import AccountIcon from '../components/AccountIcon';
import { CarDto } from '../types/CarDto';
import { fetchCars } from '../services/api';

interface Props {
  setIsAuthChecked: (value: boolean) => void;
}

const MainPage: React.FC<Props> = ({ setIsAuthChecked }) => {
  const [cars, setCars] = useState<CarDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchCars();
        setCars(data);
      } catch (err) {
        console.error('Failed to fetch cars:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        position: 'relative',
        overflowX: 'hidden', // 👈 убираем горизонтальный скролл
        boxSizing: 'border-box', // 👈 padding теперь не выходит за границы
      }}
    >
      {/* Меню аккаунта */}
      <AccountIcon
        setIsAuthChecked={setIsAuthChecked}
        isOpen={menuOpen}
        toggleMenu={toggleMenu}
      />

      {/* Основной контент */}
      <div
        style={{
          flex: 3,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '20px' }}>Available Cars</h1>

        {loading ? (
          <div>Loading cars...</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              width: '100%',
              maxWidth: '1200px',
            }}
          >
            {cars.length > 0 ? (
              cars.map((car) => <CarCard key={car.id} car={car} />)
            ) : (
              <div style={{ textAlign: 'center', fontStyle: 'italic', gridColumn: '1/-1' }}>No cars available</div>
            )}
          </div>
        )}
      </div>

      {/* Панель фильтров */}
      <div
        style={{
          flex: 1,
          maxWidth: '260px', // 👈 делаем уже
          padding: '16px',
          backgroundColor: '#fff',
          borderLeft: '1px solid #ddd',
          boxSizing: 'border-box',
        }}
      >
        <FilterPanel />
      </div>
    </div>
  );
};

export default MainPage;



