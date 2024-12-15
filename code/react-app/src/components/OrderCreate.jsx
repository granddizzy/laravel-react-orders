import React, {useState, useEffect} from 'react';
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
  IconButton, useTheme, useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {useApi} from '../contexts/apiContext';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

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
    notes: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран

  // Поиск контрагентов
  const fetchContractors = async (search = '') => {
    setLoadingContractors(true);
    try {
      const headers = token ? {Authorization: `Bearer ${token}`} : {};
      const response = await fetch(`${apiUrl}/contractors?search=${search}`, {
        method: 'GET',  // Указываем метод запроса, по умолчанию 'GET'
        headers, // Заголовки, включая токен, если он есть
      });
      const result = await response.json();
      setContractorOptions(result.data);
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
      const headers = token ? {Authorization: `Bearer ${token}`} : {};
      const response = await fetch(`${apiUrl}/products?search=${search}`, {
        method: 'GET',  // Указываем метод запроса, по умолчанию 'GET'
        headers, // Заголовки, включая токен, если он есть
      });
      const result = await response.json();
      setProductOptions(result.data);
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
      products: [...prev.products, {product_id: null, quantity: 1, price: 0}],
    }));
  };

  // Обновление позиции заказа
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.products];

    // Если изменяется количество (quantity)
    if (field === 'quantity') {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue <= 0) return; // Игнорируем, если значение не число или меньше 0
      updatedItems[index][field] = numericValue;
    }
    // Если изменяется цена (price)
    else if (field === 'price') {
      const numericValue = parseFloat(value);  // Преобразуем в число с плавающей точкой
      if (isNaN(numericValue) || numericValue <= 0) return; // Игнорируем, если значение не число или меньше 0
      updatedItems[index][field] = numericValue;
    }
    // Если изменяется продукт (name)
    else if (field === 'name') {
      updatedItems[index]['product_id'] = value?.id || null;
      updatedItems[index]['price'] = value ? value.price : 0;
    } else {
      updatedItems[index][field] = value; // Для других полей, присваиваем значение без изменений
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
    setIsLoading(true);
    try {
      console.log(order)
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

      console.log(response);

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
            label="Контрагент"
            fullWidth
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
        )}
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
        <Box>
          {order.products.map((item, index) => (
            <Paper key={index} sx={{mb: 2, p: 2}}>
              <Box sx={{display: 'flex', gap: 2, mb: 2}}>
                <Autocomplete
                  options={productOptions}
                  getOptionLabel={(option) => option.name}
                  onInputChange={handleProductSearch}
                  onChange={(e, value) => handleItemChange(index, 'name', value)}
                  value={productOptions.find((opt) => opt.id === item.product_id) || null}
                  loading={loadingProducts}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Номенклатура"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingProducts ? <CircularProgress size={20}/> : null}
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
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              {order.products.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{width: '50%'}}>
                    <Autocomplete
                      options={productOptions}
                      getOptionLabel={(option) => option.name}
                      onInputChange={handleProductSearch}
                      onChange={(e, value) => handleItemChange(index, 'name', value)}
                      value={productOptions.find((opt) => opt.id === item.product_id) || null}
                      loading={loadingProducts}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Номенклатура"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingProducts ? <CircularProgress size={20}/> : null}
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

      {/* Кнопка для добавления новой строки */}
      <Button variant="outlined" onClick={handleAddItem}>
        Добавить позицию
      </Button>

      {/* Поле ввода заметок (notes) */}
      <TextField
        label="Заметки"
        multiline
        rows={4}
        fullWidth
        value={order.notes}
        onChange={handleNotesChange}
      />

      {/* Ошибка */}
      {error && <Typography color="error">{error}</Typography>}

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/orders')}
          sx={{ flexShrink: 0 }} // Кнопка "Отмена" фиксированного размера
        >
          Отмена
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading || !order.contractor_id || order.products.length === 0}
          sx={{ flexGrow: 1 }} // Кнопка "Создать заказ" занимает оставшуюся ширину
        >
          {isLoading ? 'Создание...' : 'Создать заказ'}
        </Button>
      </Box>
    </Box>
  );
}

export default OrderCreate;
