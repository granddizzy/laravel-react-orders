import React, {useState} from 'react';
import {AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography} from '@mui/material';
import Sidebar from "./Sidebar";
import MenuIcon from '@mui/icons-material/Menu';
import {logout} from "../redux/authSlice";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout()); // Выходим из аккаунта
    navigate("/");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{justifyContent: 'space-between'}}>
          {/* Кнопка для открытия меню на мобильных устройствах */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{display: {sm: 'none'}}}
          >
            <MenuIcon/>
          </IconButton>

          {/* Название приложения */}
          <Typography variant="h6" noWrap component="div">
            Управление заказами
          </Typography>

          {/* Ссылки "Профиль" и "Выйти" */}
          <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
            {user && (
              <Typography variant="body1" noWrap>
                Привет, {user.name}!
              </Typography>
            )}
            <Button
              component={Link}
              to="/profile"
              variant="text"
              color="inherit"
            >
              Профиль
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={handleLogout}
            >
              Выйти
            </Button>
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
          display: {xs: 'block', sm: 'none'},
          '& .MuiDrawer-paper': {width: 240},
        }}
      >
        <Sidebar/>
      </Drawer>
    </>
  );
}

export default Header;
