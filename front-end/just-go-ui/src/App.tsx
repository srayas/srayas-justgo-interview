import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthService } from './service/auth-service';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import { AppDataProvider, useAppData } from './providers/AppProvider'
import Loader from './componets/global/loader';
import VerifyLink from './pages/VerifyLink';

function App() {
  const [appInitialized, setAppInitialized] = useState(false);
  const [ isLoggedIn, setIsLoggedIn] = useState(false)
  const authSvc = new AuthService();
  const {appData,setAppData}= useAppData()
  const navigate = useNavigate();

  useEffect(() => {
    if (appInitialized && !isLoggedIn) {
      authSvc.appInit()
        .then((data) => {
          if (localStorage.getItem('token')) {
            console.log(data)
            setIsLoggedIn(true);
            setAppData(prevState => ({
                    ...prevState,
                    isLoggedIn: true,
                    user:data
                  }));
          }
        })
        .catch(() => {
          console.log("Not logged in, redirecting to login");
          setIsLoggedIn(false);
          navigate('/login');
        });
    }
  }, [appInitialized, isLoggedIn]);

  useEffect(() => {
    setAppInitialized(true)
  }, []);

  if (!appInitialized)
    return (
      <Loader/>
    );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/magic-link/:token" element={<VerifyLink />} />
    </Routes>
  );
}

export default function WrappedApp() {
 
  return (
    <Router>
       <AppDataProvider> 
        <App />
      </AppDataProvider>
      
    </Router>
  );
}
