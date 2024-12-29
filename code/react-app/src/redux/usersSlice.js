import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../api/axiosInstance';

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
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
  users: [],
  loading: false,
  error: null,
  currentPage: 1, // Текущая страница
  totalPages: 1, // Общее количество страниц
  pageSize: 10, // Количество на странице
  search: '',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload; // Изменяем текущую страницу
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload; // Изменяем размер страницы
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log(action.payload)
        state.users = action.payload.data; // Обновляем список
        state.totalPages = action.payload.last_page; // Обновляем количество страниц
        state.currentPage = action.payload.current_page;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {setPage, clearContractors, setPageSize, setSearch} = usersSlice.actions;
export default usersSlice.reducer;