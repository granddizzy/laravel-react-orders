import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, BrowserRouter as Router, Routes} from "react-router-dom";
import Header from "./components/Header";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  ThemeProvider,
  createTheme,
  Toolbar,
  Typography,
  useMediaQuery
} from "@mui/material";
import Content from "./components/Content";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Contractors from "./components/Contractors";

const baseUrl = "";

function App() {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('sm')); // Определяем десктоп

  return (
    <Router>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          {isDesktop && (
            <Box component="nav" sx={{ width: 240, flexShrink: 0 }}>
              <Sidebar />
            </Box>
          )}
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              {/* Здесь определяются маршруты для разных страниц */}
              <Route path="/home" element={<Home />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/clients" element={<Contractors />} />
              <Route path="/catalog" element={<Products />} />
              {/* Главная страница по умолчанию */}
              <Route path="/" element={<Home />} />
            </Routes>
          </Box>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
