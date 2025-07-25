import './App.css';
import { Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import React, { useEffect } from 'react';
import { checkAuth, toggleTheme, setTheme } from './authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Admin from './pages/Admin';
import ProblemPage from './pages/ProblemPage';
import AdminPanel from './components/AdminPanel';
import AdminDelete from './components/AdminDelete';
import AdminVideo from './components/AdminVideo';
import AdminUpload from './components/AdminUpload';
import AdminUpdate from './pages/AdminUpdate';
import AdminUpdatePage from './pages/AdminUpdatePage';
import ForgetPassword from './pages/ForgetPassword';

function App() {
  const { isAuthenticated, darkMode, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    dispatch(setTheme(savedTheme === "dark"));
  }, [dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      {/* Toggle Button */}
      <div className=" py-1 bg-gray-100 dark:bg-gray-900 text-center">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="px-4 py-1 rounded bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
        >
          Toggle {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>

      <Routes>
        <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/SignUp" />} />
        <Route path="/Login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/SignUp" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
        <Route path="/Admin" element={isAuthenticated && user?.role === 'admin' ?
          <Admin /> : <Navigate to='/' />} />
        <Route path="/problem/:problemId" element={<ProblemPage />}></Route>
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ?
          <AdminPanel /> : <Navigate to='/' />} />
        <Route path="/admin/update" element={isAuthenticated && user?.role === 'admin' ?
          <AdminUpdate /> : <Navigate to='/' />} />
        <Route path="/admin/update/:problemId" element={isAuthenticated && user?.role === 'admin' ?
          <AdminUpdatePage /> : <Navigate to='/' />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ?
          <AdminDelete /> : <Navigate to='/' />} />
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ?
          <AdminVideo /> : <Navigate to='/' />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ?
          <AdminUpload /> : <Navigate to='/' />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        {/* <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} /> */}

      </Routes>
    </>
  );
}
export default App;
