import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {login} from '../redux/authSlice'; // Импортируем экшен login
import axios from 'axios';
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
      const response = await axios.post(`${baseUrl}/register`, formData);

      const loginResponse = await axios.post(`${baseUrl}/login`, {
        email: formData.email,
        password: formData.password,
      });

      const token = loginResponse.data.token;

      // Сохранение токена
      dispatch(login({token, user: null})); // user можно заполнить, если API возвращает данные пользователя

      setError(null);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при регистрации');
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
