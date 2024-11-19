// src/Contractors.jsx
import React, {useEffect} from 'react';
import {Typography, Box, Button} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {useApi} from "../contexts/apiContext";
import {fetchProducts} from "../redux/productSlice";
import {Link} from "react-router-dom";
import {fetchContractors} from "../redux/contractorsSlice";

function Contractors() {

  const dispatch = useDispatch();
  const {contractors, loading, error, currentPage, totalPages, setPage} = useSelector((state) => state.contractors);

  const generateQueryParams = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage);

    return params.toString();
  };

  const apiUrl = useApi();

  useEffect(() => {
    const queryParams = generateQueryParams();
    dispatch(fetchContractors(`${apiUrl}/contractors?${queryParams}`));
  }, [dispatch, currentPage]);


  const handlePageChange = (page) => {
    dispatch(setPage(page)); // Изменяем текущую страницу
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{flexGrow: 1}}>
      <Typography variant="h4" gutterBottom>
        Контрагенты
      </Typography>
      <Typography variant="body1" paragraph>
        Здесь отображается список контрагентов с их характеристиками.
      </Typography>
      {/* Кнопка-ссылка */}
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/create-contractor"
        sx={{ mb: 2 }}
      >
        Создать нового контрагента
      </Button>

      {/* Список контрагентов */}
      <Box sx={{border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden'}}>
        {/* Заголовок таблицы */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 3fr 1.5fr 2fr',
            bgcolor: 'primary.main',
            color: 'white',
            p: 1,
          }}
        >
          <Typography fontWeight="bold">Наименование</Typography>
          <Typography fontWeight="bold">УНП</Typography>
          <Typography fontWeight="bold">Адрес</Typography>
          <Typography fontWeight="bold">Телефон</Typography>
          <Typography fontWeight="bold">Email</Typography>
        </Box>

        {/* Список контрагентов */}
        {contractors.map((contractor, index) => (
          <Box
            key={contractor.id}
            component={Link}
            to={`/contractor/${contractor.id}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 3fr 1.5fr 2fr',
              textDecoration: 'none',
              color: 'inherit',
              p: 1,
              bgcolor: index % 2 === 0 ? 'grey.50' : 'grey.100', // Чередование строк
              '&:hover': {
                bgcolor: 'primary.light', // Яркий фон при наведении
                color: 'white',
              },
              borderBottom: '1px solid #eee',
              transition: 'background-color 0.3s ease', // Плавный переход
            }}
          >
            <Typography>{contractor.name}</Typography>
            <Typography>{contractor.unp}</Typography>
            <Typography>{contractor.address}</Typography>
            <Typography>{contractor.phone}</Typography>
            <Typography>{contractor.email}</Typography>
          </Box>
        ))}
      </Box>

      {/* Пагинация */}
      <Box sx={{mt: 3, display: 'flex', justifyContent: 'space-between'}}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Предыдущая
        </Button>
        <Typography variant="body1">
          Страница {currentPage} из {totalPages}
        </Typography>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Следующая
        </Button>
      </Box>
    </Box>
  );
}

export default Contractors;
