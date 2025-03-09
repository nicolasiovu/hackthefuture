import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ClientPage from './components/ClientPage';
import ClientRegister from './components/ClientRegister';
import ClientLogin from './components/ClientLogin';
import useToken from './util/useToken';

const App = () => {
  const { token, removeToken, setToken} = useToken();

  return (
    <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="home" element={<HomePage/>} />
          <Route path="clients" element={<ClientPage/>} />
          <Route path="register" element={<ClientRegister />} />
          <Route path="login" element={<ClientLogin setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
