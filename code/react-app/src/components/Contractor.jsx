import React, {useEffect, useState} from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia, CircularProgress,
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {useApi} from '../contexts/apiContext';
import {useDispatch, useSelector} from "react-redux";
import defaultImage from '../img/default-contractor-image.png';
import {deleteContractor} from "../redux/contractorsSlice";

function ContractorView() {
  const {contractorId} = useParams(); // Получаем id продукта из URL
  const navigate = useNavigate();
  const apiUrl = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [contractor, setContractor] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

  const user = useSelector((state) => state.auth.user);

  // Функция для загрузки данных о продукте
  useEffect(() => {
    const fetchContractor = async () => {
      setIsLoading(true);
      try {
        const headers = token ? {Authorization: `Bearer ${token}`} : {};
        const response = await fetch(`${apiUrl}/contractors/${contractorId}`, {
          method: 'GET', // Указываем метод запроса, по умолчанию 'GET'
          headers, // Заголовки, включая токен, если он есть
        });
        if (!response.ok) {
          throw new Error('Контрагент не найден');
        }
        const data = await response.json();
        setContractor(data); // Заполняем данные продукта
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContractor();
  }, [apiUrl, contractorId]);

  // Функция для перехода к странице редактирования продукта
  const handleEdit = () => {
    navigate(`/contractors/${contractorId}/edit`);
  };

  const handleDelete = () => {
    dispatch(deleteContractor({
      apiUrl,
      token,
      contractorId
    }))
      .unwrap() // Разворачиваем результат для обработки успеха или ошибки
      .then(() => {
        navigate(-1); // Возвращаемся на предыдущую страницу при успешном удалении
      })
      .catch((error) => {
        console.error('Ошибка при удалении контрагента:', error);
      });
  }

  const hasRole = (role) => user?.roles?.some(r => r.name === role);

  if (isLoading) {
    return <CircularProgress/>;
  }

  if (error) {
    return <Typography color="error">{`${error}`}</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Просмотр контрагента
      </Typography>

      {contractor && (
        <Card>
          <CardMedia
            component="img"
            alt={contractor.name}
            height="340"
            image={contractor.image || defaultImage} // Используем заглушку, если изображения нет
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {contractor.name}
            </Typography>
            {/*<Typography variant="body1" paragraph>*/}
            {/*  {contractor.description}*/}
            {/*</Typography>*/}
            <Typography variant="body2" color="textSecondary">
              УНП: {contractor.unp}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email: {contractor.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Адрес: {contractor.address}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Телефон: {contractor.phone}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Контактное лицо: {contractor.contact_person}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Кнопки "Назад" и "Редактировать" */}
      <Box sx={{mt: 2, display: 'flex', gap: 2}}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate(-1)}
        >
          Назад
        </Button>

        <Box sx={{display: 'flex', gap: 2, flexGrow: 1}}>
          {(hasRole('admin')) && (
            <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                fullWidth
              >
                Редактировать
              </Button>
              {/* Кнопка удаления */}
              <Button
                variant="contained"
                color="error"
                sx={{width: 40, height: 40, minWidth: 40, padding: 0}}
                onClick={handleDelete}
              >
                X
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ContractorView;
