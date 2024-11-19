import React from 'react';
import { Header } from './components/Header';
import { Canvas } from './components/Canvas';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 overflow-hidden">
        <Canvas />
      </main>
    </div>
  );
}

export default App;