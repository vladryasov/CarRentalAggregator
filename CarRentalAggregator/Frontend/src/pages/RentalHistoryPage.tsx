import React from 'react';
import RentalHistory from '../components/RentalHistory';

const RentalHistoryPage: React.FC = () => {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    }}>
      <RentalHistory />
    </div>
  );
};

export default RentalHistoryPage; 