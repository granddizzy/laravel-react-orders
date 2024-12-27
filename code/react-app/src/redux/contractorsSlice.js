import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../api/axiosInstance';

export const fetchContractors = createAsyncThunk(
  'contractors/fetchContractors',
  async ({url, token}) => {
    try {
      // Формируем заголовки с токеном
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await apiClient.get(url, {headers});
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
  pageSize: 10, // Количество на странице
  search: '',
};

const contractorsSlice = createSlice({
  name: 'contractors',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload; // Изменяем текущую страницу
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload; // Изменяем размер страницы
    },
    clearContractors: (state) => {
      state.contractors = []; // Очищаем список
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContractors.fulfilled, (state, action) => {
        state.contractors = action.payload.data; // Обновляем список
        state.totalPages = action.payload.last_page; // Обновляем количество страниц
        state.currentPage = action.payload.current_page;
        state.loading = false;
      })
      .addCase(fetchContractors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {setPage, clearContractors, setPageSize, setSearch} = contractorsSlice.actions;
export default contractorsSlice.reducer;