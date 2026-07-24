import React from 'react';

const ItemCard = ({ item }) => {
  return (
    <div className="card item-card">
      <div className="card-header">
        <span className="badge category-badge">{item.category}</span>
        <span className={`badge status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
      </div>

      <h3 className="card-title">{item.title}</h3>
      <p className="card-desc">{item.description}</p>

      <div className="swap-route">
        <div className="route-city">
          <span className="city-label">Offered In</span>
          <span className="city-name">📍 {item.offered_city}</span>
        </div>
        <div className="route-arrow">➔</div>
        <div className="route-city">
          <span className="city-label">Desired In</span>
          <span className="city-name">✈️ {item.desired_city}</span>
        </div>
      </div>

      <div className="card-footer">
        <span className="owner-tag">Posted by <strong>{item.owner}</strong></span>
        <button className="btn btn-secondary btn-sm">Request Swap</button>
      </div>
    </div>
  );
};

export default ItemCard;
