import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ClientPage from './components/ClientPage';
import ClientRegister from './components/ClientRegister';
import ClientLogin from './components/ClientLogin';
import RequestPage from './components/RequestPage';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import useToken from './util/useToken';

const App = () => {
  const { token, removeToken, setToken} = useToken();

  return (
    <BrowserRouter>
      <Header removeToken={removeToken} />
      <Routes>
        <Route path="/home" element={<HomePage/>} />
        <Route path="/clients" element={<ClientPage/>} />
        <Route path="/register" element={<ClientRegister />} />
        <Route path="/login" element={<ClientLogin setToken={setToken} />} />
        <Route path="/request" element={<RequestPage />} />
        <Route 
          path="/dashboard" 
          element={
            token!=="" && token!==null ? (
              <Dashboard />
            ) : (
              <Navigate to="/home" />
            )
          } 
        />
        <Route path="*" element={<Navigate to="/home" />} />
        <Route path="/loading" element={<LoadingScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
