import React, { useState } from 'react';
import {
  X,
  Layers,
  Search,
  LayoutGrid,
  Cake,
  Milk,
  Candy,
  Cookie,
  ArrowRight,
} from 'lucide-react';
import type { Category } from '../types';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedSector: string;
  onSelectSector: (sector: string) => void;
  productCountBySector?: Record<string, number>;
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedSector,
  onSelectSector,
  productCountBySector = {},
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Preset meta for standard categories
  const coreCategoryMeta: Record<
    string,
    { icon: React.ReactNode; label: string; desc: string; color: string; bg: string; subcategories: string[] }
  > = {
    BAKERY: {
      icon: <Cake size={20} />,
      label: 'Bakery',
      desc: 'Freshly baked artisanal breads, gourmet cakes, cookies, pastries, and savory bakes.',
      color: '#D97706',
      bg: '#FEF3C7',
      subcategories: ['Breads', 'Cakes', 'Pastries', 'Cookies', 'Muffins & Bakes'],
    },
    DAIRY: {
      icon: <Milk size={20} />,
      label: 'Dairy / Milk Products',
      desc: 'Farm-fresh milk, pure desi ghee, paneer, curd, fresh cream, butter, and traditional dairy items.',
      color: '#2563EB',
      bg: '#DBEAFE',
      subcategories: ['Fresh Milk', 'Ghee', 'Paneer', 'Curd & Yogurt', 'Butter & Cream'],
    },
    SWEETS: {
      icon: <Candy size={20} />,
      label: 'Sweets',
      desc: 'Traditional Indian mithai, Kaju Katli, Motichoor Ladoo, Gulab Jamun, Rasgulla, and festive gift boxes.',
      color: '#C2185B',
      bg: '#FCE4EC',
      subcategories: ['Kaju Sweets', 'Syrup Sweets', 'Dry Fruit Mithai', 'Ghee Sweets', 'Festive Boxes'],
    },
    CONFECTIONERY: {
      icon: <Cookie size={20} />,
      label: 'Confectionery',
      desc: 'Handcrafted chocolates, candies, crunchy savories, roasted namkeen, and artisanal delicacies.',
      color: '#7C3AED',
      bg: '#EDE9FE',
      subcategories: ['Chocolates', 'Namkeen & Snacks', 'Handcrafted Candies', 'Cookies & Wafers'],
    },
  };

  // Combine default 4 business categories with any API dynamic categories
  const defaultSectors = [
    {
      id: 1,
      sector: 'BAKERY',
      name: 'Bakery',
      sector_display: 'Bakery',
      description: coreCategoryMeta.BAKERY.desc,
      metadata: { popular_subcategories: coreCategoryMeta.BAKERY.subcategories },
      is_active: true,
      created_at: '',
    },
    {
      id: 2,
      sector: 'DAIRY',
      name: 'Dairy / Milk Products',
      sector_display: 'Dairy / Milk Products',
      description: coreCategoryMeta.DAIRY.desc,
      metadata: { popular_subcategories: coreCategoryMeta.DAIRY.subcategories },
      is_active: true,
      created_at: '',
    },
    {
      id: 3,
      sector: 'SWEETS',
      name: 'Sweets',
      sector_display: 'Sweets',
      description: coreCategoryMeta.SWEETS.desc,
      metadata: { popular_subcategories: coreCategoryMeta.SWEETS.subcategories },
      is_active: true,
      created_at: '',
    },
    {
      id: 4,
      sector: 'CONFECTIONERY',
      name: 'Confectionery',
      sector_display: 'Confectionery',
      description: coreCategoryMeta.CONFECTIONERY.desc,
      metadata: { popular_subcategories: coreCategoryMeta.CONFECTIONERY.subcategories },
      is_active: true,
      created_at: '',
    },
  ];

  // Merge list
  const mergedCategories: Category[] = [...defaultSectors];
  categories.forEach((apiCat) => {
    const existingIndex = mergedCategories.findIndex(
      (c) => c.sector?.toUpperCase() === apiCat.sector?.toUpperCase()
    );
    if (existingIndex >= 0) {
      mergedCategories[existingIndex] = {
        ...mergedCategories[existingIndex],
        ...apiCat,
        name: apiCat.sector_display || apiCat.name || mergedCategories[existingIndex].name,
      };
    } else {
      mergedCategories.push(apiCat);
    }
  });

  const filteredCategories = mergedCategories.filter((cat) => {
    const q = searchTerm.toLowerCase();
    const nameMatch = (cat.sector_display || cat.name || '').toLowerCase().includes(q);
    const descMatch = (cat.description || '').toLowerCase().includes(q);
    const subMatch = (cat.metadata?.popular_subcategories || []).some((s) => s.toLowerCase().includes(q));
    return nameMatch || descMatch || subMatch;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog categories-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <Layers size={22} />
            </div>
            <div>
              <h3>Business Categories & Sectors</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                View commercial sectors, subcategories, and active product distribution
              </p>
            </div>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search bar inside modal */}
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-light)',
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search business categories, subcategories or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Quick Filter All button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: selectedSector === 'ALL' ? 'var(--primary-subtle)' : 'var(--bg-main)',
              border: `1px solid ${selectedSector === 'ALL' ? 'var(--primary)' : 'var(--border-light)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            onClick={() => {
              onSelectSector('ALL');
              onClose();
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-sm)',
                  background: selectedSector === 'ALL' ? 'var(--primary)' : '#fff',
                  color: selectedSector === 'ALL' ? '#fff' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                <LayoutGrid size={16} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                  All Business Sectors (Full Catalog)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  View products across all categories combined
                </div>
              </div>
            </div>
            {selectedSector === 'ALL' && (
              <span
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                Active
              </span>
            )}
          </div>

          {/* Categories Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '16px',
              maxHeight: '440px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {filteredCategories.map((cat) => {
              const meta = coreCategoryMeta[cat.sector?.toUpperCase()] || {
                icon: <Layers size={20} />,
                label: cat.sector_display || cat.name,
                desc: cat.description || 'Commercial catalog category.',
                color: 'var(--primary)',
                bg: 'var(--primary-light)',
                subcategories: cat.metadata?.popular_subcategories || [],
              };

              const count = productCountBySector[cat.sector] ?? 0;
              const isSelected = selectedSector === cat.sector;

              return (
                <div
                  key={cat.id || cat.sector}
                  style={{
                    background: isSelected ? 'var(--primary-subtle)' : 'var(--bg-main)',
                    borderRadius: 'var(--radius-lg)',
                    border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-light)'}`,
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'var(--transition)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-md)',
                          background: meta.bg,
                          color: meta.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {meta.icon}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                          {cat.sector_display || cat.name}
                        </h4>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                          Sector: {cat.sector}
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        background: isSelected ? 'var(--primary)' : '#fff',
                        color: isSelected ? '#fff' : 'var(--text-main)',
                        border: '1px solid var(--border-light)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {count} {count === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                      lineHeight: '1.45',
                      marginBottom: '12px',
                      flex: 1,
                    }}
                  >
                    {cat.description || meta.desc}
                  </p>

                  {/* Subcategories pills */}
                  {(cat.metadata?.popular_subcategories || meta.subcategories)?.length > 0 && (
                    <div style={{ marginTop: 'auto', marginBottom: '14px' }}>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--text-light)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          marginBottom: '6px',
                        }}
                      >
                        Popular Subcategories
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {(cat.metadata?.popular_subcategories || meta.subcategories).map((sub, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '11px',
                              background: '#fff',
                              border: '1px solid var(--border-light)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-sm)',
                              color: 'var(--text-main)',
                              fontWeight: 500,
                            }}
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => {
                      onSelectSector(cat.sector);
                      onClose();
                    }}
                  >
                    <span>{isSelected ? 'Currently Selected' : `Filter Catalog by ${cat.sector_display || cat.name}`}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Total Categories Available: {mergedCategories.length}
          </div>
          <button className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
