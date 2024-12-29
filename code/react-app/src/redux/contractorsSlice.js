import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import apiClient from '../api/axiosInstance';

export const fetchContractors = createAsyncThunk(
  'contractors/fetchContractors',
  async ({url, token}) => {
    try {
      // Формируем заголовки с токеном
      const headers = token ? {Authorization: `Bearer ${token}`} : {};

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

export const deleteContractor = createAsyncThunk(
  'contractors/deleteContractor',
  async ({apiUrl, token, contractorId}, {rejectWithValue}) => {
    try {
      const url = `${apiUrl}/contractors/${contractorId}`;
      const headers = token ? {Authorization: `Bearer ${token}`} : {};
      const response = await apiClient.delete(url, {headers});

      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }

      return contractorId; // Возвращаем ID удаленного контрагента
    } catch (error) {
      return rejectWithValue(error.message);
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
      })
      // Удаление контрагента
      .addCase(deleteContractor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteContractor.fulfilled, (state, action) => {
        const deletedId = action.payload;

        // Убираем удаленного контрагента из списка
        state.contractors = state.contractors.filter(
          (contractor) => contractor.id !== deletedId
        );

        state.loading = false;
      })
      .addCase(deleteContractor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {setPage, clearContractors, setPageSize, setSearch} = contractorsSlice.actions;
export default contractorsSlice.reducer;