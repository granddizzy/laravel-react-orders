import React, {useEffect, useState} from 'react';
import {
  Typography,
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  CircularProgress, useMediaQuery, useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import {useApi} from '../contexts/apiContext';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import debounce from "lodash.debounce";

function OrderCreate() {
  const apiUrl = useApi();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  // Локальное состояние
  const [contractorOptions, setContractorOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [loadingContractors, setLoadingContractors] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState([]);
  const [order, setOrder] = useState({
    contractor_id: null,
    shipping_address: '',
    products: [], // Массив с товарами в заказе
    notes: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран

  const cartProducts = useSelector((state) => state.cart.products);

  useEffect(() => {
    // Заполняем products из cartProducts при первом рендере
    if (cartProducts?.length) {
      const filteredProducts = cartProducts.map(({name, id, price, quantity}) => ({
        name,
        product_id: id,
        price: parseFloat(price),
        quantity: parseFloat(quantity),
      }));
      setOrder((prev) => ({...prev, products: filteredProducts}));
    }
  }, [cartProducts]);

  const debouncedFetchContractors = React.useCallback(
    debounce((value) => fetchContractors(value), 1000)
  );
  // Поиск контрагентов
  const fetchContractors = async (search = '') => {
    setLoadingContractors(true);
    try {
      const headers = token ? {Authorization: `Bearer ${token}`} : {};
      const response = await fetch(`${apiUrl}/contractors?search=${search}`, {
        method: 'GET',
        headers,
      });
      const result = await response.json();
      setContractorOptions(result.data);
    } catch {
      setContractorOptions([]);
    } finally {
      setLoadingContractors(false);
    }
  };

  const debouncedFetchProducts = React.useCallback(
    debounce((index, value) => fetchProducts(index, value), 1000)
  );

  // Поиск номенклатуры для всех позиций в заказе
  const fetchProducts = async (index, search = '') => {
    setLoadingProducts((prev) => {
      const updatedLoading = [...prev];
      updatedLoading[index] = true; // Установить загрузку для конкретного индекса
      return updatedLoading;
    });

    try {
      const headers = token ? {Authorization: `Bearer ${token}`} : {};
      const response = await fetch(`${apiUrl}/products?search=${search}`, {
        method: 'GET',
        headers,
      });
      const result = await response.json();
      setProductOptions((prev) => {
        const updatedOptions = [...prev];
        updatedOptions[index] = result.data; // Обновить продукты для конкретного индекса
        return updatedOptions;
      });
    } catch {
      setProductOptions((prev) => {
        const updatedOptions = [...prev];
        updatedOptions[index] = []; // Обновить продукты для конкретного индекса
        return updatedOptions;
      });
    } finally {
      setLoadingProducts((prev) => {
        const updatedLoading = [...prev];
        updatedLoading[index] = false; // Установить загрузку для конкретного индекса
        return updatedLoading;
      });
    }
  };

  // Динамическая загрузка контрагентов
  const handleContractorSearch = (event, value) => {
    debouncedFetchContractors(value);
  };

  // Динамическая загрузка продуктов
  const handleProductSearch = (index, event, value) => {
    debouncedFetchProducts(index, value);
  };

  // Добавление позиции в заказ
  const handleAddItem = () => {
    setOrder((prev) => ({
      ...prev,
      products: [...prev.products, {product_id: null, name: '', quantity: 1, price: 0}],
    }));
  };

  // Обновление позиции заказа
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.products];

    if (field === 'quantity' || field === 'price') {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue <= 0) return;
      updatedItems[index][field] = numericValue;
    }
    if (field === 'name') {
      if (value) {
        updatedItems[index]["name"] = value.name;
        updatedItems[index]["product_id"] = value.id;
        updatedItems[index]["price"] = value.price;
      } else {
        updatedItems[index]["name"] = ''; // Можно задать пустую строку или значение по умолчанию
        updatedItems[index]["product_id"] = null;
        updatedItems[index]["price"] = 0;
      }
    } else {
      updatedItems[index][field] = value;
    }

    setOrder((prev) => ({
      ...prev,
      products: updatedItems,
    }));
  };

  // Удаление позиции из заказа
  const handleRemoveItem = (index) => {
    const updatedItems = order.products.filter((_, i) => i !== index);
    setOrder((prev) => ({...prev, products: updatedItems}));
  };

  // Отправка формы
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!order.contractor_id || order.products.length === 0) {
      setError('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    if (order.products.some((item) => !item.product_id || item.quantity <= 0 || item.price <= 0)) {
      setError('Проверьте позиции: все товары должны быть выбраны, а количество и цена указаны корректно.');
      return;
    }

    setIsLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers,
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

  // Обновление текстового поля notes
  const handleNotesChange = (event) => {
    const {value} = event.target;
    setOrder((prev) => ({
      ...prev,
      notes: value,
    }));
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
        data-testid="contractor-box"
        options={contractorOptions}
        getOptionLabel={(option) => option.name}
        onInputChange={handleContractorSearch}
        onChange={(event, value) => {
          setOrder((prev) => ({...prev, contractor_id: value?.id || null}));
        }}
        loading={loadingContractors}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Контрагент *"
            fullWidth
            error={!order.contractor_id && error} // Подсветка ошибки
            helperText={!order.contractor_id && error ? 'Выберите контрагента' : ''}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingContractors ? <CircularProgress size={20}/> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )
        }
      />

      {/* Поле ввода адреса доставки */}
      <TextField
        label="Адрес доставки"
        fullWidth
        value={order.shipping_address}
        onChange={(event) =>
          setOrder((prev) => ({...prev, shipping_address: event.target.value}))
        }
      />

      {/* Таблица с позициями заказа */}
      {isSmallScreen ? (
        // Адаптивная версия для маленьких экранов
        <Box data-testid="product-box">
          {order.products.map((item, index) => (
            <Paper key={index} sx={{mb: 2, p: 2}}>
              <Box sx={{display: 'flex', gap: 2, mb: 2}}>
                <Autocomplete
                  options={productOptions[index] || []}
                  getOptionLabel={(option) => option.name}
                  onInputChange={(e, value) => handleProductSearch(index, e, value)}
                  onChange={(e, value) => handleItemChange(index, 'name', value)}
                  value={item}
                  loading={loadingProducts[index] || false}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Номенклатура *"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingProducts[index] ? <CircularProgress size={20}/> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  fullWidth
                />
              </Box>
              <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
                <TextField
                  type="number"
                  label="Количество"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                  sx={{flex: 1}}
                />
                <TextField
                  type="number"
                  label="Цена"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  required
                  sx={{flex: 1}}
                />
                <IconButton onClick={() => handleRemoveItem(index)}>
                  <DeleteIcon/>
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      ) : (
        // Обычная версия для больших экранов
        <TableContainer data-testid="product-box" component={Paper}>
          <Table>
            <TableBody>
              {order.products.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{width: '50%'}}>
                    <Autocomplete
                      options={productOptions[index] || []}
                      getOptionLabel={(option) => option.name}
                      onInputChange={(e, value) => handleProductSearch(index, e, value)}
                      onChange={(e, value) => handleItemChange(index, 'name', value)}
                      value={item}
                      loading={loadingProducts[index] || false}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Номенклатура"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingProducts[index] ? <CircularProgress size={20}/> : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell sx={{width: '15%'}}>
                    <TextField
                      type="number"
                      label="Количество"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      required
                    />
                  </TableCell>
                  <TableCell sx={{width: '15%'}}>
                    <TextField
                      type="number"
                      label="Цена"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      required
                    />
                  </TableCell>
                  <TableCell sx={{width: '10%'}}>
                    <IconButton onClick={() => handleRemoveItem(index)}>
                      <DeleteIcon/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Кнопка добавления позиции */}
      <Button onClick={handleAddItem} variant="contained">
        Добавить позицию
      </Button>

      {/* Поле ввода примечаний */}
      <TextField
        label="Примечания"
        multiline
        rows={4}
        value={order.notes}
        onChange={handleNotesChange}
      />

      {/* Сообщения об ошибке или загрузке */}
      {error && <Typography color="error">{error}</Typography>}
      <Button
        type="submit"
        variant="contained"
        disabled={isLoading} // Заблокировать кнопку при загрузке
      >
        {isLoading ? 'Сохранение' : 'Сохранить заказ'}
      </Button>
    </Box>
  );
}

export default OrderCreate;
