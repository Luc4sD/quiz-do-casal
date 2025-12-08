import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-4">Página Não Encontrada</h2>
      <p className="text-xl text-muted-foreground mb-8">Oops! A página que você está procurando não existe.</p>
      <Link to="/" className="btn-romantic">Voltar para o Início</Link>
    </main>
  );
};

export default NotFound;