import axios from 'axios';
import { triggerLogoutEvent } from '../events/authEvent';  // Импортируем событие

// Создаём экземпляр Axios
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Укажите базовый URL
  timeout: 5000, // Таймаут для запросов (в мс)
});

// Добавляем интерсептор для обработки ответов
apiClient.interceptors.response.use(
  (response) => {
    // Если всё успешно, просто возвращаем ответ
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Обработка ошибки 401 - редирект на "/home"
      console.warn('Unauthorized! Redirecting to /login...');
      triggerLogoutEvent();  // Вызываем событие логаута
    }
    // Пробрасываем ошибку дальше для обработки
    return Promise.reject(error);
  }
);

export default apiClient;