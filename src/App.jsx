import React from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <Layout />
      </ThemeProvider>
    </ToastProvider>
  );
}

export default App;
