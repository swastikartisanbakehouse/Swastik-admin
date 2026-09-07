import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { Category, Product, CreateProductPayload } from '../types';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: Partial<CreateProductPayload>) => Promise<void>;
  product: Product | null;
  categories: Category[];
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
}) => {
  const [formData, setFormData] = useState<Partial<CreateProductPayload>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      const catId = product.category || 1;
      setFormData({
        name: product.name,
        sku: product.sku,
        category: catId,
        subcategory_name: product.subcategory_name || '',
        description: product.description || '',
        price: product.price,
        discount_price: product.discount_price || '',
        tax_percentage: product.tax_percentage || '5.00',
        unit: product.unit,
        stock_quantity: product.stock_quantity,
        is_available: product.is_available,
        is_active: product.is_active,
        image: product.image || '',
        brand: product.brand || 'Swastik',
        tags: product.tags || [],
      });
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name?.trim()) {
      setError('Please enter a product name');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return;
    }

    const selectedCategoryId = Number(formData.category || product.category || 1);

    setIsSubmitting(true);
    try {
      await onSubmit(product.id, {
        ...formData,
        category: selectedCategoryId,
        price: parseFloat(formData.price).toFixed(2),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price).toFixed(2) : null,
        image: formData.image?.trim() ? formData.image.trim() : null,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update product via API');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Edit Product</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Update catalog details for #{product.sku}
            </p>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'var(--danger-bg)',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--danger)',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Sector / Category</label>
                <select
                  className="form-select"
                  value={formData.category || product.category}
                  onChange={(e) => {
                    const catId = Number(e.target.value);
                    setFormData({ ...formData, category: catId });
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.sector_display || c.name} (ID: {c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">SKU</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.sku || ''}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>

              <div className="form-group full">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subcategory</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.subcategory_name || ''}
                  onChange={(e) => setFormData({ ...formData, subcategory_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Base Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discount Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  value={formData.discount_price || ''}
                  onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unit / Pack Size</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.stock_quantity ?? 0}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                />
              </div>

              <div className="form-group full">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="form-group full">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group full">
                <div className="form-switch-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>In-Stock & Ordering Active</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Toggle customer availability
                    </div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving to API...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
