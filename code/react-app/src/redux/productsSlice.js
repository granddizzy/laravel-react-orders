import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
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
  pageSize: 10, // Количество на странице
  search: '',
};

const productsSlice = createSlice({
  name: 'products',
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
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.data; // Обновляем список продуктов
        state.totalPages = action.payload.last_page; // Обновляем количество страниц
        state.currentPage = action.payload.current_page;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {setPage, clearProducts, setPageSize, setSearch} = productsSlice.actions;
export default productsSlice.reducer;