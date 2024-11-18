import {configureStore} from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    // featuredItems: featuredReducer,
    // products: catalogReducer,
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