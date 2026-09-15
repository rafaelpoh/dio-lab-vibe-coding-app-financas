// src/main.tsx - Ponto de Entrada da Aplicação React 18+
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/reset.css';
import './styles/tokens.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento raiz (#root) não foi encontrado no documento HTML.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
