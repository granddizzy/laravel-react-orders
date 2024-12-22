import { render, screen } from '@testing-library/react';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { store } from './redux/persistStore.js';

// Создаем стандартную тему MUI
const theme = createTheme();

test('renders welcome message', async () => {
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  );

  // Используем findByText для асинхронного поиска
  const linkElement = await screen.findByText(/Управление заказами/i);

  // Проверка на присутствие текста в документе
  expect(linkElement).toBeInTheDocument();
});
