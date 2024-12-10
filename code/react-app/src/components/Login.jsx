import React, {useState} from 'react';
import {TextField, Button, Box, Typography, Container} from '@mui/material';
import {useDispatch} from "react-redux"; // Импортируем контекст авторизации
import {login} from '../redux/authSlice';
import {useApi} from "../contexts/apiContext";
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";
import {persistor} from "../redux/persistStore";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const apiUrl = useApi();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Включаем индикатор загрузки

    try {
      // Запрос на API для входа
      const response = await axios.post(`${apiUrl}/login`, {email, password});
      const token = response.data.token; // Получаем токен из ответа
      dispatch(login({token, user: response.data.user}));
      // persistor.persist();

      setEmail('');
      setPassword('');
      setError(''); // Очистить ошибки после успешного входа
      navigate('/');
    } catch (err) {
      setError('Неверный логин или пароль');
    } finally {
      setIsLoading(false); // Выключаем индикатор загрузки
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Войти
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Пароль"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{mt: 3, mb: 2}}
            disabled={isLoading} // Делаем кнопку неактивной, если идет запрос
          >
            {isLoading ? 'Загрузка...' : 'Войти'} {/* Отображаем текст загрузки */}
          </Button>
        </Box>
        <Button
          component={Link}
          to="/register"
          variant="text"
          color="secondary"
          sx={{mt: 2}}
        >
          Зарегистрироваться
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
