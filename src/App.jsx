import React from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}

export default App;
