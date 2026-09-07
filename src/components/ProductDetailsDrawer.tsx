import React from 'react';
import { X, Tag, Edit2 } from 'lucide-react';
import type { Product } from '../types';

interface ProductDetailsDrawerProps {
  product: Product | null;
  onClose: () => void;
  onEdit: (product: Product) => void;
}

export const ProductDetailsDrawer: React.FC<ProductDetailsDrawerProps> = ({
  product,
  onClose,
  onEdit,
}) => {
  if (!product) return null;

  const hasDiscount =
    product.discount_price && parseFloat(product.discount_price) < parseFloat(product.price);
  const fallbackImage = '/assets/logo.png';
  const sectorDisplayName =
    product.category_sector ||
    product.category_name ||
    product.category_detail?.sector_display ||
    product.category_detail?.name ||
    'Swastik';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-sector">
              {sectorDisplayName}
            </span>
            <code style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>
              {product.sku}
            </code>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              height: '240px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: '#F9FAFB',
              position: 'relative',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={product.image || fallbackImage}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: product.image ? 'cover' : 'contain',
                padding: product.image ? '0' : '20px',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {product.brand || 'Swastik'} • {product.subcategory_name || product.category_name || 'General'}
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
              {product.name}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              {product.description || 'No detailed description available.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              background: 'var(--bg-main)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                Base Price
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                ₹{hasDiscount ? product.discount_price : product.price}
              </div>
              {hasDiscount && (
                <div style={{ fontSize: '11px', color: 'var(--text-light)', textDecoration: 'line-through' }}>
                  MRP: ₹{product.price}
                </div>
              )}
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                Unit Size
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                {product.unit}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                GST: {product.tax_percentage || '5.00'}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 700 }}>
                Stock Available
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  marginTop: '4px',
                  color: !product.is_available ? 'var(--danger)' : 'var(--success)',
                }}
              >
                {product.stock_quantity} units
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {product.is_available ? 'Active in store' : 'Disabled'}
              </div>
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Tags & Classifications
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {product.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary-dark)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Tag size={11} /> {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Sector Attributes & Metadata
              </div>
              <div
                style={{
                  background: 'var(--bg-main)',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                }}
              >
                {Object.entries(product.attributes).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 0',
                      borderBottom: '1px solid var(--border-light)',
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(product);
            }}
          >
            <Edit2 size={15} /> Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};
