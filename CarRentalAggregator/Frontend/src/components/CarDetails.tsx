import React, { useState, useEffect } from 'react';
import { CarDto } from '../types/CarDto';
import { CompanyDto } from '../types/CompanyDto';
import { fetchCarCompanies } from '../services/api';

interface CarDetailsProps {
  car: CarDto;
}

const CarDetails: React.FC<CarDetailsProps> = ({ car }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCarCompanies(car.id);
        setCompanies(data);
      } catch (error) {
        console.error('Error loading companies:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };

    loadCompanies();
  }, [car.id]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '30px',
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      {/* Фото галерея */}
      <div>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '400px',
          backgroundColor: '#eee',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {car.photos.length > 0 ? (
            <img
              src={car.photos[currentPhotoIndex].url}
              alt={`${car.brand} ${car.model}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#666'
            }}>
              No photos available
            </div>
          )}
        </div>

        {/* Миниатюры фотографий */}
        {car.photos.length > 1 && (
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '20px',
            overflowX: 'auto',
            padding: '10px 0'
          }}>
            {car.photos.map((photo, index) => (
              <img
                key={photo.id}
                src={photo.url}
                alt={`${car.brand} ${car.model} thumbnail ${index + 1}`}
                style={{
                  width: '80px',
                  height: '60px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  border: currentPhotoIndex === index ? '2px solid #3498db' : '2px solid transparent'
                }}
                onClick={() => setCurrentPhotoIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Информация об автомобиле */}
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
          {car.brand} {car.model}
        </h1>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#2c3e50' }}>
            Specifications
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'auto 1fr',
            gap: '10px 20px',
            fontSize: '1.1rem'
          }}>
            <span style={{ color: '#666' }}>Engine Type:</span>
            <span>{car.engineType}</span>
            
            <span style={{ color: '#666' }}>Engine Capacity:</span>
            <span>{car.engineCapacity}L</span>
            
            <span style={{ color: '#666' }}>Engine Power:</span>
            <span>{car.enginePower} HP</span>
            
            <span style={{ color: '#666' }}>Price per Day:</span>
            <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>${car.priceForOneDay}</span>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#2c3e50' }}>
            Description
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444' }}>
            {car.description}
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#2c3e50' }}>
            Available from Companies
          </h2>
          {loadingCompanies ? (
            <p>Loading companies...</p>
          ) : companies.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gap: '15px' 
            }}>
              {companies.map(company => (
                <div 
                  key={company.id}
                  style={{
                    padding: '15px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                  }}
                >
                  <h3 style={{ 
                    fontSize: '1.2rem', 
                    marginBottom: '8px',
                    color: '#2c3e50'
                  }}>
                    {company.name}
                  </h3>
                  <div style={{ fontSize: '1rem', color: '#666' }}>
                    <div>📞 {company.phoneNumber}</div>
                    <div>✉️ {company.email}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No companies available for this car at the moment.</p>
          )}
        </div>

        <button
          style={{
            padding: '15px 30px',
            backgroundColor: '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            width: '100%'
          }}
          onClick={() => {/* TODO: Добавить функционал бронирования */}}
        >
          Rent Now
        </button>
      </div>
    </div>
  );
};

export default CarDetails; 