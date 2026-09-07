import React from 'react';
import { Plus, Server, LogOut, User as UserIcon, RefreshCw, Layers } from 'lucide-react';
import type { AdminUser } from '../types';

interface HeaderProps {
  user: AdminUser | null;
  onOpenAddModal: () => void;
  onOpenCategoriesModal: () => void;
  onOpenApiConfig: () => void;
  onLogout: () => void;
  onRefresh: () => void;
  apiUrl: string;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAddModal,
  onOpenCategoriesModal,
  onOpenApiConfig,
  onLogout,
  onRefresh,
  apiUrl,
  isRefreshing,
}) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand-wrapper">
          <img src="/assets/logo.png" alt="Swastik Logo" className="brand-logo" />
          <div className="brand-title">
            Swastik
            <span className="brand-badge">Admin Portal</span>
          </div>
        </div>

        <div className="nav-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            title="Refresh Live Catalog from API"
            disabled={isRefreshing}
          >
            <RefreshCw size={15} className={isRefreshing ? 'spin' : ''} />
            <span>{isRefreshing ? 'Loading...' : 'Sync API'}</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenCategoriesModal}
            title="View Product Sectors"
          >
            <Layers size={15} />
            <span>Sectors</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenApiConfig}
            title={`API Endpoint: ${apiUrl}`}
          >
            <Server size={15} />
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {apiUrl.replace(/^https?:\/\//, '')}
            </span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
              <div
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
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
