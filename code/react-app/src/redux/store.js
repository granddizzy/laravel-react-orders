import {configureStore} from '@reduxjs/toolkit';
import productReducer from "./productSlice";
import contractorsReducer from "./contractorsSlice";
import ordersReducer from "./ordersSlice";
import authReducer from "./authSlice";
import contractors from "../components/Contractors";

const store = configureStore({
  reducer: {
    // featuredItems: featuredReducer,
    products: productReducer,
    contractors: contractorsReducer,
    orders: ordersReducer,
    auth: authReducer,
    // cartItems: cartReducer,
    // catalogFilter: catalogFilterReducer,
    // product: productReducer,
    // designers: designersReducer,
    // brands: brandsReducer,
    // categories: categoriesReducer,
    // types: typesReducer,
    // categoriesByTypes: categoriesByTypesReducer,
  },
});

export default store;