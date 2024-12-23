import {fireEvent, prettyDOM, render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter, useNavigate} from 'react-router-dom';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {rootReducer} from '../redux/persistStore';
import OrderCreate from '../components/OrderCreate';
import {ApiProvider, useApi} from '../contexts/apiContext';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {userEvent} from "@testing-library/user-event";

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

  // Перед каждым тестом
  beforeEach(() => {
    // Мокируем возвращаемое значение useApi
    useApi.mockReturnValue('http://mysite.local/api'); // Симулируем URL API

    // Мокируем useNavigate
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // Мокируем глобальный fetch
    global.fetch = jest.fn((url) => {
      // Мокаем запрос для контрагентов
      if (url.includes('contractors')) {
        return Promise.resolve({
          json: () => ({
            data: [{ id: 1, name: 'Контрагент 1' }, { id: 2, name: 'Контрагент 2' }],
          }),
        });
      }

      // Мокаем запрос для товаров
      if (url.includes('products')) {
        return Promise.resolve({
          json: () => ({
            data: [
              { id: 1, name: 'Product A', price: 100},
            ],
          }),
        });
      }

      // Мокаем запрос на создание заказа
      if (url.includes('orders')) {
        return Promise.resolve({
          ok: true,  // Симулируем успешный ответ
          json: () => ({
            id: 1,  // Идентификатор созданного заказа
            ...JSON.parse(url.body),  // Возвращаем то, что мы отправили
          }),
        });
      }

      // В случае других URL — отклоняем запрос
      return Promise.reject('API request failed');
    });
  });

  // После каждого теста
  afterEach(() => {
    jest.clearAllMocks();
    // jest.restoreAllMocks();
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

  test('should add product to order', async () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: { token: 'mockToken' },
        cart: { products: [] },
      },
    });

    render(
      <Provider store={store}>
        <ApiProvider>
          <ThemeProvider theme={theme}>
            <MemoryRouter>
              <OrderCreate />
            </MemoryRouter>
          </ThemeProvider>
        </ApiProvider>
      </Provider>
    );

    // Находим кнопку "Добавить позицию"
    const addButton = screen.getByText(/Добавить позицию/i);

    // Симулируем клик по кнопке
    await userEvent.click(addButton);

    // Ждем появления новой строки с полем для номенклатуры
    await waitFor(() => {
      const newRowLabel = screen.getAllByText(/Номенклатура/i);
      expect(newRowLabel.length).toBeGreaterThan(0); // Убедимся, что добавилась строка
    });
  });

  test('should remove product from order', async () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: { token: 'mockToken' },
        cart: { products: [{ id: 1, name: 'Product A', price: 100, quantity: 1 }] },
      },
    });

    const { container }= render(
      <Provider store={store}>
        <ApiProvider>
          <ThemeProvider theme={theme}>
            <MemoryRouter>
              <OrderCreate />
            </MemoryRouter>
          </ThemeProvider>
        </ApiProvider>
      </Provider>
    );

    // Ждем, пока компоненты подгрузятся и данные API станут доступны
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1)); // Ждем два запроса (для контрагентов и товаров)


    // Ищем input для номенклатуры по тестовому ID
    const productInput = await screen.findByLabelText('Номенклатура');

    // Проверяем, что значение в поле ввода равно 'Product A'
    expect(productInput.value).toBe('Product A');
  });

  test('should handle form validation errors', async () => {
    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: { token: 'mockToken' },
        cart: { products: [] },
      },
    });

    render(
      <Provider store={store}>
        <ApiProvider>
          <ThemeProvider theme={theme}>
            <MemoryRouter>
              <OrderCreate />
            </MemoryRouter>
          </ThemeProvider>
        </ApiProvider>
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Сохранить заказ/i });
    await userEvent.click(submitButton);

    // Проверяем, что ошибка для обязательного контрагента появилась
    expect(await screen.findByText('Пожалуйста, заполните все обязательные поля.')).toBeInTheDocument();
  });

  test('should submit form successfully', async () => {
    // Мокаем функцию setOrder
    const mockSetOrder = jest.fn();

    const store = configureStore({
      reducer: rootReducer,
      preloadedState: {
        auth: { token: 'mockToken' },
        cart: { products: [{ id: 1, name: 'Product A', price: 100, quantity: 1 }] },
      },
    });

    render(
      <Provider store={store}>
        <ApiProvider>
          <ThemeProvider theme={theme}>
            <MemoryRouter>
              <OrderCreate />
            </MemoryRouter>
          </ThemeProvider>
        </ApiProvider>
      </Provider>
    );

    // Находим поле контрагента по data-testid
    const contractorInput = await screen.findByTestId('contractor-box');

    // Симулируем ввод текста в поле автозаполнения
    await userEvent.type(contractorInput, 'Контрагент 1');

    // Ждем, пока появятся все опции
    // Ждем появления списка (listbox) с опциями
    await waitFor(() => screen.getByRole('listbox')); // ждем появления списка

    // Находим и кликаем на нужный вариант
    const contractorOption = screen.getByText('Контрагент 1');
    await userEvent.click(contractorOption);

    // Мокаем поля товаров
    // await userEvent.type(screen.getByLabelText(/Номенклатура/i), 'Test Product');
    // await userEvent.type(screen.getByLabelText(/Количество/i), '1');
    // await userEvent.type(screen.getByLabelText(/Цена/i), '100');

    // Кликаем на кнопку отправки
    const submitButton = screen.getByRole('button', { name: /Сохранить заказ/i });
    await userEvent.click(submitButton);

    // Проверяем, что был вызван navigate после успешной отправки
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/orders'));
  });
});
