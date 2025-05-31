import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getUserById } from '../services/api'; // Импортируем getUserById
import { CarDto } from '../types/CarDto';
import { CompanyDto } from '../types/CompanyDto';

const AdminPage: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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


  const [carForm, setCarForm] = useState<CarDto>({
    id: '',
    brand: '',
    model: '',
    engineCapacity: 0,
    enginePower: 0,
    engineType: 'Petrol',
    priceForOneDay: 0,
  });

  const [companyForm, setCompanyForm] = useState<CompanyDto>({
    name: '',
    address: '',
  });

  const [photoForm, setPhotoForm] = useState({
    carId: '',
    file: null as File | null,
    isPreview: false,
  });

  const handleCarFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await api.post('/api/Car', carData);
      alert('Автомобиль успешно создан!');
      setCarForm({
        id: '',
        brand: '',
        model: '',
        engineCapacity: 0,
        enginePower: 0,
        engineType: 'Petrol',
        priceForOneDay: 0,
      });
    } catch (error) {
      console.error('Ошибка при создании автомобиля:', error);
      alert('Не удалось создать автомобиль.');
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/Company', companyForm);
      alert('Компания успешно создана!');
      setCompanyForm({ name: '', address: '' });
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Админ-панель</h1>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Создать автомобиль</h2>
        <form onSubmit={handleCarSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Бренд:</label>
            <input type="text" name="brand" value={carForm.brand} onChange={handleCarFormChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Модель:</label>
            <input type="text" name="model" value={carForm.model} onChange={handleCarFormChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Объём двигателя (л):</label>
            <input type="number" name="engineCapacity" value={carForm.engineCapacity} onChange={handleCarFormChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Мощность двигателя (л.с.):</label>
            <input type="number" name="enginePower" value={carForm.enginePower} onChange={handleCarFormChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Тип двигателя:</label>
            <select name="engineType" value={carForm.engineType} onChange={handleCarFormChange} required>
              <option value="Petrol">Бензин</option>
              <option value="Diesel">Дизель</option>
              <option value="Electric">Электрический</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Цена за день ($):</label>
            <input type="number" name="priceForOneDay" value={carForm.priceForOneDay} onChange={handleCarFormChange} required />
          </div>
          <button type="submit">Создать автомобиль</button>
        </form>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Создать компанию</h2>
        <form onSubmit={handleCompanySubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Название:</label>
            <input type="text" name="name" value={companyForm.name} onChange={handleCompanyFormChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Адрес:</label>
            <input type="text" name="address" value={companyForm.address} onChange={handleCompanyFormChange} required />
          </div>
          <button type="submit">Создать компанию</button>
        </form>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Загрузить фото</h2>
        <form onSubmit={handlePhotoSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Выберите автомобиль:</label>
            <select name="carId" value={photoForm.carId} onChange={handlePhotoFormChange} required>
              <option value="">-- Выберите автомобиль --</option>
            </select>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Фото:</label>
            <input type="file" name="file" onChange={handlePhotoFormChange} required />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              <input type="checkbox" name="isPreview" checked={photoForm.isPreview} onChange={handlePhotoFormChange} />
              Установить как превью
            </label>
          </div>
          <button type="submit">Загрузить фото</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;