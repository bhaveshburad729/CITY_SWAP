import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HomePage from './HomePage';
import CreateItemModal from '../components/CreateItemModal';
import Footer from '../components/Footer';
import { useSwapItems } from '../hooks/useSwapItems';

export default function SwapMarketplacePage() {
  const { items, health, loading, error, addItem } = useSwapItems();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="app-container">
      <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} health={health} />
      <HomePage
        items={items}
        loading={loading}
        error={error}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
      />
      <CreateItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={addItem}
      />
      <Footer />
    </div>
  );
}
