import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import apiClient from '../api/axiosInstance'
import {
  Button,
  Box,
  MenuItem, FormControl, InputLabel, Select,
} from '@mui/material';
import {useApi} from '../contexts/apiContext';
import UserRoleList from "./UserRoleList";

const UserRoleManager = ({user, setUser}) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const baseUrl = useApi();
  const [contractorOptions, setContractorOptions] = useState([]);
  const [loadingContractors, setLoadingContractors] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [roles, setRoles] = useState([]);

  // const fetchContractors = async (search = '') => {
  //   setLoadingContractors(true);
  //   try {
  //     const headers = token ? {Authorization: `Bearer ${token}`} : {};
  //     const response = await fetch(`${baseUrl}/contractors?search=${search}`, {
  //       method: 'GET',
  //       headers,
  //     });
  //     const result = await response.json();
  //     setContractorOptions(result.data);
  //   } catch {
  //     setContractorOptions([]);
  //   } finally {
  //     setLoadingContractors(false);
  //   }
  // };

  // const debouncedFetchContractors = React.useCallback(
  //   debounce((value) => fetchContractors(value), 1000)
  // );
  //
  // const handleContractorSearch = (event, value) => {
  //   debouncedFetchContractors(value);
  // };

  const handleChangeRole = (event) => {
    const selectedValue = event.target.value;
    setSelectedRole(selectedValue);
  };

  const handleAddRole = async () => {
    setIsUpdating(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      const response = await apiClient.post(`${baseUrl}/users/${user.id}/roles`,
        {
          role_id: selectedRole.id,
        },
        {headers}
      );

      if (response.status === 200) {
        setUser(response.data)
      }
    } catch (error) {
      setError('Не удалось добавить роль. Попробуйте снова.');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await apiClient.get(`${baseUrl}/roles`, {headers});
        setRoles(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке ролей:', error);
      }
    };

    fetchRoles();
  }, [token, baseUrl]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column', // Устанавливает вертикальный флекс
        gap: 2,
        justifyContent: 'space-between', // Распределяет дочерние элементы по вертикали
        width: '100%', // На всю ширину
        mt: 1,
      }}
    >
      <UserRoleList user={user} setUser={setUser}/>
      <Box sx={{display: 'flex', gap: 2, mb: 2, width: '100%'}}>
        <FormControl fullWidth error={!selectedRole && error}>
          <InputLabel id="role-label">Роль *</InputLabel>
          <Select
            labelId="role-label"
            value={selectedRole}
            onChange={handleChangeRole}
            label="Роль *"
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role}>
                {role.display_name}
              </MenuItem>
            ))}
          </Select>
          {!selectedRole && error && (
            <Box component="span" sx={{color: 'error.main', mt: 1}}>
              Выберите роль
            </Box>
          )}
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddRole}
          sx={{
            whiteSpace: 'nowrap', // Для предотвращения переноса текста
            width: '150px', // Ширина кнопки
          }}
          disabled={isUpdating} // Заблокировать кнопку, если isUpdating === true
        >
          {isUpdating ? 'Обновление' : 'Добавить'} {/* Изменить текст в зависимости от isUpdating */}
        </Button>
      </Box>
    </Box>
  );
};

export default UserRoleManager;
