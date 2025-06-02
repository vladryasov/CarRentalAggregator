import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getUserById } from '../services/api'; // Импортируем getUserById
import { CarDto } from '../types/CarDto';
import { CompanyDto } from '../types/CompanyDto';

interface AdminPageProps {
  setIsAuthChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminPage: React.FC<AdminPageProps> = ({ setIsAuthChecked }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarDto[]>([]);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        console.log('localStorage.getItem(currentUser):', localStorage.getItem('currentUser'));
        // Получаем userId из localStorage
        const rememberedUser = localStorage.getItem('currentUser');
        if (!rememberedUser) {
          throw new Error('Пользователь не авторизован');
        }
        const { userId } = JSON.parse(rememberedUser);
        if (!userId) {
          throw new Error('ID пользователя не найден');
        }

        // Делаем запрос для получения информации о пользователе
        const user = await getUserById(userId);
        if (user.role === 0) {
          setIsAdmin(true);
          navigate('/admin')
        } else {
          setError('У вас нет прав для доступа к этой странице.');
          navigate('/main');
        }
      } catch (err) {
        console.error('Ошибка при проверке прав доступа:', err);
        setError('Ошибка при проверке прав доступа.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    checkAdminRole();
  }, [navigate]);

  const [companies, setCompanies] = useState<CompanyDto[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get('/api/Company');
        setCompanies(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке компаний:', error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/api/Car');
        setCars(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке автомобилей:', error);
      }
    };
    fetchCars();
  }, []);

  const [carForm, setCarForm] = useState<CarDto>({
    id: '',
    brand: '',
    model: '',
    description: '',
    engineCapacity: 0,
    enginePower: 0,
    engineType: 'Inline four',
    priceForOneDay: 0,
    companyId: '',
    photos: []
  });

  const [companyForm, setCompanyForm] = useState<CompanyDto>({
    name: '',
    phoneNumber: '',
    email: ''
  });

  const [photoForm, setPhotoForm] = useState({
    carId: '',
    file: null as File | null,
    isPreview: false,
  });

  const handleCarFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCarForm((prev) => ({
      ...prev,
      [name]: name === 'engineCapacity' || name === 'enginePower' || name === 'priceForOneDay' ? Number(value) : value,
    }));
  };

  const handleCompanyFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setPhotoForm((prev) => ({ ...prev, file: files ? files[0] : null }));
    } else if (type === 'checkbox') {
      setPhotoForm((prev) => ({ ...prev, isPreview: (e.target as HTMLInputElement).checked }));
    } else {
      setPhotoForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, ...carData } = carForm;
      console.log('Отправляемые данные:', carData);
      const response = await api.post('/api/Car', carData);
      console.log('Ответ сервера:', response.data);
      alert('Автомобиль успешно создан!');
      setCarForm({
        id: '',
        brand: '',
        model: '',
        description: '',
        engineCapacity: 0,
        enginePower: 0,
        engineType: 'Inline four',
        priceForOneDay: 0,
        companyId: '',
        photos: []
      });
      // Обновляем список автомобилей после создания
      const carsResponse = await api.get('/api/Car');
      setCars(carsResponse.data);
    } catch (error: any) {
      console.error('Ошибка при создании автомобиля:', error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        let errorMessage = 'Ошибки валидации:\n';
        for (const [field, messages] of Object.entries(errors)) {
          if (Array.isArray(messages)) {
            errorMessage += `${field}: ${messages.join(', ')}\n`;
          }
        }
        alert(errorMessage);
      } else {
        alert('Не удалось создать автомобиль.');
      }
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/Company', companyForm);
      alert('Компания успешно создана!');
      setCompanyForm({ name: '', phoneNumber: '', email: '' });
      // Обновляем список компаний после создания
      const response = await api.get('/api/Company');
      setCompanies(response.data);
    } catch (error) {
      console.error('Ошибка при создании компании:', error);
      alert('Не удалось создать компанию.');
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.carId || !photoForm.file) {
      alert('Пожалуйста, выберите автомобиль и файл.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', photoForm.file);
      await api.post(`/api/CarPhoto/${photoForm.carId}/upload?isPreview=${photoForm.isPreview}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Фотография успешно загружена!');
      setPhotoForm({ carId: '', file: null, isPreview: false });
    } catch (error) {
      console.error('Ошибка при загрузке фотографии:', error);
      alert('Не удалось загрузить фотографию.');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!isAdmin) return null;

  return (
    <div style={{ 
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem',
        marginBottom: '30px',
        color: '#2c3e50',
        borderBottom: '3px solid #3498db',
        paddingBottom: '10px'
      }}>Админ-панель</h1>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        {/* Форма создания автомобиля */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem',
            marginBottom: '20px',
            color: '#2c3e50'
          }}>Создать автомобиль</h2>
          <form onSubmit={handleCarSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Бренд:</label>
              <input
                type="text"
                name="brand"
                value={carForm.brand}
                onChange={handleCarFormChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Модель:</label>
              <input
                type="text"
                name="model"
                value={carForm.model}
                onChange={handleCarFormChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Описание:</label>
              <textarea
                name="description"
                value={carForm.description}
                onChange={handleCarFormChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7',
                  minHeight: '100px'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Компания:</label>
              <select
                name="companyId"
                value={carForm.companyId}
                onChange={handleCarFormChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              >
                <option value="">Выберите компанию</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Объём двигателя (л):</label>
              <input
                type="number"
                name="engineCapacity"
                value={carForm.engineCapacity}
                onChange={handleCarFormChange}
                required
                step="0.1"
                min="0"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Мощность двигателя (л.с.):</label>
              <input
                type="number"
                name="enginePower"
                value={carForm.enginePower}
                onChange={handleCarFormChange}
                required
                min="0"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Тип двигателя:</label>
              <select
                name="engineType"
                value={carForm.engineType}
                onChange={handleCarFormChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              >
                <option value="Inline four">Рядная четверка</option>
                <option value="Inline six">Рядная шестерка</option>
                <option value="V6">V6</option>
                <option value="V8">V8</option>
                <option value="V10">V10</option>
                <option value="V12">V12</option>
                <option value="W16">W16</option>
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Цена за день ($):</label>
              <input
                type="number"
                name="priceForOneDay"
                value={carForm.priceForOneDay}
                onChange={handleCarFormChange}
                required
                min="0"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#2980b9'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#3498db'}
            >
              Создать автомобиль
            </button>
          </form>
        </div>

        {/* Форма создания компании */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem',
            marginBottom: '20px',
            color: '#2c3e50'
          }}>Создать компанию</h2>
          <form onSubmit={handleCompanySubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Название:</label>
              <input
                type="text"
                name="name"
                value={companyForm.name}
                onChange={handleCompanyFormChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Телефон:</label>
              <input
                type="tel"
                name="phoneNumber"
                value={companyForm.phoneNumber}
                onChange={handleCompanyFormChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Email:</label>
              <input
                type="email"
                name="email"
                value={companyForm.email}
                onChange={handleCompanyFormChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#27ae60'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#2ecc71'}
            >
              Создать компанию
            </button>
          </form>
        </div>

        {/* Форма загрузки фото */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem',
            marginBottom: '20px',
            color: '#2c3e50'
          }}>Загрузить фото</h2>
          <form onSubmit={handlePhotoSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Выберите автомобиль:</label>
              <select
                name="carId"
                value={photoForm.carId}
                onChange={handlePhotoFormChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              >
                <option value="">-- Выберите автомобиль --</option>
                {cars.map(car => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Фото:</label>
              <input
                type="file"
                name="file"
                onChange={handlePhotoFormChange}
                required
                accept="image/*"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '5px',
                  border: '1px solid #bdc3c7'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                color: '#34495e',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  name="isPreview"
                  checked={photoForm.isPreview}
                  onChange={handlePhotoFormChange}
                  style={{ marginRight: '8px' }}
                />
                Установить как превью
              </label>
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#9b59b6',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = '#8e44ad'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = '#9b59b6'}
            >
              Загрузить фото
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;