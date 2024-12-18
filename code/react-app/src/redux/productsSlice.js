import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

// Асинхронное действие для подгрузки следующих данных (вниз)
export const fetchMoreProducts = createAsyncThunk(
  'products/fetchMoreProducts',
  async ({apiUrl, token, pageSize, search, products}, {rejectWithValue}) => {
    try {
      let newestPage = 0;
      if (products.length > 0) {
        newestPage = products[products.length - 1]?.currentPage; // Получаем currentPage самых "новых" товаров
      }

      const params = new URLSearchParams();
      params.append("page", newestPage + 1);
      params.append("per_page", pageSize);
      if (search) params.append("search", search); // Добавляем параметр поиска, если он есть
      const url = `${apiUrl}/products?${params.toString()}`;

      const headers = token ? {Authorization: `Bearer ${token}`} : {};
      const response = await axios.get(url, {
        headers,
      });
      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронное действие для подгрузки предыдущих данных (вверх)
export const fetchPreviousProducts = createAsyncThunk(
  'products/fetchPreviousProducts',
  async ({apiUrl, token, pageSize, search, products}, {rejectWithValue}) => {
    try {
      const oldestPage = products[0]?.currentPage; // Получаем currentPage самых "старых" товаров
      if (oldestPage === 1) return;

      const params = new URLSearchParams();
      params.append("page", oldestPage - 1);
      params.append("per_page", pageSize);
      if (search) params.append("search", search); // Добавляем параметр поиска, если он есть
      const url = `${apiUrl}/products?${params.toString()}`;

      // if (currentPage === 1) {
      //   throw new Error('No more previous pages');
      // }
      const headers = token ? {Authorization: `Bearer ${token}`} : {};
      const response = await axios.get(url, {
        headers,
      });
      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  search: '',
  hasMoreNext: true,
  hasMorePrev: false,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    clearProducts: (state) => {
      state.products = [];
      state.hasMorePrev = false;
      state.hasMoreNext = true;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    removeOldPrevProducts: (state) => {
      if (state.products.length === 0) return;

      const oldestPage = state.products[0]?.currentPage; // Получаем currentPage самых "старых" товаров
      const newestPage = state.products[state.products.length - 1]?.currentPage; // Получаем currentPage самых "новых" товаров

      if (newestPage - oldestPage > 2) {
        // alert("удаляем старые")
        state.products = state.products.filter(
          (product) => product.currentPage !== oldestPage // Удаляем товары с самой младшей загруженной страницы
        );
        state.hasMorePrev = true;
      }
    },
    removeOldNextProducts: (state) => {
      if (state.products.length === 0) return;

      const oldestPage = state.products[0]?.currentPage; // Получаем currentPage самых "старых" товаров
      const newestPage = state.products[state.products.length - 1]?.currentPage; // Получаем currentPage самых "новых" товаров
      if (newestPage - oldestPage > 2) {
        // alert("удаляем новые")
        state.products = state.products.filter(
          (product) => product.currentPage !== newestPage // Удаляем товары с самой старшей загруженной страницы
        );
        state.hasMoreNext = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Обработка загрузки следующих данных
      .addCase(fetchMoreProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoreProducts.fulfilled, (state, action) => {
        const productsWithPage = action.payload.data.map(product => ({
          ...product,
          currentPage: action.payload.current_page, // Добавляем текущую страницу к каждому товару
        }));

        state.products = [...state.products, ...productsWithPage]; // Добавляем новые данные к текущим
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.hasMoreNext = action.payload.current_page < action.payload.last_page;
        state.loading = false;
      })
      .addCase(fetchMoreProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Обработка загрузки предыдущих данных
      .addCase(fetchPreviousProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPreviousProducts.fulfilled, (state, action) => {
        const productsWithPage = action.payload.data.map(product => ({
          ...product,
          currentPage: action.payload.current_page, // Добавляем текущую страницу к каждому товару
        }));

        state.products = [...productsWithPage, ...state.products];
        state.currentPage = action.payload.current_page;
        state.totalPages = action.payload.last_page;
        state.hasMorePrev = action.payload.current_page > 1;
        state.loading = false;
      })
      .addCase(fetchPreviousProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setPage,
  clearProducts,
  setPageSize,
  setSearch,
  removeOldNextProducts,
  removeOldPrevProducts
} = productsSlice.actions;
export default productsSlice.reducer;
