import {configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';
import localStorage from 'redux-persist/lib/storage';
import {combineReducers} from 'redux';
import authReducer from './authSlice';
import productReducer from "./productsSlice";
import contractorsReducer from "./contractorsSlice";
import ordersReducer from "./ordersSlice";
import cartReducer from "./cartSlice";


const persistConfig = {
  key: '8SUp0r0TYlKTPfmf5kr8wKz5pIIMX4B5_root',
  storage: localStorage,
  whitelist: ['auth'],
  // debug: true,
};

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  contractors: contractorsReducer,
  orders: ordersReducer,
  cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  // devTools: false, // Отключаем DevTools
});

const persistor = persistStore(store);

export {store, persistor};