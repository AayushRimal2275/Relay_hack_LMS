import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ React rendered successfully');
} catch (e) {
  console.error('❌ React render error:', e);
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; color: red; background: #111827;">
      <h1>❌ React Error</h1>
      <pre style="fontSize: 12px; whiteSpace: pre-wrap;">${JSON.stringify(e, null, 2)}</pre>
    </div>
  `;
}
