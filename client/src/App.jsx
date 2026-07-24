import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreateItemModal from './components/CreateItemModal';
import { useSwapItems } from './hooks/useSwapItems';
import './index.css';

function App() {
  const { items, health, loading, error, addItem } = useSwapItems();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateItem = async (newItemData) => {
    await addItem(newItemData);
  };

  return (
    <div className="app-layout">
      <Navbar onOpenCreateModal={() => setIsModalOpen(true)} health={health} />
      
      <HomePage
        items={items}
        loading={loading}
        error={error}
        onOpenCreateModal={() => setIsModalOpen(true)}
      />

      <Footer />

      <CreateItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateItem}
      />
    </div>
  );
}

export default App;
