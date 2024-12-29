import React, {useState} from 'react';
import {
  Typography,
  Box,
  Button, useTheme, useMediaQuery
} from '@mui/material';

import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useApi} from "../contexts/apiContext";
import apiClient from '../api/axiosInstance'
import {setUser} from "../redux/authSlice";

function UserRoleList() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const baseUrl = useApi();

  const [isDeleting, setIsDeleting] = useState(null);

  const handleRemoveRole = async (id) => {
    setIsDeleting(id);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      const response = await apiClient.delete(`${baseUrl}/users/${user.id}/roles/${id}`, {headers});

      if (response.status === 200) {
        dispatch(setUser(response.data));
      }
    } catch (error) {
      // Если произошла ошибка, выводим сообщение
      // setError('Не удалось удалить роль. Попробуйте снова.');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <>
      {/* Список ролей */}
      <Box sx={{border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden'}}>

        {/* Заголовок таблицы */}
        {isSmallScreen ? (
          <></>) : (<Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 100px',
            bgcolor: 'primary.main',
            color: 'white',
            p: 1,
          }}
        >
          <Typography fontWeight="bold">Наименование</Typography>
          <Typography fontWeight="bold"></Typography>
        </Box>)}

        {/* Список ролей */}
        {user?.roles?.map((role, index) => (
          <Box
            key={role.id}
            component={Link}
            sx={{
              display: 'grid',
              gridTemplateColumns: isSmallScreen
                ? '1fr' // Один столбец на маленьком экране
                : '1fr 100px', // Стандартное оформление на большом экране
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
                    <Typography>{role.name}</Typography>
                  </Box>

                  {/* Кнопка УДАЛИТЬ */}
                  <Box sx={{display: 'flex', justifyContent: 'flex-end', marginTop: 2}}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemoveRole(role.id)}
                    >
                      УДАЛИТЬ
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              // Для больших экранов показываем стандартную таблицу
              <>
                <Typography>{role.name}</Typography>
                {/* Кнопка "Удалить" */}
                {user.roles.length > 1 && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveRole(role.id)}
                    disabled={isDeleting === role.id}
                  >
                    {isDeleting === role.id ? 'Удаление' : 'УДАЛИТЬ'}
                  </Button>
                )}
              </>
            )}
          </Box>
        ))}
      </Box>
    </>
  );
}

export default UserRoleList;
