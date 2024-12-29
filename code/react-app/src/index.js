import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux";
import {ApiProvider} from "./contexts/apiContext";
import {createTheme, ThemeProvider} from "@mui/material";
import App from "./App";
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from "./redux/persistStore";

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <ApiProvider>
      <ThemeProvider theme={theme}>
        <PersistGate loading={<div>Загрузка...</div>} persistor={persistor}>
          <App/>
        </PersistGate>
      </ThemeProvider>
    </ApiProvider>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
