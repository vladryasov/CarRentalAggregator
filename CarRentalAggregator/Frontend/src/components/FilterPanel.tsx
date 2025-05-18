import React, { useState, useEffect } from 'react';

interface FilterPanelProps {
  priceOrder: 'asc' | 'desc' | null;
  onSearchChange: (query: string) => void;
  onPriceOrderChange: (order: 'asc' | 'desc' | null) => void;
  onEngineCapacityChange: (range: { min: number; max: number }) => void;
  onEnginePowerChange: (range: { min: number; max: number }) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  priceOrder,
  onSearchChange,
  onPriceOrderChange,
  onEngineCapacityChange,
  onEnginePowerChange,
  onPriceRangeChange,
}) => {
  const [search, setSearch] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [engineCapacity, setEngineCapacity] = useState<{ min: number; max: number }>({ min: 1.0, max: 10.0 });
  const [enginePower, setEnginePower] = useState<{ min: number; max: number }>({ min: 50, max: 1500 });
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 10, max: 2000 });

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => onSearchChange(search.trim()), 1000);
    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [search]);

  // Обновляем фильтры при каждом изменении диапазонов
  useEffect(() => {
    onEngineCapacityChange(engineCapacity);
  }, [engineCapacity]);

  useEffect(() => {
    onEnginePowerChange(enginePower);
  }, [enginePower]);

  useEffect(() => {
    onPriceRangeChange(priceRange);
  }, [priceRange]);

  const resetFilters = () => {
    setSearch('');
    setEngineCapacity({ min: 1.0, max: 10.0 });
    setEnginePower({ min: 50, max: 1500 });
    setPriceRange({ min: 10, max: 2000 });
    onPriceOrderChange(null);
    onSearchChange('');
    onEngineCapacityChange({ min: 1.0, max: 10.0 });
    onEnginePowerChange({ min: 50, max: 1500 });
    onPriceRangeChange({ min: 10, max: 2000 });
  };

  const handleEngineCapacityMinChange = (value: string) => {
    const newMin = parseFloat(value);
    setEngineCapacity((prev) => ({
      ...prev,
      min: Math.min(Math.max(newMin, 1.0), prev.max), // Ограничиваем min значением max
    }));
  };

  const handleEngineCapacityMaxChange = (value: string) => {
    const newMax = parseFloat(value);
    setEngineCapacity((prev) => ({
      ...prev,
      max: Math.max(Math.min(newMax, 10.0), prev.min), // Ограничиваем max значением min
    }));
  };

  const handleEnginePowerMinChange = (value: string) => {
    const newMin = parseInt(value);
    setEnginePower((prev) => ({
      ...prev,
      min: Math.min(Math.max(newMin, 50), prev.max), // Ограничиваем min значением max
    }));
  };

  const handleEnginePowerMaxChange = (value: string) => {
    const newMax = parseInt(value);
    setEnginePower((prev) => ({
      ...prev,
      max: Math.max(Math.min(newMax, 1500), prev.min), // Ограничиваем max значением min
    }));
  };

  const handlePriceRangeMinChange = (value: string) => {
    const newMin = parseInt(value);
    setPriceRange((prev) => ({
      ...prev,
      min: Math.min(Math.max(newMin, 10), prev.max), // Ограничиваем min значением max
    }));
  };

  const handlePriceRangeMaxChange = (value: string) => {
    const newMax = parseInt(value);
    setPriceRange((prev) => ({
      ...prev,
      max: Math.max(Math.min(newMax, 2000), prev.min), // Ограничиваем max значением min
    }));
  };

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#fff',
        padding: '20px',
        boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
        minWidth: '200px',
      }}
    >
      <h3 style={{ marginBottom: '20px' }}>🔍 Filters</h3>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by brand or model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
      />

      {/* Price Order */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Price Order</strong>
        <div>
          <label>
            <input
              type="radio"
              name="priceOrder"
              value="asc"
              checked={priceOrder === 'asc'}
              onChange={() => onPriceOrderChange('asc')}
            />
            Low to High
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="priceOrder"
              value="desc"
              checked={priceOrder === 'desc'}
              onChange={() => onPriceOrderChange('desc')}
            />
            High to Low
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="priceOrder"
              value="none"
              checked={priceOrder === null}
              onChange={() => onPriceOrderChange(null)}
            />
            None
          </label>
        </div>
      </div>

      {/* Engine Capacity Slider */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Engine Capacity (L)</strong>
        <input
          type="range"
          min="1.0"
          max="10.0"
          step="0.1"
          value={engineCapacity.min}
          onChange={(e) => handleEngineCapacityMinChange(e.target.value)}
          style={{ width: '100%', margin: '10px 0' }}
        />
        <input
          type="range"
          min="1.0"
          max="10.0"
          step="0.1"
          value={engineCapacity.max}
          onChange={(e) => handleEngineCapacityMaxChange(e.target.value)}
          style={{ width: '100%', margin: '10px 0' }}
        />
        <div>Min: {engineCapacity.min}L - Max: {engineCapacity.max}L</div>
      </div>

      {/* Engine Power Slider */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Engine Power (hp)</strong>
        <input
          type="range"
          min="50"
          max="1500"
          step="10"
          value={enginePower.min}
          onChange={(e) => handleEnginePowerMinChange(e.target.value)}
          style={{ width: '100%', margin: '10px 0' }}
        />
        <input
          type="range"
          min="50"
          max="1500"
          step="10"
          value={enginePower.max}
          onChange={(e) => handleEnginePowerMaxChange(e.target.value)}
          style={{ width: '100%', margin: '10px 0' }}
        />
        <div>Min: {enginePower.min}hp - Max: {enginePower.max}hp</div>
      </div>

      {/* Price Range Slider */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Price ($/day)</strong>
        <input
          type="range"
          min="10"
          max="2000"
          step="1"
          value={priceRange.min}
          onChange={(e) => handlePriceRangeMinChange(e.target.value)}
          style={{ width: '100%', margin: '10px 0' }}
        />
        <input
          type="range"
          min="10"
          max="2000"
          step="1"
          value={priceRange.max}
          onChange={(e) => handlePriceRangeMaxChange(e.target.value)}
          style={{ width: '100%', margin: '10px 0' }}
        />
        <div>Min: ${priceRange.min} - Max: ${priceRange.max}</div>
      </div>

      <button
        onClick={resetFilters}
        style={{
          padding: '6px 12px',
          backgroundColor: '#eee',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterPanel;