import React from 'react';
import { Package, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import type { Product, Category } from '../types';

interface StatsCardsProps {
  products: Product[];
  categories: Category[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ products, categories }) => {
  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.is_available && p.stock_quantity > 0).length;
  const lowStockProducts = products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 50).length;
  const outOfStockProducts = products.filter((p) => !p.is_available || p.stock_quantity === 0).length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <h4>Total Catalog</h4>
          <div className="stat-value">{totalProducts}</div>
          <div className="stat-sub">Across 4 Product Sectors</div>
        </div>
        <div className="stat-icon">
          <Package size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <h4>Active & In-Stock</h4>
          <div className="stat-value">{inStockProducts}</div>
          <div className="stat-sub">Ready for customer ordering</div>
        </div>
        <div className="stat-icon green">
          <CheckCircle2 size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <h4>Low / Out of Stock</h4>
          <div className="stat-value">{lowStockProducts + outOfStockProducts}</div>
          <div className="stat-sub">{lowStockProducts} Low • {outOfStockProducts} Out of stock</div>
        </div>
        <div className="stat-icon orange">
          <AlertTriangle size={22} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <h4>Active Sectors</h4>
          <div className="stat-value">{categories.length}</div>
          <div className="stat-sub">Bakery, Dairy, Sweets, Confectionery</div>
        </div>
        <div className="stat-icon">
          <Layers size={22} />
        </div>
      </div>
    </div>
  );
};
