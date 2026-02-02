import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
import './index.css'
import { BrowserRouter } from 'react-router-dom';
=======
import { BrowserRouter } from 'react-router-dom';
import './index.css'
>>>>>>> b0ab98293bedc6ec51b2aff874dc0d691bf6e534
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
