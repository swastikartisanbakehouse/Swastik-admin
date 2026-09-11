import React from 'react';
import {
  X,
  Layers,
  Headphones,
  LayoutGrid,
  LogOut,
  Phone,
  ChevronRight,
  Cake,
  Milk,
  Candy,
  Cookie,
} from 'lucide-react';
import type { Category, AdminUser } from '../types';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedSector: string;
  onSelectSector: (sector: string) => void;
  onOpenCategoriesModal: () => void;
  onLogout: () => void;
  user: AdminUser | null;
  productCountBySector: Record<string, number>;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  selectedSector,
  onSelectSector,
  onOpenCategoriesModal,
  onLogout,
  user,
  productCountBySector,
}) => {
  if (!isOpen) return null;

  // Standard core business categories with rich icons & descriptions for scalable presentation
  const coreCategoryMeta: Record<
    string,
    { icon: React.ReactNode; label: string; desc: string; color: string; bg: string }
  > = {
    BAKERY: {
      icon: <Cake size={18} />,
      label: 'Bakery',
      desc: 'Artisanal breads, cakes, pastries & cookies',
      color: '#D97706',
      bg: '#FEF3C7',
    },
    DAIRY: {
      icon: <Milk size={18} />,
      label: 'Dairy / Milk Products',
      desc: 'Pure farm milk, ghee, paneer, curd & butter',
      color: '#2563EB',
      bg: '#DBEAFE',
    },
    SWEETS: {
      icon: <Candy size={18} />,
      label: 'Sweets',
      desc: 'Traditional mithai, kaju katli & festive sweets',
      color: '#C2185B',
      bg: '#FCE4EC',
    },
    CONFECTIONERY: {
      icon: <Cookie size={18} />,
      label: 'Confectionery',
      desc: 'Handcrafted chocolates, snacks & delicacies',
      color: '#7C3AED',
      bg: '#EDE9FE',
    },
  };

  // Helper to get sector meta or fallback for future dynamic categories
  const getSectorMeta = (sectorKey: string, name?: string) => {
    const key = sectorKey?.toUpperCase() || '';
    if (coreCategoryMeta[key]) {
      return coreCategoryMeta[key];
    }
    return {
      icon: <Layers size={18} />,
      label: name || sectorKey || 'Category',
      desc: 'Commercial catalog category',
      color: 'var(--primary)',
      bg: 'var(--primary-light)',
    };
  };

  // Ensure 4 primary business sectors are always present, merged with dynamic categories from API
  const standardSectors = [
    { sector: 'BAKERY', name: 'Bakery' },
    { sector: 'DAIRY', name: 'Dairy / Milk Products' },
    { sector: 'SWEETS', name: 'Sweets' },
    { sector: 'CONFECTIONERY', name: 'Confectionery' },
  ];

  // Merge dynamic categories with standard list to ensure 100% scalability
  const displayCategories = [...standardSectors];
  categories.forEach((cat) => {
    if (!displayCategories.some((s) => s.sector.toUpperCase() === cat.sector?.toUpperCase())) {
      displayCategories.push({
        sector: cat.sector,
        name: cat.sector_display || cat.name || cat.sector,
      });
    }
  });

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <aside
        className="nav-drawer"
        onClick={(e) => e.stopPropagation()}
        aria-label="Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="brand-wrapper">
            <img src="/assets/logo.png" alt="Swastik Logo" className="brand-logo" />
            <div>
              <div className="brand-title" style={{ fontSize: '18px' }}>
                Swastik
                <span className="brand-badge">Admin</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Commerce Operations & Management
              </div>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-icon"
            onClick={onClose}
            aria-label="Close Navigation Menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="drawer-body">
          {/* Quick Dashboard Action */}
          <div className="drawer-section">
            <div className="drawer-section-title">Navigation</div>
            <button
              className={`drawer-nav-item ${selectedSector === 'ALL' ? 'active' : ''}`}
              onClick={() => {
                onSelectSector('ALL');
                onClose();
              }}
            >
              <div className="drawer-nav-icon" style={{ background: 'var(--bg-main)', color: 'var(--primary)' }}>
                <LayoutGrid size={18} />
              </div>
              <div className="drawer-nav-text">
                <span className="drawer-nav-label">All Products Catalog</span>
                <span className="drawer-nav-sub">Full multi-sector inventory</span>
              </div>
              <ChevronRight size={16} className="drawer-nav-chevron" />
            </button>
          </div>

          {/* Section A: Categories */}
          <div className="drawer-section">
            <div className="drawer-section-header">
              <div className="drawer-section-title">
                <Layers size={14} style={{ marginRight: '6px', color: 'var(--primary)' }} />
                A. Categories & Sectors
              </div>
              <button
                className="drawer-section-action"
                onClick={() => {
                  onClose();
                  onOpenCategoriesModal();
                }}
              >
                View Details
              </button>
            </div>
            <p className="drawer-section-desc">
              Select any category to view and manage products in that business section:
            </p>

            <div className="drawer-category-list">
              {displayCategories.map((item) => {
                const meta = getSectorMeta(item.sector, item.name);
                const isSelected = selectedSector === item.sector;
                const count = productCountBySector[item.sector] ?? 0;

                return (
                  <button
                    key={item.sector}
                    className={`drawer-category-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      onSelectSector(item.sector);
                      onClose();
                    }}
                  >
                    <div
                      className="category-item-icon"
                      style={{ color: meta.color, background: meta.bg }}
                    >
                      {meta.icon}
                    </div>

                    <div className="category-item-info">
                      <div className="category-item-name-row">
                        <span className="category-item-name">{meta.label}</span>
                        <span className="category-item-count">{count} {count === 1 ? 'item' : 'items'}</span>
                      </div>
                      <span className="category-item-desc">{meta.desc}</span>
                    </div>

                    <ChevronRight size={16} className="drawer-nav-chevron" />
                  </button>
                );
              })}
            </div>

            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: '10px', justifyContent: 'center' }}
              onClick={() => {
                onClose();
                onOpenCategoriesModal();
              }}
            >
              <Layers size={14} />
              <span>Manage / Inspect All Categories</span>
            </button>
          </div>

          {/* Section B: Help & Support */}
          <div className="drawer-section">
            <div className="drawer-section-header">
              <div className="drawer-section-title">
                <Headphones size={14} style={{ marginRight: '6px', color: 'var(--primary)' }} />
                B. Technical Support
              </div>
            </div>
            <p className="drawer-section-desc">
              Direct point of contact for portal queries, backend API, or catalog issues:
            </p>

            {/* Support Persons Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Person 1 */}
              <div className="drawer-support-card">
                <div className="support-card-header">
                  <div className="support-avatar">SS</div>
                  <div style={{ flex: 1 }}>
                    <div className="support-name">Suhail Siddiqui</div>
                    <div className="support-role">Technical Support</div>
                  </div>
                </div>

                <div className="support-detail-rows">
                  <a href="tel:+917311135785" className="support-row-link">
                    <Phone size={14} color="var(--primary)" />
                    <span className="support-row-label">Phone:</span>
                    <span className="support-row-val">+917311135785</span>
                  </a>
                </div>

                <a
                  href="tel:+917311135785"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', fontWeight: 600 }}
                >
                  <Phone size={13} color="var(--primary)" />
                  <span>Call Suhail</span>
                </a>
              </div>

              {/* Person 2 */}
              <div className="drawer-support-card">
                <div className="support-card-header">
                  <div className="support-avatar">GH</div>
                  <div style={{ flex: 1 }}>
                    <div className="support-name">Ghazali Hussain</div>
                    <div className="support-role">Technical Support</div>
                  </div>
                </div>

                <div className="support-detail-rows">
                  <a href="tel:+918957854484" className="support-row-link">
                    <Phone size={14} color="var(--primary)" />
                    <span className="support-row-label">Phone:</span>
                    <span className="support-row-val">+918957854484</span>
                  </a>
                </div>

                <a
                  href="tel:+918957854484"
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', fontWeight: 600 }}
                >
                  <Phone size={13} color="var(--primary)" />
                  <span>Call Ghazali</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="drawer-footer">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                  }}
                >
                  {(user.name || user.email)[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>
                    {user.name || 'Admin User'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
              </div>
              <button
                className="btn btn-secondary btn-icon"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', width: '100%' }}>
              Swastik Admin Portal v2.0
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
