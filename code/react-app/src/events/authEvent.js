// Используем событие для передачи команды логаута
export const triggerLogoutEvent = () => {
  const event = new Event('logout');
  window.dispatchEvent(event);
};