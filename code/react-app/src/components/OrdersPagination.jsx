// src/Products.jsx
import React from 'react';
import {
  Typography,
  Box,
  Button, useTheme, useMediaQuery
} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {setPage} from "../redux/ordersSlice";

function OrdersPagination() {
  const dispatch = useDispatch();
  const {currentPage, totalPages} = useSelector((state) => state.orders);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран

  const handlePageChange = (page) => {
    dispatch(setPage(page)); // Изменяем текущую страницу
  };

  return (
    <Box sx={{mt: 3, display: 'flex', justifyContent: 'space-between'}}>
      <Button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Предыдущая
      </Button>
      <Typography variant="body1">
        {currentPage} из {totalPages}
      </Typography>
      <Button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Следующая
      </Button>
    </Box>
  );
}

export default OrdersPagination;
