/**
 * LogShield Studio
 * Project Owner: Berkkan Kaya
 * GitHub: https://github.com/kayaberkkan
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

document.addEventListener('contextmenu', (e) => e.preventDefault());
