import React from 'react';

interface Car {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <img src={car.image} alt={car.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} />
      <h3 style={{ margin: '10px 0' }}>{car.name}</h3>
      <p style={{ color: '#666', margin: '5px 0' }}>{car.description}</p>
      <p style={{ fontWeight: 'bold', margin: '10px 0' }}>${car.price}/day</p>
    </div>
  );
};

export default CarCard;
export {};