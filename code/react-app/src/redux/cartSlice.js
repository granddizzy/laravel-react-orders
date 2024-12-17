import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  currentPage: 1, // Текущая страница
  totalPages: 1, // Общее количество страниц
  pageSize: 10, // Количество на странице
};

const cartSlice = createSlice({
  name: 'orderCart',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload; // Изменяем текущую страницу
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload; // Изменяем размер страницы
    },
    clearProducts: (state) => {
      state.products = []; // Очищаем список продуктов
    },
    addProduct: (state, action) => {
      const product = action.payload; // Новый продукт, переданный в экшен
      const existingProduct = state.products.find(p => p.id === product.id);

      if (existingProduct) {
        // Если продукт уже в корзине, увеличиваем количество
        existingProduct.quantity += product.quantity;
      } else {
        // Если продукта нет в корзине, добавляем новый
        state.products.push({ ...product });
      }
    },
    removeProduct: (state, action) => {
      const productId = action.payload; // ID продукта для удаления
      state.products = state.products.filter(product => product.id !== productId);
    },
  },
});

export const { setPage, clearProducts, setPageSize, addProduct, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;
