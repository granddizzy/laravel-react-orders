import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({url, token}) => {
    try {
      // Формируем заголовки с токеном
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(url, {headers});
      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  currentPage: 1, // Текущая страница
  totalPages: 1, // Общее количество страниц
  pageSize: 20, // Количество продуктов на странице
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload; // Изменяем текущую страницу
    },
    clearProducts: (state) => {
      state.products = []; // Очищаем список продуктов
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload; // Обновляем список продуктов
        // state.totalPages = action.payload.totalPages; // Обновляем количество страниц
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {setPage, clearProducts} = productsSlice.actions;
export default productsSlice.reducer;