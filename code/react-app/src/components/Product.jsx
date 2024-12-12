import React, {useEffect, useState} from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {useApi} from '../contexts/apiContext';
import {useSelector} from "react-redux";

function ProductView() {
  const {productId} = useParams(); // Получаем id продукта из URL
  const navigate = useNavigate();
  const apiUrl = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);

  // Функция для загрузки данных о продукте
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const headers = token ? {Authorization: `Bearer ${token}`} : {};
        const response = await fetch(`${apiUrl}/products/${productId}`, {
          method: 'GET',  // Указываем метод запроса, по умолчанию 'GET'
          headers, // Заголовки, включая токен, если он есть
        });
        if (!response.ok) {
          throw new Error('Продукт не найден');
        }
        const data = await response.json();
        setProduct(data); // Заполняем данные продукта
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [apiUrl, productId]);

  // Функция для перехода к странице редактирования продукта
  const handleEdit = () => {
    navigate(`/edit-product/${productId}`);
  };

  if (isLoading) {
    return <Typography>Загрузка...</Typography>;
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
          {/* Здесь можно добавить изображение продукта, если оно есть */}
          <CardMedia
            component="img"
            alt={product.name}
            height="140"
            image={product.image || 'default-image.jpg'} // Поставьте картинку по умолчанию, если изображения нет
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
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

      {/* Кнопки "Назад" и "Редактировать" */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/catalog")}
        >
          Назад
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEdit}
        >
          Редактировать
        </Button>
      </Box>
    </Box>
  );
}

export default ProductView;
