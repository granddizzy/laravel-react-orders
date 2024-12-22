import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom'; // Добавляем MemoryRouter
import configureStore from 'redux-mock-store';
import OrdersList from '../components/OrdersList';
import { fetchOrders } from '../redux/ordersSlice';

jest.mock('../redux/ordersSlice', () => ({
  fetchOrders: jest.fn(),
}));

const mockStore = configureStore([]);

test('renders orders from Redux store', async () => {
  const store = mockStore({
    orders: {
      orders: [
        {
          id: 1,
          contractor: { name: 'Контрагент 1' },
          status: 'pending',
          total_amount: '1000',
          notes: 'Примечание 1',
        },
      ],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
    },
  });

  fetchOrders.mockResolvedValue({
    data: [
      { id: 1, contractor: { name: 'Контрагент 1' }, status: 'pending' },
    ],
  });

  render(
    <MemoryRouter> {/* Оборачиваем в MemoryRouter */}
      <Provider store={store}>
        <OrdersList loading={false} />
      </Provider>
    </MemoryRouter>
  );

  // Проверяем, что заказы отображаются
  await waitFor(() => {
    expect(screen.getByText(/Контрагент 1/i)).toBeInTheDocument();
    expect(screen.getByText(/1000/i)).toBeInTheDocument();
    expect(screen.getByText(/Примечание 1/i)).toBeInTheDocument();
  });
});
