import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchContractors = createAsyncThunk(
  'contractors/fetchContractors',
  async (url) => {
    try {
      const response = await axios.get(url);
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
  contractors: [],
  loading: false,
  error: null,
  currentPage: 1, // Текущая страница
  totalPages: 1, // Общее количество страниц
  pageSize: 20, // Количество продуктов на странице
};

const contractorsSlice = createSlice({
  name: 'contractors',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload; // Изменяем текущую страницу
    },
    clearContractors: (state) => {
      state.contractors = []; // Очищаем список
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContractors.fulfilled, (state, action) => {
        state.contractors = action.payload; // Обновляем список
        // state.totalPages = action.payload.totalPages; // Обновляем количество страниц
        state.loading = false;
      })
      .addCase(fetchContractors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {setPage, clearContractors} = contractorsSlice.actions;
export default contractorsSlice.reducer;