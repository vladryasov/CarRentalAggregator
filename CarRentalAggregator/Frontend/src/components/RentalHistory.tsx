import React, { useEffect, useState } from 'react';
import { RentalDto, RentalStatus } from '../types/RentalTypes';
import { getUserRentals, cancelRental } from '../services/api';

const RentalHistory: React.FC = () => {
  const [rentals, setRentals] = useState<RentalDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRentals();
  }, []);

  const loadRentals = async () => {
    try {
      const data = await getUserRentals();
      setRentals(data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить историю аренды');
      console.error('Error loading rentals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (rentalId: string) => {
    try {
      await cancelRental(rentalId);
      await loadRentals();
    } catch (err) {
      setError('Не удалось отменить аренду');
      console.error('Error cancelling rental:', err);
    }
  };

  const getStatusColor = (status: RentalStatus): string => {
    switch (status) {
      case RentalStatus.Active:
        return '#2ecc71';
      case RentalStatus.Completed:
        return '#3498db';
      case RentalStatus.Cancelled:
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: '#e74c3c' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>История аренды</h2>
      
      {rentals.length === 0 ? (
        <p style={{ color: '#7f8c8d' }}>История аренды пуста.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {rentals.map(rental => (
            <div
              key={rental.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: '20px',
                alignItems: 'center'
              }}
            >
              {/* Фото автомобиля */}
              <div
                style={{
                  width: '120px',
                  height: '80px',
                  backgroundColor: '#f5f6fa',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                {rental.car?.photos?.find(p => p.isPreview)?.url ? (
                  <img
                    src={rental.car.photos.find(p => p.isPreview)?.url}
                    alt={`${rental.car.brand} ${rental.car.model}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#95a5a6'
                    }}
                  >
                    Нет фото
                  </div>
                )}
              </div>

              {/* Информация об аренде */}
              <div>
                <h3 style={{ marginBottom: '8px', color: '#2c3e50' }}>
                  {rental.car?.brand} {rental.car?.model}
                </h3>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '10px',
                  color: '#7f8c8d',
                  fontSize: '0.9rem'
                }}>
                  <div>📅 {new Date(rental.startRent).toLocaleDateString()} - {new Date(rental.endRent).toLocaleDateString()}</div>
                  <div>💰 ${rental.totalPrice}</div>
                  <div style={{
                    color: getStatusColor(rental.status),
                    fontWeight: 'bold'
                  }}>
                    ⚡ {rental.status}
                  </div>
                </div>
              </div>

              {/* Действия */}
              {rental.status === RentalStatus.Active && (
                <button
                  onClick={() => handleCancel(rental.id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Отменить
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalHistory; 