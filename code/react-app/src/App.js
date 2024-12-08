import './App.css';
import {Route, BrowserRouter as Router, Routes, Navigate} from "react-router-dom";
import Header from "./components/Header";
import {
  Box,
  CssBaseline,
  useMediaQuery
} from "@mui/material";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Products from "./components/Products";
import Orders from "./components/Orders";
import Contractors from "./components/Contractors";
import ProductCreate from "./components/ProductCreate";
import ContractorCreate from "./components/ContractorCreate";
import OrderCreate from "./components/OrderCreate";
import Login from "./components/Login";
import {useSelector} from "react-redux";
import Registration from "./components/Registration";
import Profile from "./components/Profile";

const baseUrl = "";

function App() {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('sm')); // Определяем десктоп
  // const [isLoading, setIsLoading] = useState(true);

  const auth = useSelector((state) => state.auth);

  // Проверяем наличие токена сразу при загрузке
  // useEffect(() => {
  //   const checkToken = async () => {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       try {
  //         const response = await fetch('https://example.com/api/validate-token', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${token}`,
  //           },
  //         });
  //         if (response.ok) {
  //           setAuth({token});
  //         } else {
  //           logout(); // Если токен недействителен, выходим
  //         }
  //       } catch (error) {
  //         console.error('Ошибка проверки токена:', error);
  //         logout();
  //       }
  //     }
  //   };
  //
  //   checkToken();
  // }, []);

  // Если приложение еще загружается (проверка токена), показываем что-то вроде загрузки
  // if (isLoading) {
  //   return <div>Загрузка...</div>;
  // }

  return (
    <Router basename={baseUrl}>
      <CssBaseline/>
      <Box sx={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
        <Header/>
        <Box sx={{display: 'flex', flexGrow: 1}}>
          {isDesktop && (
            <Box component="nav" sx={{width: 240, flexShrink: 0}}>
              <Sidebar/>
            </Box>
          )}
          <Box component="main" sx={{flexGrow: 1, p: 3}}>
            <Routes>
              {/* Проверяем, если пользователь не авторизован, редиректим на страницу входа */}
              <Route path="/" element={auth.token ? <Navigate to="/home"/> : <Login/>}/>
              <Route path="/login" element={auth.token ? <Navigate to="/home"/> : <Login/>}/>

              {/* Страницы, которые доступны только авторизованным пользователям */}
              <Route path="/home" element={auth.token ? <Home/> : <Navigate to="/login"/>}/>
              <Route path="/orders" element={auth.token ? <Orders/> : <Navigate to="/login"/>}/>
              <Route path="/clients" element={auth.token ? <Contractors/> : <Navigate to="/login"/>}/>
              <Route path="/catalog" element={auth.token ? <Products/> : <Navigate to="/login"/>}/>
              <Route path="/create-product" element={auth.token ? <ProductCreate/> : <Navigate to="/login"/>}/>
              <Route path="/create-contractor" element={auth.token ? <ContractorCreate/> : <Navigate to="/login"/>}/>
              <Route path="/create-order" element={auth.token ? <OrderCreate/> : <Navigate to="/login"/>}/>

              {/* Регистрация */}
              <Route path="/register" element={<Registration/>}/> {/* Обёрнутый компонент */}
              <Route path="/profile" element={auth.token ? <Profile/> : <Navigate to="/login"/>}/>
            </Routes>
          </Box>
        </Box>
        <Footer/>
      </Box>
    </Router>
  );
}

export default App;
