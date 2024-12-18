import React, {useRef, useCallback, useState, useEffect} from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {useSelector, useDispatch} from 'react-redux';
import {Link} from 'react-router-dom';
import {
  fetchMoreProducts,
  fetchPreviousProducts,
  removeOldNextProducts,
  removeOldPrevProducts,
  clearProducts,
} from '../redux/productsSlice';  // Импортируем новый action
import {useApi} from "../contexts/apiContext";

function ProductsList() {
  const dispatch = useDispatch();
  const {products, hasMoreNext, hasMorePrev, pageSize, currentPage, search} = useSelector(
    (state) => state.products
  );
  const cartProducts = useSelector((state) => state.cart.products);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [isFetchingPrev, setIsFetchingPrev] = useState(false);

  const apiUrl = useApi();
  const token = useSelector((state) => state.auth.token);

  // Проверка наличия товара в корзине
  const isProductInCart = (productId) =>
    cartProducts.some((cartProduct) => cartProduct.id === productId);

  // Загрузка следующей страницы (вниз)
  const loadNextProducts = useCallback(() => {
    if (isFetchingNext || !hasMoreNext) return; // Проверка на активную загрузку и наличие следующих товаров
    setIsFetchingNext(true);
    dispatch(fetchMoreProducts({apiUrl, token, pageSize, search, products})).finally(() => {
      setIsFetchingNext(false);
      dispatch(removeOldPrevProducts());
    });
  }, [dispatch, isFetchingNext, hasMoreNext, apiUrl, token, search]);

  // Загрузка предыдущей страницы (вверх)
  const loadPrevProducts = useCallback(() => {
    if (isFetchingPrev || !hasMorePrev) return; // Проверка на активную загрузку и наличие предыдущих товаров
    setIsFetchingPrev(true);
    dispatch(fetchPreviousProducts({
      apiUrl,
      token,
      pageSize,
      search,
      products,
    })).finally(() => {
      setIsFetchingPrev(false)
      dispatch(removeOldNextProducts());
    });
  }, [dispatch, isFetchingPrev, hasMorePrev, apiUrl, token, search]);

  // Рефы для отслеживания первого и последнего элемента
  const observerPrev = useRef();
  const observerNext = useRef();

  // Callback для подгрузки вверх (предыдущие страницы)
  const firstProductRef = useCallback(
    (node) => {
      if (isFetchingPrev || !node) return;
      if (observerPrev.current) observerPrev.current.disconnect();
      observerPrev.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMorePrev) {
          loadPrevProducts();
        }
      });
      if (node) observerPrev.current.observe(node);
    },
    [isFetchingPrev, hasMorePrev, loadPrevProducts]
  );

  // Callback для подгрузки вниз (следующие страницы)
  const lastProductRef = useCallback(
    (node) => {
      if (isFetchingNext || !node) return;
      if (observerNext.current) observerNext.current.disconnect();
      observerNext.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreNext) {
          loadNextProducts();
        }
      });
      if (node) observerNext.current.observe(node);
    },
    [isFetchingNext, hasMoreNext, loadNextProducts]
  );

  // Запуск первой загрузки товаров при монтировании компонента
  useEffect(() => {
    if (products.length === 0) {
      loadNextProducts();
    } else {
      loadPrevProducts(); // это нужно потому что при первоначальном рендеренге список будет на 0 позиции
    }
  }, []);

  useEffect(() => {
    dispatch(clearProducts());
    loadNextProducts();
  }, [search]);

  // Рассчитываем максимальную высоту для списка товаров с учетом шапки и других отступов
  const getMaxHeight = () => {
    const headerHeight = 370; // Примерная высота шапки (можно изменить в зависимости от вашего дизайна)
    const padding = 20; // Дополнительные отступы
    return `${window.innerHeight - headerHeight - padding}px`;
  };

  return (
    <Box sx={{border: '1px solid #ccc', borderRadius: 1, overflow: 'auto', maxHeight: getMaxHeight()}}>
      {/* Иконка загрузки при подгрузке вверх */}
      {isFetchingPrev && <CircularProgress size={24} sx={{m: 2}}/>}

      {/* Рендер списка товаров */}
      {products.map((product, index) => {
        const isInCart = isProductInCart(product.id);
        return (
          <Box
            key={product.id}
            ref={
              index === 0
                ? firstProductRef // Первый элемент для подгрузки вверх
                : index === products.length - 1
                  ? lastProductRef // Последний элемент для подгрузки вниз
                  : null
            }
            component={Link}
            to={`/products/${product.id}`}
            sx={{
              display: 'grid',
              gridTemplateColumns: isSmallScreen
                ? '1fr'
                : '150px 1fr 100px 100px 100px',
              textDecoration: 'none',
              color: 'inherit',
              p: 1,
              bgcolor: isInCart
                ? 'grey.400'
                : index % 2 === 0
                  ? 'grey.50'
                  : 'grey.100',
              '&:hover': {
                bgcolor: 'primary.light',
                color: 'white',
              },
              borderBottom: '1px solid #eee',
              transition: 'background-color 0.3s ease',
            }}
          >
            {isSmallScreen ? (
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <Typography fontWeight="bold">Артикул:</Typography>
                <Typography>{product.sku}</Typography>
                <Typography fontWeight="bold">Наименование:</Typography>
                <Typography>{product.name}</Typography>
                <Typography fontWeight="bold">Цена:</Typography>
                <Typography>{product.price}₽</Typography>
                <Typography fontWeight="bold">Количество:</Typography>
                <Typography>{product.stock_quantity}</Typography>
                <Typography fontWeight="bold">Ед. изм.:</Typography>
                <Typography>{product.unit}</Typography>
              </Box>
            ) : (
              <>
                <Typography>{product.sku}</Typography>
                <Typography>{product.name}</Typography>
                <Typography>{product.price}₽</Typography>
                <Typography>{product.stock_quantity}</Typography>
                <Typography>{product.unit}</Typography>
              </>
            )}
          </Box>
        );
      })}

      {/* Иконка загрузки при подгрузке вниз */}
      {isFetchingNext && <CircularProgress size={24} sx={{m: 2}}/>}
    </Box>
  );
}

export default ProductsList;
