import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import apiClient from '../api/axiosInstance'
import {
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import {useApi} from '../contexts/apiContext';
import UserContractorsList from "./UserContractorsList";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "lodash.debounce";

const UserContractorManager = ({user, setUser}) => {
  // Получаем данные пользователя из Redux
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  // Используем контекст для базового URL API
  const baseUrl = useApi();
  const [contractorOptions, setContractorOptions] = useState([]);
  const [loadingContractors, setLoadingContractors] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Сообщение об успешном обновлении
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchContractors = async (search = '') => {
    setLoadingContractors(true);
    try {
      const headers = token ? {Authorization: `Bearer ${token}`} : {};
      const response = await fetch(`${baseUrl}/contractors?search=${search}`, {
        method: 'GET',
        headers,
      });
      const result = await response.json();
      setContractorOptions(result.data);
    } catch {
      setContractorOptions([]);
    } finally {
      setLoadingContractors(false);
    }
  };

  const debouncedFetchContractors = React.useCallback(
    debounce((value) => fetchContractors(value), 1000)
  );

  const handleContractorSearch = (event, value) => {
    debouncedFetchContractors(value);
  };

  const handleAddContractor = async () => {
    setIsUpdating(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const response = await apiClient.post(`${baseUrl}/users/${user.id}/contractors`,
        {
          contractor_id: selectedContractor.id,
        },
        {headers}
      );

      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      setError('Не удалось добавить контрагента. Попробуйте снова.');
    } finally {
      setIsUpdating(false);
    }
  };

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
      <UserContractorsList user={user} setUser={setUser}/>
      <Box sx={{display: 'flex', gap: 2, mb: 2, width: '100%'}}>
        <Autocomplete
          data-testid="contractor-box"
          options={contractorOptions}
          getOptionLabel={(option) => option.name}
          onInputChange={handleContractorSearch}
          onChange={(event, value) => {
            setSelectedContractor(value || null);
          }}
          loading={loadingContractors}
          sx={{flex: 1}}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Контрагент *"
              fullWidth
              error={!selectedContractor && error} // Подсветка ошибки
              helperText={!selectedContractor && error ? 'Выберите контрагента' : ''}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingContractors ? <CircularProgress size={20}/> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddContractor}
          sx={{
            whiteSpace: 'nowrap', // Для предотвращения переноса текста
            width: '150px', // Ширина кнопки
          }} // Для предотвращения переноса текста
          disabled={isUpdating} // Заблокировать кнопку, если isUpdating === true
        >
          {isUpdating ? 'Обновление' : 'Добавить'} {/* Изменить текст в зависимости от isUpdating */}
        </Button>
      </Box>
    </Box>
  );
};

export default UserContractorManager;
