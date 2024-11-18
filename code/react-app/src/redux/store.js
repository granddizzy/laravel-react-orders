import {configureStore} from '@reduxjs/toolkit';
import productReducer from "./productSlice";

const store = configureStore({
  reducer: {
    // featuredItems: featuredReducer,
    products: productReducer,
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