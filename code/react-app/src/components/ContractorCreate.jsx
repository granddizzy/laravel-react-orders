import React, {useState} from 'react';
import {
  Typography,
  Box,
  Button,
TextField
} from '@mui/material';
import {useSelector} from "react-redux";
import {useApi} from "../contexts/apiContext";
import {useNavigate} from "react-router-dom";

function ContractorCreate() {
  const navigate = useNavigate();
  const apiUrl = useApi();
  const [isLoading, setIsLoading] = useState(false);
  // Локальное состояние для формы
  const [formData, setFormData] = useState({
    'name': '',
    'unp': '',
    'contact_person': '',
    'email': '',
    'phone': '',
    'address': '',
  });

  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);

  // Обновление полей формы
  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Отправка формы
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Включаем индикатор загрузки
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

      const response = await fetch(`${apiUrl}/contractors`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // После успешного создания обновляем список продуктов
      navigate('/clients');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Выключаем индикатор загрузки
    }
  };

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
        Создать контрагента
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
        label="Контактное лицо"
        name="contact_person"
        value={formData.contact_person}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        fullWidth
      />
      <TextField
        label="Телефон"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        type="tel"
        fullWidth
      />
      <TextField
        label="Адрес"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
      />

      {/* Ошибка */}
      {error && (
        <Typography color="error">
          {error}
        </Typography>
      )}

      {/* Кнопка отправки */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', width: '100%' }}>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          onClick={() => navigate(-1)}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Создание...' : 'Создать'}
        </Button>
      </Box>
    </Box>
  );
}

export default ContractorCreate;
