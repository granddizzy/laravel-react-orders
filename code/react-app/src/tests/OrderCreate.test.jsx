import {render, screen} from '@testing-library/react';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from '../redux/persistStore';
import OrderCreate from '../components/OrderCreate';
import {ApiProvider, useApi} from '../contexts/apiContext';
import {createTheme, ThemeProvider} from '@mui/material/styles';

// Мокаем зависимости

// Мокируем useDispatch и useSelector для проверки их работы
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Мокируем необходимые хоки, такие как useNavigate и другие
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn().mockReturnValue(jest.fn()),
}));

// Мокаем useApi
jest.mock('../contexts/apiContext', () => ({
  ...jest.requireActual('../contexts/apiContext'),
  useApi: jest.fn(),
}));

// Создаем простую тестовую тему
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

describe('OrderCreate Component', () => {
  let mockNavigate;
  let mockDispatch;

  // Перед каждым тестом
  beforeEach(() => {
    // Мокируем возвращаемое значение useApi
    useApi.mockReturnValue({
      createOrder: jest.fn().mockResolvedValue({ success: true }),  // Симулируем успешный ответ
    });

    // Мокируем useNavigate
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Мокируем useDispatch и useSelector
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);

    useSelector.mockImplementation((selector) =>
      selector({
        auth: { token: 'mockToken' },
        cart: { products: [] },
      })
    );
  });

  // После каждого теста
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders form correctly', () => {
    const store = configureStore({
      reducer: rootReducer,  // Используем ваш реальный редюсер
      preloadedState: {
        auth: {token: 'mockToken'},  // Пример данных для auth
        cart: {products: []},  // Пример данных для cart
      },
    });

    render(
      <Provider store={store}>
        <ApiProvider>
          <ThemeProvider theme={theme}>
            <MemoryRouter>
              <OrderCreate/>
            </MemoryRouter>
          </ThemeProvider>
        </ApiProvider>
      </Provider>
    );

    // Проверка на наличие текста и элементов формы
    expect(screen.getByText(/Создать новый заказ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Контрагент \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Адрес доставки/i)).toBeInTheDocument();
    expect(screen.getByText(/Добавить позицию/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Примечания/i)).toBeInTheDocument();
  });
});
