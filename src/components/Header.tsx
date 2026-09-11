import React from 'react';
import {
  Menu,
  Plus,
  LogOut,
  User as UserIcon,
  RefreshCw,
  Layers,
  Headphones,
} from 'lucide-react';
import type { AdminUser } from '../types';

interface HeaderProps {
  user: AdminUser | null;
  onOpenNavDrawer: () => void;
  onOpenAddModal: () => void;
  onOpenCategoriesModal: () => void;
  onLogout: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenNavDrawer,
  onOpenAddModal,
  onOpenCategoriesModal,
  onLogout,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Left Side: Burger Menu + Brand Title */}
        <div className="header-left">
          <button
            className="btn btn-secondary btn-icon btn-burger"
            onClick={onOpenNavDrawer}
            title="Open Navigation Menu"
            aria-label="Open Navigation Menu"
            id="btn-burger-menu"
          >
            <Menu size={20} />
          </button>

          <div
            className="brand-wrapper"
            onClick={onOpenNavDrawer}
            title="Click to open menu"
          >
            <img src="/assets/logo.png" alt="Swastik Logo" className="brand-logo" />
            <div className="brand-title">
              Swastik
              <span className="brand-badge">Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="nav-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            title="Refresh Live Catalog from API"
            disabled={isRefreshing}
          >
            <RefreshCw size={15} className={isRefreshing ? 'spin' : ''} />
            <span className="hide-on-mobile">{isRefreshing ? 'Loading...' : 'Refresh'}</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenCategoriesModal}
            title="View Product Sectors / Categories"
          >
            <Layers size={15} />
            <span className="hide-on-mobile">Categories</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenNavDrawer}
            title="Technical Support"
          >
            <Headphones size={15} />
            <span className="hide-on-mobile">Support</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={onOpenAddModal}
            id="btn-add-product"
          >
            <Plus size={17} strokeWidth={2.5} />
            <span>Add Product</span>
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
              <div
                className="hide-on-mobile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: 'var(--bg-main)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <UserIcon size={14} color="var(--primary)" />
                <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name || user.email.split('@')[0]}
                </span>
              </div>
              <button
                className="btn btn-secondary btn-icon"
                onClick={onLogout}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
