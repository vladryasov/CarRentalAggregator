import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CarDto } from '../types/CarDto';
import { fetchCarDetails } from '../services/api';
import CarDetails from '../components/CarDetails';

const CarDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCarDetails = async () => {
      if (!id) return;
      
      try {
        const carData = await fetchCarDetails(id);
        setCar(carData);
      } catch (error) {
        console.error('Error fetching car details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCarDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!car) {
    return <div>Car not found</div>;
  }

  return (
    <div style={{ 
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Back
      </button>

      <CarDetails car={car} />
    </div>
  );
};

export default CarDetailsPage; 