import React from 'react';
import { Eye, Edit2, Trash2, Tag } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStock?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
  const isOutOfStock = !product.is_available || product.stock_quantity === 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 50;
  const hasDiscount = product.discount_price && parseFloat(product.discount_price) < parseFloat(product.price);

  const sectorDisplayName =
    product.category_sector ||
    product.category_name ||
    product.category_detail?.sector_display ||
    product.category_detail?.name ||
    'Swastik';

  const fallbackImage = '/assets/logo.png';

  return (
    <div className="product-card">
      <div className="card-image-wrap">
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          className="card-img"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackImage;
          }}
        />
        <div className="card-badges">
          <span className="badge badge-sector">
            {sectorDisplayName}
          </span>
          <span className={`badge badge-stock ${isOutOfStock ? 'out' : isLowStock ? 'low' : ''}`}>
            {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
          </span>
        </div>
      </div>

      <div className="card-body">
        <div className="card-sku">{product.sku}</div>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-desc">{product.description || 'No description provided.'}</p>

        {product.tags && product.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
            {product.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '11px',
                  background: 'var(--bg-main)',
                  color: 'var(--text-muted)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="card-pricing">
          <div className="price-main">
            ₹{hasDiscount ? product.discount_price : product.price}
          </div>
          {hasDiscount && <div className="price-strike">₹{product.price}</div>}
          <div className="price-unit">/ {product.unit}</div>
        </div>
      </div>

      <div className="card-footer">
        <div className="stock-pill">
          Stock: <strong>{product.stock_quantity}</strong>
        </div>

        <div className="card-actions">
          <button
            className="btn btn-secondary btn-icon"
            onClick={() => onView(product)}
            title="Quick View Details"
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
      </div>
    </div>
  );
};
