import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/postRoutes.jsx';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { BrowserRouter } from 'react-router-dom';

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
      <Navbar />
      <AppRoutes />
      <Footer />
      </BrowserRouter>
    </ Provider>

  )
}

export default App
