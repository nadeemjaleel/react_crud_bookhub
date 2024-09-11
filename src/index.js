import React from 'react';
import ReactDOM from 'react-dom/client';
import {Navbar, Footer } from './pages/layout';
import {Home} from './pages/home';
import {Users} from './pages/users';
import {BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<Users />} />
    </Routes>
    <Footer />
    </BrowserRouter>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


