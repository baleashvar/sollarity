import React from 'react';
import ReactDOM from 'react-dom/client';
import './tailwind-output.css';
import './App.css';
import App from './App';
import ErrorBoundary from './components/ui/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);