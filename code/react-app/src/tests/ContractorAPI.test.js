import axios from 'axios';

// Мокаем axios для тестов
jest.mock('axios');

// Определяем API функции прямо в тесте

const fetchContractors = async (token) => {
  const response = await axios.get('/api/contractors', {
    headers: { Authorization: `Bearer ${token}` },
    params: { per_page: 10, page: 1, search: '' },
  });
  return response.data;
};

const createContractor = async (data, token) => {
  const response = await axios.post('/api/contractors', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const getContractor = async (id, token) => {
  const response = await axios.get(`/api/contractors/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const updateContractor = async (id, data, token) => {
  const response = await axios.put(`/api/contractors/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const deleteContractor = async (id, token) => {
  const response = await axios.delete(`/api/contractors/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Теперь тестируем эти функции

describe('API Tests for Contractors', () => {
  const token = '2|TCAWvdUVTFFt59fZWrchntYheoJpkjxCih8HPoF23705d45a'; // Пример токена

  test('fetchContractors should return contractors data from API', async () => {
    const mockResponse = { data: [{ id: 1, name: 'Контрагент 1' }] };

    axios.get.mockResolvedValue(mockResponse); // Мокаем ответ axios

    const result = await fetchContractors(token);
    expect(result).toEqual(mockResponse.data);
    expect(axios.get).toHaveBeenCalledWith('/api/contractors', {
      headers: { Authorization: `Bearer ${token}` },
      params: { per_page: 10, page: 1, search: '' },
    });
  });

  // Аналогичные тесты для других API функций (createContractor, getContractor, updateContractor, deleteContractor)
});
