import React from 'react';
import {Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import Footer from "./Footer";
import Content from "./Content";
import {Link} from "react-router-dom";

function Sidebar() {
  return (
    <Box sx={{ width: 240 }}>
      <List>
        {/* Главная */}
        <ListItem button component={Link} to="/home"> {/* Используем Link для маршрутизации */}
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Главная" />
        </ListItem>

        {/* Заказы */}
        <ListItem button component={Link} to="/orders"> {/* Используем Link для маршрутизации */}
          <ListItemIcon><ListAltIcon /></ListItemIcon>
          <ListItemText primary="Заказы" />
        </ListItem>

        {/* Контрагенты */}
        <ListItem button component={Link} to="/clients"> {/* Используем Link для маршрутизации */}
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary="Контрагенты" />
        </ListItem>

        {/* Номенклатура */}
        <ListItem button component={Link} to="/catalog"> {/* Используем Link для маршрутизации */}
          <ListItemIcon><CategoryIcon /></ListItemIcon>
          <ListItemText primary="Номенклатура" />
        </ListItem>
      </List>
    </Box>
  );
}

export default Sidebar;
