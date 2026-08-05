import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import CreateItemModal from './components/CreateItemModal';
import { useSwapItems } from './hooks/useSwapItems';
import { Agentation } from 'agentation';
import './index.css';
import './App.css';

function App() {
  const { items, health, loading, error, addItem } = useSwapItems();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans relative overflow-x-hidden">
      <Navbar onOpenCreateModal={handleOpenModal} health={health} />

      <HomePage
        items={items}
        loading={loading}
        error={error}
        onOpenCreateModal={handleOpenModal}
      />

      <Footer />

      <CreateItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={addItem}
      />

      {/* Agentation Visual Feedback & Annotation Toolbar */}
      {import.meta.env.DEV && <Agentation />}
    </div>
  );
}

export default App;
