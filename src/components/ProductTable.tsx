import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import type { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStock?: (product: Product) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onView,
  onEdit,
  onDelete,
}) => {
  const fallbackImage = '/assets/logo.png';

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Availability</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isAvailable = product.is_available;
              const isOutOfStock = !isAvailable || product.stock_quantity === 0;
              const isLowStock = isAvailable && product.stock_quantity > 0 && product.stock_quantity < 50;

              const hasDiscount =
                product.discount_price && parseFloat(product.discount_price) < parseFloat(product.price);
              const sectorDisplayName =
                product.category_sector ||
                product.category_name ||
                product.category_detail?.sector_display ||
                product.category_detail?.name ||
                'General';

              return (
                <tr key={product.id}>
                  {/* 1. Product Name */}
                  <td>
                    <div className="table-product-cell">
                      <img
                        src={product.image || fallbackImage}
                        alt={product.name}
                        className="table-thumbnail"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = fallbackImage;
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {product.brand || 'Swastik'} • {product.unit}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 2. SKU */}
                  <td>
                    <code style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                      {product.sku}
                    </code>
                  </td>

                  {/* 3. Category */}
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{sectorDisplayName}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {product.subcategory_name || product.category_name || 'General'}
                    </div>
                  </td>

                  {/* 4. Price */}
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '14px' }}>
                      ₹{hasDiscount ? product.discount_price : product.price}
                    </div>
                    {hasDiscount && (
                      <div style={{ fontSize: '11px', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                        ₹{product.price}
                      </div>
                    )}
                  </td>

                  {/* 5. Stock */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '13.5px',
                          color: isOutOfStock
                            ? 'var(--danger)'
                            : isLowStock
                            ? 'var(--warning)'
                            : 'var(--text-main)',
                        }}
                      >
                        {product.stock_quantity}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                        {product.unit}
                      </span>
                    </div>
                  </td>

                  {/* 6. Availability */}
                  <td>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: isAvailable ? 'var(--success-bg)' : 'var(--danger-bg)',
                        color: isAvailable ? 'var(--success)' : 'var(--danger)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: isAvailable ? 'var(--success)' : 'var(--danger)',
                        }}
                      />
                      {isAvailable ? 'Available' : 'Disabled'}
                    </span>
                  </td>

                  {/* 7. Status */}
                  <td>
                    <span
                      className={`badge badge-stock ${
                        isOutOfStock ? 'out' : isLowStock ? 'low' : ''
                      }`}
                      style={{ fontSize: '11.5px' }}
                    >
                      {isOutOfStock
                        ? 'Out of Stock'
                        : isLowStock
                        ? 'Low Stock (< 50)'
                        : 'In Stock (≥ 50)'}
                    </span>
                  </td>

                  {/* 8. Actions */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        className="btn btn-secondary btn-icon"
                        onClick={() => onView(product)}
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="btn btn-secondary btn-icon"
                        onClick={() => onEdit(product)}
                        title="Edit Product"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn btn-danger-outline btn-icon"
                        onClick={() => onDelete(product)}
                        title="Delete Product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
