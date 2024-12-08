// slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,  // Получаем токен из localStorage, если он есть
  user: null,  // Данные пользователя (если нужны)
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);  // Сохраняем токен в localStorage
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');  // Удаляем токен из localStorage
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;

export default authSlice.reducer;
