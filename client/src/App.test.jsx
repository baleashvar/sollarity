import React from 'react';

// Simple test component to check if React is working
const TestApp = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red' }}>TEST - React is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <p>The white screen issue might be due to:</p>
      <ul>
        <li>CSS/Tailwind not loading properly</li>
        <li>JavaScript errors in components</li>
        <li>API connection issues</li>
        <li>Missing environment variables</li>
      </ul>
    </div>
  );
};

export default TestApp;