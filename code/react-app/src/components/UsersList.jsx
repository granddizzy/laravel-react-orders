import React from 'react';
import {
  Typography,
  Box,
  Button, useTheme, useMediaQuery, CircularProgress
} from '@mui/material';
import {useSelector} from "react-redux";

import {Link} from "react-router-dom";
import UsersPagination from "./UsersPagination";

function UsersList({loading}) {
  const {users} = useSelector((state) => state.users);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран

  if (loading) return <CircularProgress/>;
  // console.log(users)
  return (
    <>
      {/* Список пользователь */}
      <Box sx={{border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden'}}>

        {/* Заголовок таблицы */}
        {isSmallScreen ? (
          <></>) : (<Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            bgcolor: 'primary.main',
            color: 'white',
            p: 1,
          }}
        >
          <Typography fontWeight="bold">Имя</Typography>
          <Typography fontWeight="bold">Email</Typography>
        </Box>)}


        {/* Список пользователь */}
        {users && users.map((user, index) => (
          <Box
            key={user.id}
            component={Link}
            to={`/users/${user.id}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: isSmallScreen
                ? '1fr' // Один столбец на маленьком экране
                : '1fr 1fr', // Стандартное оформление на большом экране
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
                    <Typography fontWeight="bold">Имя:</Typography>
                    <Typography>{user.name}</Typography>
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography fontWeight="bold">Email:</Typography>
                    <Typography>{user.email}</Typography>
                  </Box>
                </Box>
              </>
            ) : (
              // Для больших экранов показываем стандартную таблицу
              <>
                <Typography>{user.name}</Typography>
                <Typography>{user.email}</Typography>
              </>
            )}
          </Box>
        ))}
      </Box>

      <UsersPagination/>
    </>
  );
}

export default UsersList;
