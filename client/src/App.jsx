import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/postRoutes.jsx';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useEffect } from 'react';
import { checkAuth } from './store/auth.js';

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth()); // restore session on page load
  }, [dispatch])

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <ToastContainer position="top-right" autoClose={2000} />
        <main className="content">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
