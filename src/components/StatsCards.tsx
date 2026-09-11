import React from 'react';
import { Package, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import type { Product, Category } from '../types';

interface StatsCardsProps {
  products: Product[];
  categories: Category[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ products, categories }) => {
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.is_available && p.stock_quantity >= 50).length;
  const lowStockProducts = products.filter((p) => p.is_available && p.stock_quantity > 0 && p.stock_quantity < 50).length;
  const outOfStockProducts = products.filter((p) => !p.is_available || p.stock_quantity === 0).length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <h4>Total Products</h4>
          <div className="stat-value">{totalProducts}</div>
          <div className="stat-sub">Across {categories.length || 4} Business Sectors</div>
        </div>
        <div className="stat-icon">
          <Package size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <h4>In-Stock (≥ 50)</h4>
          <div className="stat-value">{inStockProducts}</div>
          <div className="stat-sub">Normal stock available</div>
        </div>
        <div className="stat-icon green">
          <CheckCircle2 size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <h4>Low Stock (&lt; 50)</h4>
          <div className="stat-value">{lowStockProducts}</div>
          <div className="stat-sub">{outOfStockProducts} Out of stock</div>
        </div>
        <div className="stat-icon orange">
          <AlertTriangle size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <h4>Active Sectors</h4>
          <div className="stat-value">{categories.length || 4}</div>
          <div className="stat-sub">Bakery, Dairy, Sweets, Confectionery</div>
        </div>
        <div className="stat-icon">
          <Layers size={22} />
        </div>
      </div>
    </div>
  );
};
