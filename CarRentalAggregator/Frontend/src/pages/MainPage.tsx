import React, { useEffect, useState, useRef } from 'react';
import CarListCard from '../components/CarListCard';
import FilterPanel from '../components/FilterPanel';
import AccountIcon from '../components/AccountIcon';
import { CarDto } from '../types/CarDto';
import { fetchCars, fetchCarsByFilter } from '../services/api';

interface MainPageProps {
  setIsAuthChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainPage: React.FC<MainPageProps> = ({ setIsAuthChecked }) => {
  const [cars, setCars] = useState<CarDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [priceOrder, setPriceOrder] = useState<'asc' | 'desc' | null>(null);
  const [engineCapacityRange, setEngineCapacityRange] = useState<{ min: number; max: number }>({ min: 1.0, max: 10.0 });
  const [enginePowerRange, setEnginePowerRange] = useState<{ min: number; max: number }>({ min: 50, max: 1500 });
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 10, max: 2000 });
  const [searchQuery, setSearchQuery] = useState<string>('');


  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const loadCars = async () => {
      console.log('Loading initial cars...');
      try {
        const data = await fetchCars();
        console.log('Fetched cars:', data);
        setCars(data);
        setNotFound(data.length === 0);
      } catch (err) {
        console.error('Failed to fetch cars:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const applyFilters = async () => {
  console.log('Applying filters with current query:', searchQuery);
  setLoading(true);
  try {
    const filteredCars = await fetchCarsByFilter(
      engineCapacityRange.min,
      engineCapacityRange.max,
      enginePowerRange.min,
      enginePowerRange.max,
      priceRange.min,
      priceRange.max,
      priceOrder,
      searchQuery // теперь всегда учитываем поиск
    );
    setCars(filteredCars);
    setNotFound(filteredCars.length === 0);
  } catch (err) {
    console.error('Filter failed:', err);
    setCars([]);
    setNotFound(true);
  } finally {
    setLoading(false);
  }
};

  const handleSearchChange = async (query: string) => {
  console.log('Searching for:', query);
  setSearchQuery(query); // сохраняем

  setLoading(true);
  try {
    if (!query.trim()) {
      // Пустой запрос → загружаем все машины
      const allCars = await fetchCars();
      setCars(allCars);
      setNotFound(allCars.length === 0);
    } else {
      const filtered = await fetchCarsByFilter(
        engineCapacityRange.min,
        engineCapacityRange.max,
        enginePowerRange.min,
        enginePowerRange.max,
        priceRange.min,
        priceRange.max,
        priceOrder,
        query // передаем строку поиска!
      );
      setCars(filtered);
      setNotFound(filtered.length === 0);
    }
  } catch (err) {
    console.error('Search failed:', err);
    setCars([]);
    setNotFound(true);
  } finally {
    setLoading(false);
  }
};


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
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      <AccountIcon setIsAuthChecked={setIsAuthChecked} isOpen={menuOpen} toggleMenu={toggleMenu} />
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
        ) : notFound ? (
          <div style={{ textAlign: 'center', fontStyle: 'italic' }}>No cars found matching your search.</div>
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
            {cars.map((car) => (
              <CarListCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          flex: 1,
          maxWidth: '260px',
          padding: '16px',
          backgroundColor: '#fff',
          borderLeft: '1px solid #ddd',
          boxSizing: 'border-box',
        }}
      >
        <FilterPanel
          priceOrder={priceOrder}
          onSearchChange={handleSearchChange}
          onPriceOrderChange={setPriceOrder}
          onEngineCapacityChange={setEngineCapacityRange}
          onEnginePowerChange={setEnginePowerRange}
          onPriceRangeChange={setPriceRange}
          onApplyFilters={() => applyFilters()}
        />
      </div>
    </div>
  );
};

export default MainPage;