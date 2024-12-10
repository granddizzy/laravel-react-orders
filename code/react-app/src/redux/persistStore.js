import {configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import {combineReducers} from 'redux';
import authReducer from './authSlice';

const persistConfig = {
  key: '8SUp0r0TYlKTPfmf5kr8wKz5pIIMX4B5_root',
  storage: sessionStorage,
  whitelist: ['auth'],
  debug: true,
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // devTools: false, // Отключаем DevTools
});

export const persistor = persistStore(store);

// Включите обработчик ошибок
store.subscribe(() => {
  try {
    const state = persistor.getState();
    console.log('Persistor state updated:', state);
  } catch (error) {
    console.error('Error in persistor subscription:', error);
  }
});