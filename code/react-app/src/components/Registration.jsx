import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {login} from '../redux/authSlice'; // Импортируем экшен login
import axios from 'axios';
import apiClient from '../api/axiosInstance'
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import {useApi} from "../contexts/apiContext";
import {useNavigate} from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Добавляем состояние загрузки

  const baseUrl = useApi();

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Устанавливаем состояние загрузки

    try {
      // Регистрация пользователя
      const response = await apiClient.post(`${baseUrl}/register`, formData);

      // Логин после успешной регистрации
      const loginResponse = await apiClient.post(`${baseUrl}/login`, {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = loginResponse.data;

      if (!token || !user) {
        throw new Error('Некорректный ответ от сервера при авторизации');
      }

      dispatch(login({ token, user }));
      setError(null);
      navigate('/');
    } catch (err) {
      console.error('Ошибка при регистрации или авторизации:', err);

      if (err.response) {
        const errorData = err.response.data?.error;

        // Проверяем, есть ли вложенные сообщения об ошибке
        if (errorData && typeof errorData === 'object') {
          const errorMessages = Object.values(errorData)
            .flat() // Преобразуем вложенные массивы в один массив
            .join(', '); // Соединяем все сообщения в строку
          setError(errorMessages);
        } else {
          setError(err.response.data?.message || 'Произошла ошибка на сервере');
        }
      } else if (err.request) {
        setError('Ошибка соединения с сервером. Проверьте подключение к интернету.');
      } else {
        setError(err.message || 'Произошла неизвестная ошибка');
      }
    } finally {
      setIsLoading(false); // Завершаем состояние загрузки
    }
  };



  return (
    <Container maxWidth="xs" sx={{mt: 5}}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Регистрация
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          label="Имя"
          name="name"
          value={formData.name}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
          disabled={isLoading} // Отключаем поле при загрузке
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          variant="outlined"
          fullWidth
          required
          disabled={isLoading} // Отключаем поле при загрузке
        />
        <TextField
          label="Пароль"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          variant="outlined"
          fullWidth
          required
          disabled={isLoading} // Отключаем поле при загрузке
        />
        <TextField
          label="Подтверждение пароля"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          type="password"
          variant="outlined"
          fullWidth
          required
          disabled={isLoading} // Отключаем поле при загрузке
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading} // Отключаем кнопку при загрузке
        >
          {isLoading ? <CircularProgress size={24} color="inherit"/> : 'Зарегистрироваться'}
        </Button>
      </Box>
    </Container>
  );
};

export default Register;
