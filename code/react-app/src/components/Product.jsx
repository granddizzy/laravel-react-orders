import React, {useEffect, useState} from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia, CircularProgress,
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {useApi} from '../contexts/apiContext';
import {useDispatch, useSelector} from "react-redux";
import defaultImage from '../img/default-product-image.png';
import {addProduct, removeProduct} from "../redux/cartSlice";
import {deleteProduct, fetchPreviousProducts, removeOldNextProducts} from "../redux/productsSlice";

function ProductView() {
  const {productId} = useParams(); // Получаем id продукта из URL
  const navigate = useNavigate();
  const apiUrl = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  const cartProducts = useSelector((state) => state.cart.products);
  const token = useSelector((state) => state.auth.token);

  const user = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  // Проверка: есть ли продукт в корзине
  const isInCart = cartProducts.some(p => p.id === product?.id);

  // Загрузка данных о продукте
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const headers = token ? {Authorization: `Bearer ${token}`} : {};
        const response = await fetch(`${apiUrl}/products/${productId}`, {
          method: 'GET',
          headers,
        });
        if (!response.ok) {
          throw new Error('Продукт не найден');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [apiUrl, productId, token]);

  // Добавить в корзину
  const handleAddInCart = () => {
    if (product) {
      dispatch(addProduct({...product, quantity: 1})); // Добавляем продукт с количеством 1
    }
  };

  // Удалить из корзины
  const handleRemoveFromCart = () => {
    if (product) {
      dispatch(removeProduct(product.id));
    }
  };

  const hasRole = (role) => user?.roles?.some(r => r.name === role);

  const handleDelete = () => {
    dispatch(deleteProduct({
      apiUrl,
      token,
      productId
    }))
      .unwrap() // Разворачиваем результат для обработки успеха или ошибки
      .then(() => {
        navigate(-1); // Возвращаемся на предыдущую страницу при успешном удалении
      })
      .catch((error) => {
        console.error('Ошибка при удалении товара:', error);
      });
  }

  if (isLoading) {
    return <CircularProgress/>;
  }

  if (error) {
    return <Typography color="error">{`${error}`}</Typography>;
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Просмотр продукта
      </Typography>

      {product && (
        <Card>
          <CardMedia
            component="img"
            alt={product.name}
            height="340"
            image={product.image || defaultImage}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Артикул: {product.sku}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Цена: {product.price} ₽
            </Typography>
            <Typography variant="body2" color="textSecondary">
              В наличии: {product.stock_quantity} {product.unit}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Кнопки управления */}
      <Box sx={{mt: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
        {/* Верхняя строка с кнопками "Назад" и "В корзину" */}
        <Box sx={{display: 'flex', gap: 2, justifyContent: 'space-between'}}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate("/products")}
          >
            Назад
          </Button>

          <Box sx={{display: 'flex', gap: 2, flexGrow: 1, justifyContent: 'flex-end'}}>
            {isInCart ? (
              <Button
                variant="contained"
                color="error"
                onClick={handleRemoveFromCart}
                fullWidth
              >
                Из корзины
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddInCart}
                fullWidth
              >
                В корзину
              </Button>
            )}
          </Box>
        </Box>

        {/* Кнопка "Редактировать" на всю ширину */}
        {hasRole('admin') ? (
          <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate(`/products/${productId}/edit`)}
            >
              Редактировать
            </Button>
            {/* Кнопка удаления */}
            <Button
              variant="contained"
              color="error"
              sx={{width: 40, height: 40, minWidth: 40, padding: 0}}
              onClick={handleDelete}
            >
              X
            </Button>
          </Box>
        ) : null}
      </Box>

    </Box>
  );
}

export default ProductView;
