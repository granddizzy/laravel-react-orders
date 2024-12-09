import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useApi } from '../contexts/apiContext';
import {useNavigate} from "react-router-dom";

function OrderCreate() {
  const apiUrl = useApi();
  const navigate = useNavigate();
  // Локальное состояние
  const [contractorOptions, setContractorOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [loadingContractors, setLoadingContractors] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [order, setOrder] = useState({
    contractor_id: null,
    manager_id: 1,
    shipping_address: "",
    products: [],
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Поиск контрагентов
  const fetchContractors = async (search = '') => {
    setLoadingContractors(true);
    try {
      const response = await fetch(`${apiUrl}/contractors?search=${search}`);
      const result = await response.json();
      setContractorOptions(result);
    } catch {
      setContractorOptions([]);
    } finally {
      setLoadingContractors(false);
    }
  };

  // Поиск номенклатуры
  const fetchProducts = async (search = '') => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`${apiUrl}/products?search=${search}`);
      const result = await response.json();
      setProductOptions(result);
    } catch {
      setProductOptions([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Динамическая загрузка контрагентов
  const handleContractorSearch = (event, value) => {
    fetchContractors(value);
  };

  // Динамическая загрузка номенклатуры
  const handleProductSearch = (event, value) => {
    fetchProducts(value);
  };

  // Добавление позиции в заказ
  const handleAddItem = () => {
    setOrder((prev) => ({
      ...prev,
      products: [...prev.products, { product_id: null, quantity: 1 }],
    }));
  };

  // Обновление позиции заказа
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.products];
    updatedItems[index][field] = field === 'quantity' ? Number(value) : value;
    setOrder((prev) => ({ ...prev, products: updatedItems }));
  };

  // Удаление позиции из заказа
  const handleRemoveItem = (index) => {
    const updatedItems = order.products.filter((_, i) => i !== index);
    setOrder((prev) => ({ ...prev, products: updatedItems }));
  };

  // Отправка формы
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      console.log(order)
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании заказа.');
      }

      // После успешного создания обновляем список
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        maxWidth: 800,
        mx: 'auto',
        mt: 4,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Создать новый заказ
      </Typography>

      {/* Автозаполнение контрагента */}
      <Autocomplete
        options={contractorOptions}
        getOptionLabel={(option) => option.name}
        onInputChange={handleContractorSearch}
        onChange={(event, value) => {
          setOrder((prev) => ({ ...prev, contractor_id: value?.id || null }));
        }}
        loading={loadingContractors}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Контрагент"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingContractors ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {/* Таблица с позициями заказа */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Номенклатура</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.products.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Autocomplete
                    options={productOptions}
                    getOptionLabel={(option) => option.name}
                    onInputChange={handleProductSearch}
                    onChange={(event, value) => {
                      handleItemChange(index, 'product_id', value?.id || null);
                    }}
                    loading={loadingProducts}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Номенклатура"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingProducts ? (
                                <CircularProgress size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, 'quantity', e.target.value)
                    }
                    required
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveItem(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Кнопка для добавления новой строки */}
      <Button variant="outlined" onClick={handleAddItem}>
        Добавить позицию
      </Button>

      {/* Ошибка */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Кнопка отправки */}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading || !order.contractor_id || order.products.length === 0}
      >
        {isLoading ? 'Создание...' : 'Создать заказ'}
      </Button>
    </Box>
  );
}

export default OrderCreate;
