import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CarDto } from '../types/CarDto';

interface CarListCardProps {
  car: CarDto;
}

const CarListCard: React.FC<CarListCardProps> = ({ car }) => {
  const navigate = useNavigate();
  const previewPhoto = car.photos?.find(photo => photo.isPreview);
  const firstPhoto = car.photos?.[0];
  const photoUrl = previewPhoto?.url || firstPhoto?.url;

  return (
    <div 
      style={{ 
        backgroundColor: 'white', 
        padding: '15px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}
      onClick={() => navigate(`/car/${car.id}`)}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      {photoUrl ? (
        <img 
          src={photoUrl} 
          alt={`${car.brand} ${car.model}`}
          style={{ 
            width: '100%', 
            height: '200px', 
            objectFit: 'cover', 
            borderRadius: '4px', 
            marginBottom: '10px' 
          }}
        />
      ) : (
        <div style={{ 
          width: '100%', 
          height: '200px', 
          backgroundColor: '#eee', 
          borderRadius: '4px', 
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999'
        }}>
          No photo available
        </div>
      )}

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

export default CarListCard; 