import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
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
  orders: [],
  loading: false,
  error: null,
  currentPage: 1, // Текущая страница
  totalPages: 1, // Общее количество страниц
  pageSize: 20, // Количество продуктов на странице
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload; // Изменяем текущую страницу
    },
    clearOrders: (state) => {
      state.orders = []; // Очищаем список
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload; // Обновляем список
        // state.totalPages = action.payload.totalPages; // Обновляем количество страниц
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {setPage, clearOrders} = ordersSlice.actions;
export default ordersSlice.reducer;