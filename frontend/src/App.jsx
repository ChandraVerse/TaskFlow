import React, { useEffect, useState } from 'react'
import { Outlet, Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import  Layout from './components/Layout';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import Dashboard from './pages/Dashboard';
import PendingPage from './pages/PendingPage';
import CompletePage from './pages/CompletePage';

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      return JSON.parse(storedUser);
    }
    return null;
  });

  useEffect(() => {
    if(currentUser){
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    else {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
  }, [currentUser])

  const handleAuthSubmit = data => {
    const user = {
      email: data.email,
      name: data.name || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
    }
    setCurrentUser(user);
    localStorage.setItem('token', data.token);
    navigate('/', { replace: true })
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    navigate('/login', { replace: true });
  }

  const ProtectedLayout = () => (
      <Layout user={currentUser} onLogout={handleLogout} >
        <Outlet />
      </Layout>
  )

  return (
    <Routes>
      <Route path="/login" element={<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center
      justify-center'>
        <Login onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/signup')} />
      </div>} />

      <Route path="/signup" element={<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center
      justify-center'>
        <SignUp onSubmit={handleAuthSubmit} onSwitchMode={() => navigate('/login')} />
      </div>} />
      <Route element={currentUser ? <ProtectedLayout /> :
        <Navigate to='/login' replace />}>
          <Route path='/' element={ <Dashboard user={currentUser} onLogout={handleLogout} />} />
          <Route path='/pending' element={<PendingPage />} />
          <Route path='/complete' element={<CompletePage />} />
          <Route path='/profile' element={ <Profile user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout} />} />
        </Route>
        <Route path='*' element = { <Navigate to={currentUser ? '/' : '/login' } replace />} />
      </Routes>
  )
}

export default App
