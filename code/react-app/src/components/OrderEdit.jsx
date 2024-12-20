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
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import {useApi} from '../contexts/apiContext';
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import debounce from "lodash.debounce";
import contractor from "./Contractor";

function OrderEdit() {
  const apiUrl = useApi();
  const navigate = useNavigate();
  const {orderId} = useParams(); // Получение ID заказа из URL

  const [contractorOptions, setContractorOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [loadingContractors, setLoadingContractors] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState([]);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [order, setOrder] = useState(false);
  const [formData, setformData] = useState({
    contractor_id: null,
    contractor: null,
    shipping_address: '',
    products: [],
    notes: '',
  });

  const token = useSelector((state) => state.auth.token);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Загрузка данных заказа
  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const headers = token ? {Authorization: `Bearer ${token}`} : {};
        const response = await fetch(`${apiUrl}/orders/${orderId}`, {
          method: 'GET',
          headers,
        });
        if (!response.ok) {
          throw new Error('Заказ не найден');
        }
        const data = await response.json();

        // Заполнение formData
        setformData({
          id: data.id,
          contractor: data.contractor,
          contractor_id: data.contractor.id,
          shipping_address: data.shipping_address,
          products: data.products.map(product => ({
            ...product,
            product_id: product.id,
            quantity: parseFloat(product.quantity),
            price: parseFloat(product.price),
          })),
          notes: data.notes || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, apiUrl, token]);

  // Динамическая загрузка контрагентов
  const handleContractorSearch = (event, value) => {
    debouncedFetchContractors(value);
  };

  // Динамическая загрузка продуктов
  const handleProductSearch = (index, event, value) => {
    debouncedFetchProducts(index, value);
  };

  const debouncedFetchContractors = React.useCallback(
    debounce((value) => fetchContractors(value), 1000)
  );
  // Поиск контрагентов
  const fetchContractors = async (search = '') => {
    setLoadingContractors(true);
    try {
      const headers = token ? {Authorization: `Bearer ${token}`} : {};
      const response = await fetch(`${apiUrl}/contractors?search=${search}`, {headers});
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
  // Поиск номенклатуры
  const fetchProducts = async (index, search = '') => {
    setLoadingProducts((prev) => {
      const updatedLoading = [...prev];
      updatedLoading[index] = true; // Установить загрузку для конкретного индекса
      return updatedLoading;
    });
    try {
      const headers = token ? {Authorization: `Bearer ${token}`} : {};
      const response = await fetch(`${apiUrl}/products?search=${search}`, {headers});
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

  // Добавление позиции в заказ
  const handleAddItem = () => {
    setformData((prev) => ({
      ...prev,
      products: [...prev.products, {product_id: null, quantity: 1, price: 0}],
    }));
  };

  // Обработка изменений данных заказа (например, при изменении продуктов)
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.products];
    if (field === 'quantity' || field === 'price') {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue <= 0) return;
      updatedItems[index][field] = numericValue;
    } else if (field === 'name') {
      const prevQuantity =  updatedItems[index]?.quantity;
      if (value) {
        updatedItems[index] = value;
        updatedItems[index]['product_id'] = value?.id || null;
        updatedItems[index]['price'] = parseFloat(value.price);
        updatedItems[index]['quantity'] = prevQuantity;
      } else {
        updatedItems[index] = null;
        updatedItems[index]["product_id"] = null;
        updatedItems[index]["price"] = 0;
        updatedItems[index]["quantity"] = prevQuantity;
      }
    }
    setformData((prev) => ({...prev, products: updatedItems}));
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.products.filter((_, i) => i !== index);
    setformData((prev) => ({...prev, products: updatedItems}));
  };

  // Отправка данных
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmit(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      const response = await fetch(`${apiUrl}/orders/${orderId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Ошибка при обновлении заказа.');
      }
      navigate(`/orders/${orderId}`);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmit(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Возвращает на предыдущую страницу
  };

  // Обновление текстового поля notes
  const handleNotesChange = (event) => {
    const {value} = event.target;
    setformData((prev) => ({
      ...prev,
      notes: value,
    }));
  };

  if (isLoading) return <CircularProgress/>;
  // if (error) return <Typography>{error}</Typography>;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 800, mx: 'auto', mt: 4}}>

      <Typography variant="h5" gutterBottom>
        Редактировать заказ № {formData?.id || ''}
      </Typography>

      <Autocomplete
        options={contractorOptions}
        getOptionLabel={(option) => option.name}
        onInputChange={handleContractorSearch}
        onChange={(event, value) => setformData(
          (prev) => ({...prev, contractor: value || null, contractor_id: value?.id}))}
        loading={loadingContractors}
        value={formData.contractor}
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

      <TextField
        label="Адрес доставки"
        fullWidth
        value={formData.shipping_address}
        onChange={(event) => setformData((prev) => ({...prev, shipping_address: event.target.value}))}
      />

      {isSmallScreen ? (<Box>
          {formData.products.map((item, index) => (
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
        </Box>) :
        (<TableContainer component={Paper}>
          <Table>
            <TableBody>
              {formData.products.map((item, index) => (
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
                  <TableCell>
                    <TextField
                      type="number"
                      label="Количество"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      label="Цена"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                      required
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleRemoveItem(index)}>
                      <DeleteIcon/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>)}

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
        value={formData.notes}
        onChange={handleNotesChange}
      />

      {/* Ошибка */}
      {submitError && <Typography color="error">{submitError}</Typography>}

      <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3}}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancel}
          sx={{width: 150}} // фиксированная ширина кнопки "Отмена"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmit || !formData.contractor_id || formData.products.length === 0}
          sx={{flexGrow: 1}} // кнопка "Сохранить изменения" растягивается
        >
          {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </Box>

      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
}

export default OrderEdit;
