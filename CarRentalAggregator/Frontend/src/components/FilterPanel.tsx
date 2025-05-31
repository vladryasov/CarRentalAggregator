import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface FilterPanelProps {
  priceOrder: 'asc' | 'desc' | null;
  onSearchChange: (query: string) => void;
  onPriceOrderChange: (order: 'asc' | 'desc' | null) => void;
  onEngineCapacityChange: (range: { min: number; max: number }) => void;
  onEnginePowerChange: (range: { min: number; max: number }) => void;
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onApplyFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  priceOrder,
  onSearchChange,
  onPriceOrderChange,
  onEngineCapacityChange,
  onEnginePowerChange,
  onPriceRangeChange,
  onApplyFilters,
}) => {
  const [search, setSearch] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [engineCapacity, setEngineCapacity] = useState<{ min: number; max: number }>({ min: 1.0, max: 10.0 });
  const [enginePower, setEnginePower] = useState<{ min: number; max: number }>({ min: 50, max: 1500 });
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 10, max: 2000 });

  const prevPriceOrder = useState(priceOrder)[0];

  useEffect(() => {
  if (debounceTimer) clearTimeout(debounceTimer);
  
  const timer = setTimeout(() => {
    onSearchChange(search.trim()); // даже если пусто
  }, 300); // можно 300-500ms, не обязательно 1000
  setDebounceTimer(timer);

  return () => clearTimeout(timer);
}, [search]);

  const debouncedApplyFilters = useCallback(
    debounce(() => {
      onApplyFilters();
    }, 300),
    [onApplyFilters]
  );

  const hasPriceOrderChanged = () => {
    return priceOrder !== prevPriceOrder;
  };

  useEffect(() => {
    if (hasPriceOrderChanged()) {
      debouncedApplyFilters();
    }
  }, [priceOrder]);

  const handleEngineCapacityMinChange = (value: string) => {
    const newMin = parseFloat(value);
    const newRange = { ...engineCapacity, min: Math.min(Math.max(newMin, 1.0), engineCapacity.max) };
    setEngineCapacity(newRange);
    onEngineCapacityChange(newRange);
    console.log('Engine Capacity Min changed to:', newMin);
  };

  const handleEngineCapacityMaxChange = (value: string) => {
    const newMax = parseFloat(value);
    const newRange = { ...engineCapacity, max: Math.max(Math.min(newMax, 10.0), engineCapacity.min) };
    setEngineCapacity(newRange);
    onEngineCapacityChange(newRange);
    console.log('Engine Capacity Max changed to:', newMax);
  };

  const handleEngineCapacityCommit = () => {
    console.log('Engine Capacity committed:', engineCapacity);
    debouncedApplyFilters();
  };

  const handleEnginePowerMinChange = (value: string) => {
    const newMin = parseInt(value);
    const newRange = { ...enginePower, min: Math.min(Math.max(newMin, 50), enginePower.max) };
    setEnginePower(newRange);
    onEnginePowerChange(newRange);
    console.log('Engine Power Min changed to:', newMin);
  };

  const handleEnginePowerMaxChange = (value: string) => {
    const newMax = parseInt(value);
    const newRange = { ...enginePower, max: Math.max(Math.min(newMax, 1500), enginePower.min) };
    setEnginePower(newRange);
    onEnginePowerChange(newRange);
    console.log('Engine Power Max changed to:', newMax);
  };

  const handleEnginePowerCommit = () => {
    console.log('Engine Power committed:', enginePower);
    debouncedApplyFilters();
  };

  const handlePriceRangeMinChange = (value: string) => {
    const newMin = parseInt(value);
    const newRange = { ...priceRange, min: Math.min(Math.max(newMin, 10), priceRange.max) };
    setPriceRange(newRange);
    onPriceRangeChange(newRange);
    console.log('Price Range Min changed to:', newMin);
  };

  const handlePriceRangeMaxChange = (value: string) => {
    const newMax = parseInt(value);
    const newRange = { ...priceRange, max: Math.max(Math.min(newMax, 2000), priceRange.min) };
    setPriceRange(newRange);
    onPriceRangeChange(newRange);
    console.log('Price Range Max changed to:', newMax);
  };

  const handlePriceRangeCommit = () => {
    console.log('Price Range committed:', priceRange);
    debouncedApplyFilters();
  };

  const resetFilters = () => {
  console.log('Resetting filters...');

  setSearch(''); // асинхронно

  setEngineCapacity({ min: 1.0, max: 10.0 });
  setEnginePower({ min: 50, max: 1500 });
  setPriceRange({ min: 10, max: 2000 });

  onPriceOrderChange(null);
  onEngineCapacityChange({ min: 1.0, max: 10.0 });
  onEnginePowerChange({ min: 50, max: 1500 });
  onPriceRangeChange({ min: 10, max: 2000 });

  // важно: отложено, чтобы дождаться обновления состояния
  setTimeout(() => {
    onSearchChange('');
  }, 100);
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

      <input
        type="text"
        placeholder="Search by brand or model..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '4px' }}
      />

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

      <div style={{ marginBottom: '20px' }}>
        <strong>Engine Capacity (L)</strong>
        <input
          type="range"
          min="1.0"
          max="10.0"
          step="0.1"
          value={engineCapacity.min}
          onChange={(e) => handleEngineCapacityMinChange(e.target.value)}
          onMouseUp={handleEngineCapacityCommit}
          onTouchEnd={handleEngineCapacityCommit}
          style={{ width: '100%', margin: '10px 0' }}
        />
        <input
          type="range"
          min="1.0"
          max="10.0"
          step="0.1"
          value={engineCapacity.max}
          onChange={(e) => handleEngineCapacityMaxChange(e.target.value)}
          onMouseUp={handleEngineCapacityCommit}
          onTouchEnd={handleEngineCapacityCommit}
          style={{ width: '100%', margin: '10px 0' }}
        />
        <div>Min: {engineCapacity.min}L - Max: {engineCapacity.max}L</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Engine Power (hp)</strong>
        <input
          type="range"
          min="50"
          max="1500"
          step="10"
          value={enginePower.min}
          onChange={(e) => handleEnginePowerMinChange(e.target.value)}
          onMouseUp={handleEnginePowerCommit}
          onTouchEnd={handleEnginePowerCommit}
          style={{ width: '100%', margin: '10px 0' }}
        />
        <input
          type="range"
          min="50"
          max="1500"
          step="10"
          value={enginePower.max}
          onChange={(e) => handleEnginePowerMaxChange(e.target.value)}
          onMouseUp={handleEnginePowerCommit}
          onTouchEnd={handleEnginePowerCommit}
          style={{ width: '100%', margin: '10px 0' }}
        />
        <div>Min: {enginePower.min}hp - Max: {enginePower.max}hp</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <strong>Price ($/day)</strong>
        <input
          type="range"
          min="10"
          max="2000"
          step="1"
          value={priceRange.min}
          onChange={(e) => handlePriceRangeMinChange(e.target.value)}
          onMouseUp={handlePriceRangeCommit}
          onTouchEnd={handlePriceRangeCommit}
          style={{ width: '100%', margin: '10px 0' }}
        />
        <input
          type="range"
          min="10"
          max="2000"
          step="1"
          value={priceRange.max}
          onChange={(e) => handlePriceRangeMaxChange(e.target.value)}
          onMouseUp={handlePriceRangeCommit}
          onTouchEnd={handlePriceRangeCommit}
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