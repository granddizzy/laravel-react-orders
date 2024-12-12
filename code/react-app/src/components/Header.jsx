import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  Menu, MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Sidebar from "./Sidebar";
import MenuIcon from '@mui/icons-material/Menu';
import { logout } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Проверка на маленький экран

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout()); // Выходим из аккаунта
    navigate("/");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Функция для закрытия бокового меню
  const closeDrawer = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Кнопка для открытия меню на мобильных устройствах, показывается только если пользователь аутентифицирован */}
          {user && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Название приложения */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }} // Скрываем текст на маленьких экранах
          >
            Управление заказами
          </Typography>

          {/* Ссылки в выпадающем меню */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <>
                <Typography
                  variant="body1"
                  noWrap
                  onClick={handleMenuOpen}
                  sx={{ cursor: 'pointer' }}
                >
                  Привет, {user.name}!
                </Typography>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                    Профиль
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleMenuClose();
                    handleLogout();
                  }}>
                    Выйти
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Боковое меню */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Улучшение производительности на мобильных устройствах
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: 240 },
        }}
      >
        <Sidebar closeDrawer={closeDrawer} /> {/* Передаем функцию закрытия бокового меню */}
      </Drawer>
    </>
  );
}

export default Header;
