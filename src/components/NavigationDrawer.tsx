import React, { useState } from 'react';
import {
  X,
  Layers,
  Headphones,
  LogOut,
  Phone,
  ChevronRight,
  ChevronDown,
  Cake,
  Milk,
  Candy,
  Cookie,
} from 'lucide-react';
import logo from '../assets/logo.png';
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
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

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

  const selectedSectorMeta = selectedSector !== 'ALL' ? getSectorMeta(selectedSector) : null;

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
            <img src={logo} alt="Swastik Logo" className="brand-logo" />
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
          {/* Main Navigation Group */}
          <div className="drawer-section">
            <div className="drawer-section-title">Navigation</div>
            <div className="drawer-menu-list">
              {/* 1. All Products Catalog
              <button
                className={`drawer-nav-item ${selectedSector === 'ALL' ? 'active' : ''}`}
                onClick={() => {
                  onSelectSector('ALL');
                  onClose();
                }}
              >
                <div
                  className="drawer-nav-icon"
                  style={{ background: 'var(--bg-main)', color: 'var(--primary)' }}
                >
                  <LayoutGrid size={18} />
                </div>
                <div className="drawer-nav-text">
                  <span className="drawer-nav-label">All Products Catalog</span>
                  <span className="drawer-nav-sub">Full multi-sector inventory</span>
                </div>
                <ChevronRight size={16} className="drawer-nav-chevron" />
              </button> */}

              {/* 2. Categories & Sectors (Collapsible Dropdown) */}
              <div className={`drawer-dropdown-item ${isCategoriesOpen ? 'is-expanded' : ''}`}>
                <button
                  type="button"
                  className={`drawer-nav-item drawer-dropdown-trigger ${selectedSector !== 'ALL' ? 'active-filter' : ''
                    }`}
                  onClick={() => setIsCategoriesOpen((prev) => !prev)}
                  aria-expanded={isCategoriesOpen}
                >
                  <div
                    className="drawer-nav-icon"
                    style={{ background: '#FEF3C7', color: '#D97706' }}
                  >
                    <Layers size={18} />
                  </div>
                  <div className="drawer-nav-text">
                    <div className="drawer-item-title-row">
                      <span className="drawer-nav-label">Categories & Sectors</span>
                      {selectedSectorMeta ? (
                        <span className="drawer-pill-badge active-sector-pill">
                          {selectedSectorMeta.label}
                        </span>
                      ) : (
                        <span className="drawer-pill-badge">{displayCategories.length}</span>
                      )}
                    </div>
                    <span className="drawer-nav-sub">
                      {selectedSectorMeta
                        ? `Filter: ${selectedSectorMeta.label}`
                        : 'Departmental business sectors'}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`drawer-dropdown-caret ${isCategoriesOpen ? 'open' : ''}`}
                  />
                </button>

                {/* Dropdown Content */}
                {isCategoriesOpen && (
                  <div className="drawer-dropdown-panel animate-drawer-panel">
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
                                <span className="category-item-count">
                                  {count} {count === 1 ? 'item' : 'items'}
                                </span>
                              </div>
                              <span className="category-item-desc">{meta.desc}</span>
                            </div>

                            <ChevronRight size={15} className="drawer-nav-chevron" />
                          </button>
                        );
                      })}
                    </div>

                    <button
                      className="btn btn-secondary btn-sm drawer-manage-btn"
                      onClick={() => {
                        onClose();
                        onOpenCategoriesModal();
                      }}
                    >
                      <Layers size={14} />
                      <span>Manage / Inspect All Categories</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 3. Technical Support (Collapsible Dropdown) */}
              <div className={`drawer-dropdown-item ${isSupportOpen ? 'is-expanded' : ''}`}>
                <button
                  type="button"
                  className="drawer-nav-item drawer-dropdown-trigger"
                  onClick={() => setIsSupportOpen((prev) => !prev)}
                  aria-expanded={isSupportOpen}
                >
                  <div
                    className="drawer-nav-icon"
                    style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}
                  >
                    <Headphones size={18} />
                  </div>
                  <div className="drawer-nav-text">
                    <div className="drawer-item-title-row">
                      <span className="drawer-nav-label">Technical Support</span>
                      <span className="drawer-pill-badge">2 Contacts</span>
                    </div>
                    <span className="drawer-nav-sub">Backend API & portal queries</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`drawer-dropdown-caret ${isSupportOpen ? 'open' : ''}`}
                  />
                </button>

                {/* Dropdown Content */}
                {isSupportOpen && (
                  <div className="drawer-dropdown-panel animate-drawer-panel">
                    <div className="drawer-support-list">
                      {/* Person 1: Suhail */}
                      <div className="drawer-support-card">
                        <div className="support-card-header">
                          <div className="support-avatar">SS</div>
                          <div className="support-info">
                            <div className="support-name">Suhail Siddiqui</div>
                            <div className="support-role">Technical Support</div>
                          </div>
                          <a
                            href="tel:+917311135785"
                            className="btn btn-secondary btn-sm support-call-pill"
                            title="Call Suhail Siddiqui"
                          >
                            <Phone size={12} color="var(--primary)" />
                            <span>Call</span>
                          </a>
                        </div>
                        <a href="tel:+917311135785" className="support-quick-phone">
                          <Phone size={12} color="var(--text-muted)" />
                          <span>+91 73111 35785</span>
                        </a>
                      </div>

                      {/* Person 2: Ghazali */}
                      <div className="drawer-support-card">
                        <div className="support-card-header">
                          <div className="support-avatar">GH</div>
                          <div className="support-info">
                            <div className="support-name">Ghazali Hussain</div>
                            <div className="support-role">Technical Support</div>
                          </div>
                          <a
                            href="tel:+918957854484"
                            className="btn btn-secondary btn-sm support-call-pill"
                            title="Call Ghazali Hussain"
                          >
                            <Phone size={12} color="var(--primary)" />
                            <span>Call</span>
                          </a>
                        </div>
                        <a href="tel:+918957854484" className="support-quick-phone">
                          <Phone size={12} color="var(--text-muted)" />
                          <span>+91 89578 54484</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
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
