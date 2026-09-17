import React, { useState } from 'react';
import { Package, CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { LowStockModal } from './LowStockModal';
import type { Product, Category } from '../types';

interface StatsCardsProps {
  products: Product[];
  categories: Category[];
  onEditProduct?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  products,
  categories,
  onEditProduct,
  onViewProduct,
}) => {
  const [isLowStockModalOpen, setIsLowStockModalOpen] = useState(false);

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.is_available && p.stock_quantity >= 50).length;

  // Filter low stock (< 50 or unavailable)
  const lowStockList = products
    .filter((p) => !p.is_available || p.stock_quantity < 50)
    .sort((a, b) => a.stock_quantity - b.stock_quantity);

  const lowStockCount = lowStockList.length;
  const outOfStockProducts = lowStockList.filter((p) => !p.is_available || p.stock_quantity === 0).length;

  // Top 3 lowest stock products
  const top3LowStock = lowStockList.slice(0, 3);

  return (
    <>
      <div className="stats-grid">
        {/* 1. Total Products */}
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

        {/* 2. In-Stock (>= 50) */}
        <div className="stat-card">
          <div className="stat-info">
            <h4>In-Stock (≥ 50)</h4>
            <div className="stat-value text-success">{inStockProducts}</div>
            <div className="stat-sub">Normal stock available</div>
          </div>
          <div className="stat-icon green">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* 3. Low Stock (< 50) - Wider Tile with Top 3 items & Modal trigger */}
        <div
          className="stat-card stat-card-wide stat-card-clickable"
          onClick={() => setIsLowStockModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsLowStockModalOpen(true);
            }
          }}
          title="Click to inspect all low stock products"
        >
          {/* Main Stat Metric */}
          <div className="stat-card-left">
            <div className="stat-info">
              <div className="stat-card-title-row">
                <h4>Low Stock (&lt; 50)</h4>
                <span className="stat-inspect-pill">
                  Inspect <ChevronRight size={11} />
                </span>
              </div>
              <div className="stat-value text-warning">{lowStockCount}</div>
              <div className="stat-sub">
                {outOfStockProducts > 0 ? (
                  <span style={{ color: 'var(--danger)', fontWeight: 700 }}>
                    {outOfStockProducts} Out of stock
                  </span>
                ) : (
                  <span>Restock needed soon</span>
                )}
              </div>
            </div>
            <div className="stat-icon orange">
              <AlertTriangle size={22} />
            </div>
          </div>

          {/* Top 3 Low Stock Products List */}
          <div className="stat-card-top-products">
            <div className="top-products-header">
              <span className="top-products-title">Lowest In Stock:</span>
              <span className="top-products-count">{top3LowStock.length} items</span>
            </div>

            {top3LowStock.length > 0 ? (
              <div className="top-products-list">
                {top3LowStock.map((p) => {
                  const isOutOfStock = !p.is_available || p.stock_quantity === 0;
                  return (
                    <div key={p.id} className="top-product-item">
                      <span className="top-product-name" title={p.name}>
                        {p.name}
                      </span>
                      <span
                        className={`top-product-stock-tag ${
                          isOutOfStock ? 'tag-danger' : 'tag-warning'
                        }`}
                      >
                        {isOutOfStock ? '0 Out' : `${p.stock_quantity} left`}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="top-products-empty">
                <CheckCircle2 size={14} color="var(--success)" />
                <span>All stocks healthy (≥ 50)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal opening when Low Stock card is clicked */}
      <LowStockModal
        isOpen={isLowStockModalOpen}
        onClose={() => setIsLowStockModalOpen(false)}
        products={products}
        categories={categories}
        onEditProduct={onEditProduct}
        onViewProduct={onViewProduct}
      />
    </>
  );
};
