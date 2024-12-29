import React, {useState} from 'react';
import {
  Typography,
  Box,
  Button, useTheme, useMediaQuery, CircularProgress
} from '@mui/material';

import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useApi} from "../contexts/apiContext";
import apiClient from '../api/axiosInstance'

function UserContractorsList({user, setUser}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран
  const token = useSelector((state) => state.auth.token);
  const baseUrl = useApi();

  const [isDeleting, setIsDeleting] = useState(null);

  const handleRemoveContractor = async (id) => {
    setIsDeleting(id);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Отправка запроса на удаление контрагента
      const response = await apiClient.delete(`${baseUrl}/users/${user.id}/contractors/${id}`, { headers });

      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      // Если произошла ошибка, выводим сообщение
      // setError('Не удалось удалить контрагента. Попробуйте снова.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <>
      {/* Список контрагентов */}
      <Box sx={{border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden'}}>

        {/* Заголовок таблицы */}
        {isSmallScreen ? (
          <></>) : (<Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 100px',
            bgcolor: 'primary.main',
            color: 'white',
            p: 1,
          }}
        >
          <Typography fontWeight="bold">Наименование</Typography>
          <Typography fontWeight="bold">УНП</Typography>
          <Typography fontWeight="bold"></Typography>
        </Box>)}

        {/* Список контрагентов */}
        {user?.contractors?.map((contractor, index) => (
          <Box
            key={contractor.id}
            component={Link}
            // to={`/contractors/${contractor.id}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: isSmallScreen
                ? '1fr' // Один столбец на маленьком экране
                : '1fr 1fr 100px', // Стандартное оформление на большом экране
              textDecoration: 'none',
              color: 'inherit',
              p: 1,
              bgcolor: index % 2 === 0 ? 'grey.50' : 'grey.100',
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'white',
              },
              borderBottom: '1px solid #eee',
              transition: 'background-color 0.3s ease',
            }}
          >
            {isSmallScreen ? (
              // Для маленьких экранов показываем значения в виде "ключ: значение"
              <>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                  <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography fontWeight="bold">Наименование:</Typography>
                    <Typography>{contractor.name}</Typography>
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography fontWeight="bold">УНП:</Typography>
                    <Typography>{contractor.unp}</Typography>
                  </Box>
                  {/* Кнопка УДАЛИТЬ */}
                  <Box sx={{display: 'flex', justifyContent: 'flex-end', marginTop: 2}}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemoveContractor(contractor.id)}
                    >
                      УДАЛИТЬ
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              // Для больших экранов показываем стандартную таблицу
              <>
                <Typography>{contractor.name}</Typography>
                <Typography>{contractor.unp}</Typography>
                {/* Кнопка "Удалить" */}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveContractor(contractor.id)}
                  disabled={isDeleting === contractor.id}
                >
                  {isDeleting === contractor.id ? 'Удаление' : 'УДАЛИТЬ'}
                </Button>
              </>
            )}
          </Box>
        ))}
      </Box>

    </>
  );
}

export default UserContractorsList;
