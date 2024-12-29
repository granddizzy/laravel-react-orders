import React from 'react';
import {Box, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {Link, useLocation} from 'react-router-dom';
import {useSelector} from "react-redux";

function Sidebar({closeDrawer}) {
  const location = useLocation(); // Получаем текущий путь для активного элемента
  const user = useSelector((state) => state.auth.user);
  // Функция для проверки активного пути
  const isActive = (path) => location.pathname === path;

  const hasRole = (role) => user?.roles?.some(r => r.name === role);

  return (
    <Box sx={{width: 240}}>
      <List>
        {/* Главная */}
        <ListItem
          button
          component={Link}
          to="/home"
          sx={{
            backgroundColor: isActive('/home') ? 'lightgray' : 'transparent',
            color: '#1976d2', // всегда голубой цвет
          }}
          onClick={closeDrawer} // Закрытие бокового меню при клике
        >
          <ListItemIcon>
            <HomeIcon/>
          </ListItemIcon>
          <ListItemText primary="Главная"/>
        </ListItem>

        {/* Заказы */}
        <ListItem
          button
          component={Link}
          to="/orders"
          sx={{
            backgroundColor: isActive('/orders') ? 'lightgray' : 'transparent',
            color: '#1976d2', // всегда голубой цвет
          }}
          onClick={closeDrawer} // Закрытие бокового меню при клике
        >
          <ListItemIcon>
            <ListAltIcon/>
          </ListItemIcon>
          <ListItemText primary="Заказы"/>
        </ListItem>

        {/* Контрагенты */}
        <ListItem
          button
          component={Link}
          to="/clients"
          sx={{
            backgroundColor: isActive('/clients') ? 'lightgray' : 'transparent',
            color: '#1976d2', // всегда голубой цвет
          }}
          onClick={closeDrawer} // Закрытие бокового меню при клике
        >
          <ListItemIcon>
            <PersonIcon/>
          </ListItemIcon>
          <ListItemText primary="Контрагенты"/>
        </ListItem>

        {/* Номенклатура */}
        <ListItem
          button
          component={Link}
          to="/products"
          sx={{
            backgroundColor: isActive('/products') ? 'lightgray' : 'transparent',
            color: '#1976d2', // всегда голубой цвет
          }}
          onClick={closeDrawer} // Закрытие бокового меню при клике
        >
          <ListItemIcon>
            <CategoryIcon/>
          </ListItemIcon>
          <ListItemText primary="Номенклатура"/>
        </ListItem>

        {/* Пользователи */}
        {hasRole('admin') ? (
          <ListItem
            button
            component={Link}
            to="/users"
            sx={{
              backgroundColor: isActive('/users') ? 'lightgray' : 'transparent',
              color: '#1976d2', // всегда голубой цвет
            }}
            onClick={closeDrawer} // Закрытие бокового меню при клике
          >
            <ListItemIcon>
              <PersonOutlineIcon/>
            </ListItemIcon>
            <ListItemText primary="Пользователи"/>
          </ListItem>
        ) : null}
      </List>
    </Box>
  );
}

export default Sidebar;
