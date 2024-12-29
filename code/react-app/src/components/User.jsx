import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import apiClient from '../api/axiosInstance'
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {useApi} from '../contexts/apiContext';
import {useNavigate, useParams} from "react-router-dom";
import UserContractorManager from "./UserContractorManager";
import UserRoleManager from "./UserRoleManager";

const User = () => {
  const {userId} = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  // Используем контекст для базового URL API
  const baseUrl = useApi();

  // Начальные значения формы - из данных Redux
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '', // Новое поле для пароля
    password_confirmation: '', // Новое поле для подтверждения пароля
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Сообщение об успешном обновлении
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`${baseUrl}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setFormData({
          name: response.data.name || '',
          password: '',
          password_confirmation: '',
        });
      } catch (err) {
        setError('Ошибка при получении данных пользователя');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [baseUrl, userId, token]);

  // Обработчик изменения полей формы
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  // Обработчик отправки формы для обновления профиля
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true); // Начинаем обновление

    if (formData.password && formData.password !== formData.password_confirmation) {
      setError('Пароли не совпадают');
      setIsUpdating(false);
      return;
    }

    const dataToSubmit = {
      name: formData.name,
      password: formData.password || undefined,
      password_confirmation: formData.password_confirmation || undefined,
    };

    try {
      const response = await apiClient.put(
        `${baseUrl}/profile`, // Ваш API-URL
        dataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Отправляем токен для авторизации
          },
        }
      );
      // После успешного обновления профиля
      setUser(response.data); // Обновляем данные пользователя в Redux
      setSuccessMessage('Профиль успешно обновлен'); // Устанавливаем сообщение об успехе
      setError(null); // Очищаем ошибку
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при обновлении профиля');
    } finally {
      setIsUpdating(false); // Завершаем процесс обновления
    }
  };

  if (isLoading) {
    return <CircularProgress/>;
  }

  if (error) {
    return <Typography color="error">{`${error}`}</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{mt: 5}}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Пользователь
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mb: 10,
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
          disabled={isUpdating} // Отключаем поле при обновлении
        />
        <TextField
          label="Новый пароль"
          name="password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          variant="outlined"
          fullWidth
          disabled={isUpdating}
        />
        <TextField
          label="Подтвердите новый пароль"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          type="password"
          variant="outlined"
          fullWidth
          disabled={isUpdating}
        />

        <Box sx={{display: 'flex', gap: 2, justifyContent: 'space-between'}}>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={() => navigate(-1)}
          >
            Назад
          </Button>
          <Box sx={{flexGrow: 1}}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isUpdating} // Отключаем кнопку при загрузке
              fullWidth
            >
              {isUpdating ? <CircularProgress size={24} color="inherit"/> : 'Изменить'}
            </Button>
          </Box>
        </Box>
      </Box>

      <UserRoleManager user={user} setUser={setUser}/>
      <UserContractorManager user={user} setUser={setUser}/>
    </Container>
  );
};

export default User;
