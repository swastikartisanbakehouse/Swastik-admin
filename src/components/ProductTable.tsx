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
              <th>Product</th>
              <th>SKU</th>
              <th>Sector & Category</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const isOutOfStock = !product.is_available || product.stock_quantity === 0;
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
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{product.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {product.brand || 'Swastik'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>
                      {product.sku}
                    </code>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{sectorDisplayName}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {product.subcategory_name || product.category_name || 'Item'}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                      ₹{hasDiscount ? product.discount_price : product.price}
                    </div>
                    {hasDiscount && (
                      <div style={{ fontSize: '11px', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                        ₹{product.price}
                      </div>
                    )}
                  </td>
                  <td>{product.unit}</td>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        color: isOutOfStock ? 'var(--danger)' : product.stock_quantity <= 50 ? 'var(--warning)' : 'var(--text-main)',
                      }}
                    >
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge badge-stock ${isOutOfStock ? 'out' : product.stock_quantity <= 50 ? 'low' : ''}`}
                    >
                      {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                    </span>
                  </td>
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
