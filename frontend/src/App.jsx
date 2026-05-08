import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AppRouter from './router';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="main-content" style={{ padding: 0 }}>
          <AppRouter />
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
