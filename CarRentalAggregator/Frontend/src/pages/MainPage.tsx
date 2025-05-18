import React, { useEffect, useState, useCallback } from 'react';
import CarCard from '../components/CarCard';
import FilterPanel from '../components/FilterPanel';
import AccountIcon from '../components/AccountIcon';
import { CarDto } from '../types/CarDto';
import { fetchCars } from '../services/api';
import api from '../services/api';
import debounce from 'lodash/debounce';

interface Props {
  setIsAuthChecked: (value: boolean) => void;
}

const MainPage: React.FC<Props> = ({ setIsAuthChecked }) => {
  const [initialCars, setInitialCars] = useState<CarDto[]>([]); // Исходный список машин
  const [cars, setCars] = useState<CarDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [priceOrder, setPriceOrder] = useState<'asc' | 'desc' | null>(null);
  const [engineCapacityRange, setEngineCapacityRange] = useState<{ min: number; max: number }>({ min: 1.0, max: 10.0 });
  const [enginePowerRange, setEnginePowerRange] = useState<{ min: number; max: number }>({ min: 50, max: 1500 });
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 10, max: 2000 });

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchCars();
        setInitialCars(data); // Сохраняем исходный список
        filterCars(data);
        setNotFound(false);
      } catch (err) {
        console.error('Failed to fetch cars:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const filterCars = (data: CarDto[]) => {
    setLoading(true);
    try {
      let filteredCars = [...data];

      // Фильтрация по диапазонам
      filteredCars = filteredCars.filter(
        (car) =>
          car.engineCapacity >= engineCapacityRange.min &&
          car.engineCapacity <= engineCapacityRange.max &&
          car.enginePower >= enginePowerRange.min &&
          car.enginePower <= enginePowerRange.max &&
          car.priceForOneDay >= priceRange.min &&
          car.priceForOneDay <= priceRange.max
      );

      // Сортировка
      if (priceOrder === 'asc') {
        filteredCars.sort((a, b) => a.priceForOneDay - b.priceForOneDay);
      } else if (priceOrder === 'desc') {
        filteredCars.sort((a, b) => b.priceForOneDay - a.priceForOneDay);
      }

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

  // Debounce для фильтрации
  const debouncedFilterCars = useCallback(
    debounce((data: CarDto[]) => {
      filterCars(data);
    }, 300),
    [engineCapacityRange, enginePowerRange, priceRange, priceOrder]
  );

  const handleSearchChange = async (query: string) => {
    setLoading(true);
    try {
      if (!query) {
        const allCars = await fetchCars();
        setInitialCars(allCars); // Обновляем исходный список
        filterCars(allCars);
        return;
      }

      const byBrand = await api.get<CarDto[]>(`/api/Car/brand/${query}`);
      if (byBrand.data.length > 0) {
        setInitialCars(byBrand.data); // Обновляем исходный список
        filterCars(byBrand.data);
      } else {
        const byModel = await api.get<CarDto[]>(`/api/Car/model/${query}`);
        if (byModel.data.length > 0) {
          setInitialCars(byModel.data); // Обновляем исходный список
          filterCars(byModel.data);
        } else {
          setCars([]);
          setNotFound(true);
        }
      }
    } catch (err) {
      console.error('Search failed:', err);
      setCars([]);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Реакция на изменение диапазонов с debounce
  useEffect(() => {
    if (initialCars.length > 0) {
      debouncedFilterCars(initialCars);
    }
    return () => {
      debouncedFilterCars.cancel(); // Очищаем debounce при размонтировании
    };
  }, [engineCapacityRange, enginePowerRange, priceRange, priceOrder]);

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
            {notFound ? (
              <div style={{ textAlign: 'center', fontStyle: 'italic', gridColumn: '1/-1' }}>
                No cars found matching your search.
              </div>
            ) : (
              cars.map((car) => <CarCard key={car.id} car={car} />)
            )}
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
        />
      </div>
    </div>
  );
};

export default MainPage;