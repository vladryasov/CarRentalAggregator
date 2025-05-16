import React, { useState } from 'react';

const FilterPanel: React.FC = () => {
  const [priceOrder, setPriceOrder] = useState<'asc' | 'desc' | null>(null);
  const [transmission, setTransmission] = useState<'automatic' | 'manual' | null>(null);
  const [search, setSearch] = useState('');

  return (
    <div style={{
      flex: 1,
      backgroundColor: '#fff',
      padding: '20px',
      boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
      minWidth: '200px'
    }}>
      <h3 style={{ marginBottom: '20px' }}>🔍 Filters</h3>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />

      {/* Price Order */}
      <div style={{ marginBottom: '20px' }}>
        <strong>Price</strong>
        <div>
          <label>
            <input
              type="radio"
              name="priceOrder"
              checked={priceOrder === 'asc'}
              onChange={() => setPriceOrder('asc')}
            /> Low to High
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="priceOrder"
              checked={priceOrder === 'desc'}
              onChange={() => setPriceOrder('desc')}
            /> High to Low
          </label>
        </div>
      </div>

      {/* Transmission */}
      <div>
        <strong>Transmission</strong>
        <div>
          <label>
            <input
              type="radio"
              name="transmission"
              checked={transmission === 'automatic'}
              onChange={() => setTransmission('automatic')}
            /> Automatic
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              name="transmission"
              checked={transmission === 'manual'}
              onChange={() => setTransmission('manual')}
            /> Manual
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
