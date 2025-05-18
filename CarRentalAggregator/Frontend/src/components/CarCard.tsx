import React from 'react';

interface Car {
  id: string;
  brand: string;
  model: string;
  engineCapacity: number;
  enginePower: number;
  engineType: string;
  priceForOneDay: number;
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {/* Заменить на заглушку или реальную картинку позже */}
      <div style={{ width: '100%', height: '200px', backgroundColor: '#eee', borderRadius: '4px', marginBottom: '10px' }} />

      <h3>{car.brand} {car.model}</h3>
      <p style={{ color: '#666', margin: '5px 0' }}>
        {car.engineType}, {car.engineCapacity}L, {car.enginePower} HP
      </p>
      <p style={{ fontWeight: 'bold', margin: '10px 0' }}>
        ${car.priceForOneDay}/day
      </p>
    </div>
  );
};

export default CarCard;
