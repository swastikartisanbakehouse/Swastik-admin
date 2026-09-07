import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { Category, CreateProductPayload } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProductPayload) => Promise<void>;
  categories: Category[];
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
}) => {
  const [formData, setFormData] = useState<CreateProductPayload>({
    sku: '',
    name: '',
    category: categories[0]?.id || 1,
    subcategory_name: '',
    description: '',
    price: '',
    discount_price: '',
    tax_percentage: '5.00',
    unit: '1 Pack',
    stock_quantity: 100,
    is_available: true,
    is_active: true,
    image: '',
    brand: 'Swastik',
    tags: ['fresh', 'daily-essential'],
    attributes: {},
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto generate SKU based on selected category when empty
  useEffect(() => {
    if (isOpen && !formData.sku && categories.length > 0) {
      const cat = categories.find((c) => c.id === formData.category) || categories[0];
      const sectorPrefix =
        cat?.sector === 'BAKERY'
          ? 'SW-BAK'
          : cat?.sector === 'DAIRY'
          ? 'SW-DAI'
          : cat?.sector === 'SWEETS'
          ? 'SW-SWE'
          : 'SW-CNF';
      const randomId = Math.floor(100 + Math.random() * 900);
      setFormData((prev) => ({
        ...prev,
        category: cat?.id || 1,
        sku: `${sectorPrefix}-${randomId}`,
      }));
    }
  }, [isOpen, formData.category, categories]);

  if (!isOpen) return null;

  const handleSectorChange = (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    const sectorPrefix =
      cat?.sector === 'BAKERY'
        ? 'SW-BAK'
        : cat?.sector === 'DAIRY'
        ? 'SW-DAI'
        : cat?.sector === 'SWEETS'
        ? 'SW-SWE'
        : 'SW-CNF';
    const randomId = Math.floor(100 + Math.random() * 900);
    setFormData((prev) => ({
      ...prev,
      category: catId,
      sku: `${sectorPrefix}-${randomId}`,
      subcategory_name: cat?.metadata?.popular_subcategories?.[0] || prev.subcategory_name,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const cleaned = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
      if (!formData.tags?.includes(cleaned)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...(prev.tags || []), cleaned],
        }));
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('Please enter a product name');
      return;
    }
    if (!formData.sku.trim()) {
      setError('Please enter a unique SKU code');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid base price');
      return;
    }
    if (!formData.unit.trim()) {
      setError('Please specify unit / pack size (e.g. 1 L, 500 g)');
      return;
    }

    const selectedCategoryId = Number(formData.category || categories[0]?.id || 1);

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        category: selectedCategoryId,
        price: parseFloat(formData.price).toFixed(2),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price).toFixed(2) : null,
        image: formData.image?.trim() ? formData.image.trim() : null,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to create product via API');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Add New Product</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Publish a new item directly to the live backend catalog
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
                <label className="form-label">
                  Sector / Category <span className="req">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => handleSectorChange(Number(e.target.value))}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.sector_display || c.name} (ID: {c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  SKU Code <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. SW-DAI-001"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>

              <div className="form-group full">
                <label className="form-label">
                  Product Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Farm Fresh Full Cream Milk"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subcategory</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Milk, Cakes, Namkeen, Mithai"
                  value={formData.subcategory_name || ''}
                  onChange={(e) => setFormData({ ...formData, subcategory_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Swastik Dairy"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Base Price (₹) <span className="req">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  placeholder="e.g. 68.00"
                  value={formData.price}
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
                  placeholder="e.g. 64.00 (optional)"
                  value={formData.discount_price || ''}
                  onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Unit / Pack Size <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 1 L, 500 g, 2 Pcs"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.stock_quantity ?? 100}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                />
              </div>

              <div className="form-group full">
                <label className="form-label">Product Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="form-group full">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Detailed description of ingredients, freshness, specifications..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group full">
                <label className="form-label">Tags</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Type tag (e.g. pure-milk, eggless) and press Add"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button type="button" className="btn btn-secondary" onClick={handleAddTag}>
                    Add Tag
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {formData.tags?.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary-dark)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      #{tag}
                      <X
                        size={12}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group full">
                <div className="form-switch-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>Available for Ordering</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Enable this product for active customer checkout
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
              {isSubmitting ? 'Publishing to API...' : 'Publish to Catalog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
