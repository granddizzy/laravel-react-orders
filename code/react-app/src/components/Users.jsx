import React, {useEffect} from 'react';
import {
  Typography,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  InputLabel,
  Select,
  MenuItem,
  FormControl
} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import {useApi} from "../contexts/apiContext";
import {Link} from "react-router-dom";
import {fetchUsers, setPageSize} from "../redux/usersSlice";
import UsersList from "./UsersList";
import UsersSearch from "./UsersSearch";

function Users() {
  const dispatch = useDispatch();
  const {loading, currentPage, pageSize, search} = useSelector((state) => state.users);
  const token = useSelector((state) => state.auth.token);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const user = useSelector((state) => state.auth.user);

  const generateQueryParams = () => {
    const params = new URLSearchParams();
    const page = typeof currentPage === 'number' && !isNaN(currentPage) ? currentPage : 1;
    params.append("page", page);
    params.append("per_page", pageSize);
    if (search) params.append("search", search);
    return params.toString();
  };

  const apiUrl = useApi();

  useEffect(() => {
    const queryParams = generateQueryParams();
    dispatch(fetchUsers({
      url: `${apiUrl}/users?${queryParams}`,
      token: token
    }));
  }, [dispatch, currentPage, pageSize, search]);

  const handlePageSizeChange = (event) => {
    dispatch(setPageSize(event.target.value)); // Изменяем размер страницы
  };

  const hasRole = (role) => user?.roles?.some(r => r.name === role);

  return (
    <Box sx={{flexGrow: 1}}>
      <Typography variant="h4" gutterBottom>
        Пользователи
      </Typography>
      <Typography variant="body1" paragraph>
        Здесь отображается список пользователей с их характеристиками.
      </Typography>

      {/* Кнопка и выпадающий список */}
      <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2}}>
        <FormControl sx={{minWidth: 120}}>
          <InputLabel id="page-size-label">На странице</InputLabel>
          <Select
            labelId="page-size-label"
            value={pageSize}
            onChange={handlePageSizeChange}
            label="На странице"
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={40}>40</MenuItem>
            <MenuItem value={60}>60</MenuItem>
            <MenuItem value={80}>80</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <UsersSearch/>
      <UsersList loading={loading}/>
    </Box>
  );
}

export default Users;