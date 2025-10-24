import React from 'react';
import { useAuth } from './context/AuthContext';
import Board from './components/Board';
import AuthLayout from './components/AuthLayout';

function App() {
  const { user, loading } = useAuth();

  // Mostra um loading global enquanto o AuthContext verifica o token
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
      {/* Se o usuário estiver logado, mostra o Kanban (Board). Senão, mostra a página de Autenticação */}
      {user ? <Board /> : <AuthLayout />}
    </div>
  );
}

export default App;