import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ClientPage from './components/ClientPage';
import ClientRegister from './components/ClientRegister';

const App = () => {
  return (
    <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="home" element={<HomePage/>} />
          <Route path="clients" element={<ClientPage/>} />
          <Route path="register" element={<ClientRegister/>} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
