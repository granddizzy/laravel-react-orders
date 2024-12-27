import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../api/axiosInstance';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({url, token}) => {
    try {
      // Формируем заголовки с токеном
      const headers = token ? {Authorization: `Bearer ${token}`} : {};
      const response = await apiClient.get(url, {headers});
      console.log(response.status)
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
  orders: [],
  loading: false,
  error: null,
  currentPage: 1, // Текущая страница
  totalPages: 1, // Общее количество страниц
  pageSize: 10, // Количество продуктов на странице
  search: '',
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload; // Изменяем текущую страницу
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload; // Изменяем размер страницы
    },
    clearOrders: (state) => {
      state.orders = []; // Очищаем список
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.data; // Обновляем список
        state.totalPages = action.payload.last_page; // Обновляем количество страниц
        state.currentPage = action.payload.current_page;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setPage, clearOrders,
  setPageSize,
  setSearch
} = ordersSlice.actions;
export default ordersSlice.reducer;