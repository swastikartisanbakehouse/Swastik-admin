import React, { useState, useMemo } from 'react';
import {
  X,
  AlertTriangle,
  Search,
  Edit3,
  Eye,
  CheckCircle2,
  ArrowUpDown,
} from 'lucide-react';
import logo from '../assets/logo.png';
import type { Product, Category } from '../types';

interface LowStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  onEditProduct?: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
}

export const LowStockModal: React.FC<LowStockModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  onEditProduct,
  onViewProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'OUT' | 'CRITICAL' | 'MODERATE'>('ALL');
  const [sortBy, setSortBy] = useState<'STOCK_ASC' | 'STOCK_DESC' | 'NAME_ASC'>('STOCK_ASC');

  // Category map helper (Hook called unconditionally)
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat) => map.set(cat.id, cat.name));
    return map;
  }, [categories]);

  if (!isOpen) return null;

  // Filter all low stock items (< 50 or unavailable)
  const allLowStock = products.filter((p) => !p.is_available || p.stock_quantity < 50);

  const outOfStockList = allLowStock.filter((p) => !p.is_available || p.stock_quantity === 0);
  const criticalStockList = allLowStock.filter(
    (p) => p.is_available && p.stock_quantity > 0 && p.stock_quantity <= 10
  );
  const moderateLowStockList = allLowStock.filter(
    (p) => p.is_available && p.stock_quantity > 10 && p.stock_quantity < 50
  );

  // Filtered & Sorted list
  const filteredProducts = allLowStock
    .filter((p) => {
      // Type filter
      if (filterType === 'OUT') {
        if (p.is_available && p.stock_quantity > 0) return false;
      } else if (filterType === 'CRITICAL') {
        if (!p.is_available || p.stock_quantity === 0 || p.stock_quantity > 10) return false;
      } else if (filterType === 'MODERATE') {
        if (!p.is_available || p.stock_quantity <= 10) return false;
      }

      // Search filter
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      const catName = categoryMap.get(p.category) || p.category_name || '';
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        catName.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'STOCK_ASC') {
        return a.stock_quantity - b.stock_quantity;
      } else if (sortBy === 'STOCK_DESC') {
        return b.stock_quantity - a.stock_quantity;
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog low-stock-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '860px' }}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706',
                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.15)',
              }}
            >
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                  Low Stock Inventory Alerts
                </h3>
                <span className="low-stock-count-pill">{allLowStock.length} items</span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Products with stock quantities below 50 units requiring restocking attention
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ gap: '16px' }}>
          {/* Quick Statistics Summary Chips */}
          <div className="low-stock-summary-bar">
            <button
              type="button"
              className={`low-stock-chip ${filterType === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterType('ALL')}
            >
              <span>All Low Stock</span>
              <span className="chip-badge">{allLowStock.length}</span>
            </button>
            <button
              type="button"
              className={`low-stock-chip out-chip ${filterType === 'OUT' ? 'active' : ''}`}
              onClick={() => setFilterType('OUT')}
            >
              <span>Out of Stock (0)</span>
              <span className="chip-badge danger">{outOfStockList.length}</span>
            </button>
            <button
              type="button"
              className={`low-stock-chip crit-chip ${filterType === 'CRITICAL' ? 'active' : ''}`}
              onClick={() => setFilterType('CRITICAL')}
            >
              <span>Critical (1-10)</span>
              <span className="chip-badge warning">{criticalStockList.length}</span>
            </button>
            <button
              type="button"
              className={`low-stock-chip mod-chip ${filterType === 'MODERATE' ? 'active' : ''}`}
              onClick={() => setFilterType('MODERATE')}
            >
              <span>Moderate (11-49)</span>
              <span className="chip-badge neutral">{moderateLowStockList.length}</span>
            </button>
          </div>

          {/* Search & Sort Toolbar */}
          <div className="low-stock-toolbar">
            <div className="search-box" style={{ flex: 1 }}>
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Filter by product name, SKU, category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '13px', padding: '9px 12px 9px 36px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ArrowUpDown size={13} />
                Sort:
              </span>
              <select
                className="form-input"
                style={{ width: 'auto', padding: '7px 12px', fontSize: '12.5px' }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="STOCK_ASC">Lowest Stock First</option>
                <option value="STOCK_DESC">Highest Stock First</option>
                <option value="NAME_ASC">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Product Items Table / List */}
          {filteredProducts.length > 0 ? (
            <div className="low-stock-table-container">
              <table className="low-stock-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'center' }}>Stock Level</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const isOutOfStock = !p.is_available || p.stock_quantity === 0;
                    const isCritical = p.is_available && p.stock_quantity > 0 && p.stock_quantity <= 10;
                    const catName = categoryMap.get(p.category) || p.category_name || 'Standard';

                    return (
                      <tr key={p.id} className="low-stock-table-row">
                        {/* Product info with image */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={p.image || logo}
                              alt={p.name}
                              className="low-stock-thumb"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = logo;
                              }}
                            />
                            <div>
                              <div className="low-stock-pname" title={p.name}>
                                {p.name}
                              </div>
                              <div className="low-stock-psku">
                                SKU: {p.sku} {p.brand ? `• ${p.brand}` : ''}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td>
                          <span className="low-stock-cat-pill">{catName}</span>
                        </td>

                        {/* Price */}
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-main)' }}>
                            ₹{parseFloat(p.price || '0').toFixed(2)}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            per {p.unit || 'unit'}
                          </div>
                        </td>

                        {/* Stock Level with colored badge */}
                        <td style={{ textAlign: 'center' }}>
                          <div className="low-stock-meter-cell">
                            <span
                              className={`stock-indicator-badge ${
                                isOutOfStock
                                  ? 'badge-danger'
                                  : isCritical
                                  ? 'badge-warning-crit'
                                  : 'badge-warning-mod'
                              }`}
                            >
                              {isOutOfStock
                                ? '0 Out of Stock'
                                : `${p.stock_quantity} left (${isCritical ? 'Critical' : 'Low'})`}
                            </span>
                            {/* Visual Progress Bar */}
                            <div className="stock-progress-bar">
                              <div
                                className={`stock-progress-fill ${
                                  isOutOfStock
                                    ? 'fill-danger'
                                    : isCritical
                                    ? 'fill-critical'
                                    : 'fill-mod'
                                }`}
                                style={{
                                  width: `${Math.min(100, Math.max(4, (p.stock_quantity / 50) * 100))}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Actions */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                            {onEditProduct && (
                              <button
                                className="btn btn-primary btn-sm"
                                style={{ padding: '5px 10px', fontSize: '12px', gap: '4px' }}
                                onClick={() => {
                                  onClose();
                                  onEditProduct(p);
                                }}
                                title="Restock & Edit Product"
                              >
                                <Edit3 size={13} />
                                <span>Restock</span>
                              </button>
                            )}

                            {onViewProduct && (
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ padding: '5px 8px', fontSize: '12px' }}
                                onClick={() => {
                                  onClose();
                                  onViewProduct(p);
                                }}
                                title="View Product Details"
                              >
                                <Eye size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="low-stock-empty-state">
              <div className="empty-state-icon-box">
                <CheckCircle2 size={32} color="var(--success)" />
              </div>
              <h4 style={{ margin: '8px 0 4px 0', fontSize: '16px', fontWeight: 700 }}>
                {allLowStock.length === 0
                  ? 'All Product Stock Levels are Healthy!'
                  : 'No Products Match Your Filter'}
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
                {allLowStock.length === 0
                  ? 'Every product in the catalog currently has 50 or more units in inventory.'
                  : 'Try clearing your search query or selecting "All Low Stock".'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredProducts.length}</strong> of{' '}
            <strong>{allLowStock.length}</strong> low stock items
          </div>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
