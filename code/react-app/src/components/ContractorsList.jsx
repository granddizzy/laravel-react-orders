// src/Products.jsx
import React from 'react';
import {
  Typography,
  Box,
  Button, useTheme, useMediaQuery
} from '@mui/material';
import {useSelector} from "react-redux";

import {Link} from "react-router-dom";
import ContractorsPagination from "./ContractorsPagination";

function ContractorsList({loading}) {
  const {contractors} = useSelector((state) => state.contractors);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран

  if (loading) return <div>Загрузка...</div>;

  return (
    <>
      {/* Список контрагентов */}
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
          <Typography fontWeight="bold">УНП</Typography>
        </Box>)}


        {/* Список контрагентов */}
        {contractors.map((contractor, index) => (
          <Box
            key={contractor.id}
            component={Link}
            to={`/contractors/${contractor.id}`}
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
                    <Typography>{contractor.name}</Typography>
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Typography fontWeight="bold">УНП:</Typography>
                    <Typography>{contractor.unp}</Typography>
                  </Box>
                </Box>
              </>
            ) : (
              // Для больших экранов показываем стандартную таблицу
              <>
                <Typography>{contractor.name}</Typography>
                <Typography>{contractor.unp}</Typography>
              </>
            )}
          </Box>
        ))}
      </Box>

      <ContractorsPagination/>
    </>
  );
}

export default ContractorsList;
