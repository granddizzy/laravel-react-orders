import React, {useEffect, useState} from 'react';
import {
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {useApi} from '../contexts/apiContext';
import {useNavigate, useParams} from 'react-router-dom';

function ContractorEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {contractorId} = useParams(); // Получаем id из URL
  const apiUrl = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    unp: '',
    email: '',
    address: '',
    phone: '',
    contact_person: '',
    notes: '',
  });
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);

  // Функция для загрузки данных
  useEffect(() => {
    const fetchContractor = async () => {
      setIsLoading(true);
      try {
        const headers = token ? {Authorization: `Bearer ${token}`} : {};
        const response = await fetch(`${apiUrl}/contractors/${contractorId}`, {
          method: 'GET',  // Указываем метод запроса, по умолчанию 'GET'
          headers, // Заголовки, включая токен, если он есть
        });
        if (!response.ok) {
          throw new Error('Контрагент не найден');
        }
        const data = await response.json();
        setFormData(data); // Заполняем форму данными
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractor();
  }, [apiUrl, contractorId]);

  // Обработчик изменения полей формы
  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Отправка формы для обновления
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // Базовые заголовки
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Добавление токена, если он есть
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${apiUrl}/contractors/${contractorId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении контрагента');
      }

      navigate(`/contractors/${contractorId}`); // Перенаправление на каталог после успешного обновления
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // if (error) {
  //   return <Typography color="error">{`${error}`}</Typography>;
  // }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Редактировать контрагента
      </Typography>

      {/* Поля формы */}
      <TextField
        label="Наименование"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="УНП"
        name="unp"
        value={formData.unp}
        onChange={handleChange}
        required
        fullWidth
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Адрес"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Телефон"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Контактное лицо"
        name="contact_person"
        value={formData.contact_person}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Примечание"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        fullWidth
      />

      {/* Ошибка */}
      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}

      {/* Кнопки */}
      <Box sx={{display: 'flex', gap: 2}}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Обновление...' : 'Обновить продукт'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate(-1)} // Возвращаемся на предыдущую страницу
        >
          Отмена
        </Button>
      </Box>
    </Box>
  );
}

export default ContractorEdit;
