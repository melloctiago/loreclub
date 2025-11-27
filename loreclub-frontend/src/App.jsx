import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Board from './components/Board';
import AuthLayout from './components/AuthLayout';
import AdminAchievements from './pages/AdminAchievements';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-lore-bg text-gray-100 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-lore-purple-md">
          Carregando a Guilda...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lore-bg text-gray-100 font-sans">
      <Router>
        <Routes>
          <Route path="/" element={user ? <Board /> : <AuthLayout />} />
          <Route
            path="/admin/conquistas"
            element={user ? <AdminAchievements /> : <Navigate to="/" replace />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;