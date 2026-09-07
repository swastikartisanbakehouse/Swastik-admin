import React from 'react';
import { X } from 'lucide-react';
import type { Category } from '../types';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSelectSector: (sector: string) => void;
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSelectSector,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div>
            <h3>Swastik Product Sectors</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Live commercial sectors and categories defined in the backend
            </p>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
              No categories loaded from API. Ensure backend is running.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    background: 'var(--bg-main)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-light)',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                      {cat.sector_display || cat.name}
                    </h4>
                    <span
                      style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary-dark)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      ID: {cat.id}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '12px' }}>
                    {cat.description || 'No description provided.'}
                  </p>

                  {cat.metadata?.popular_subcategories && (
                    <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Subcategories
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {cat.metadata.popular_subcategories.map((sub, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '11px',
                              background: '#fff',
                              border: '1px solid var(--border-light)',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '14px', width: '100%' }}
                    onClick={() => {
                      onSelectSector(cat.sector);
                      onClose();
                    }}
                  >
                    Filter Products by {cat.name}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
