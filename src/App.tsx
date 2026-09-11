import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  Package,
  Plus,
  ArrowUpDown,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { ProductCard } from './components/ProductCard';
import { ProductTable } from './components/ProductTable';
import { AddProductModal } from './components/AddProductModal';
import { EditProductModal } from './components/EditProductModal';
import { ProductDetailsDrawer } from './components/ProductDetailsDrawer';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CategoriesModal } from './components/CategoriesModal';
import { ApiConfigModal } from './components/ApiConfigModal';
import { LoginModal } from './components/LoginModal';
import { NavigationDrawer } from './components/NavigationDrawer';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import type { Product, Category, CreateProductPayload, AdminUser } from './types';
import {
  apiService,
  getBaseUrl,
  getStoredUser,
  getAuthToken,
} from './api/client';

export const App: React.FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<AdminUser | null>(getStoredUser());
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(!getAuthToken());
  const [apiError, setApiError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'PRICE_LOW' | 'PRICE_HIGH' | 'NAME'>('NEWEST');
  const [viewMode, setViewMode] = useState<'GRID' | 'TABLE'>('TABLE');

  // Modals & Navigation state
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);
  const [, setApiUrlState] = useState(getBaseUrl());
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load Data directly from API
  const loadData = async () => {
    setIsRefreshing(true);
    setApiError(null);
    try {
      const [cats, prods] = await Promise.all([
        apiService.getCategories(),
        apiService.getProducts(),
      ]);
      setCategories(cats);
      setProducts(prods);
      setApiError(null);
    } catch (err: any) {
      const msg = err?.message || 'Failed to fetch catalog data from API.';
      setApiError(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Sector filter
        if (selectedSector !== 'ALL') {
          const catSector =
            product.category_sector ||
            product.category_detail?.sector ||
            '';
          if (catSector && catSector !== selectedSector) return false;
        }

        // Stock status filter
        if (stockFilter === 'IN_STOCK') {
          if (!product.is_available || product.stock_quantity < 50) return false;
        } else if (stockFilter === 'LOW_STOCK') {
          if (!product.is_available || product.stock_quantity <= 0 || product.stock_quantity >= 50) return false;
        } else if (stockFilter === 'OUT_OF_STOCK') {
          if (product.is_available && product.stock_quantity > 0) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name?.toLowerCase().includes(q);
          const matchSku = product.sku?.toLowerCase().includes(q);
          const matchSub = product.subcategory_name?.toLowerCase().includes(q);
          const matchBrand = product.brand?.toLowerCase().includes(q);
          const matchTags = product.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchSku && !matchSub && !matchBrand && !matchTags) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'PRICE_LOW') {
          return parseFloat(a.price) - parseFloat(b.price);
        }
        if (sortBy === 'PRICE_HIGH') {
          return parseFloat(b.price) - parseFloat(a.price);
        }
        if (sortBy === 'NAME') {
          return a.name.localeCompare(b.name);
        }
        // NEWEST
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [products, selectedSector, stockFilter, searchQuery, sortBy]);

  // Product counts per sector for scalable category navigation
  const productCountBySector = useMemo(() => {
    const counts: Record<string, number> = {
      BAKERY: 0,
      DAIRY: 0,
      SWEETS: 0,
      CONFECTIONERY: 0,
    };
    products.forEach((p) => {
      const sec = p.category_sector || p.category_detail?.sector || '';
      if (sec) {
        counts[sec] = (counts[sec] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Actions
  const handleCreateProduct = async (payload: CreateProductPayload) => {
    try {
      const created = await apiService.createProduct(payload);
      setProducts((prev) => [created, ...prev]);
      showToast(`Product "${created.name}" created via API!`, 'success');
      loadData(); // Re-sync to ensure exact server state
    } catch (err: any) {
      showToast('API Error: ' + err?.message, 'error');
      throw err;
    }
  };

  const handleUpdateProduct = async (id: number, payload: Partial<CreateProductPayload>) => {
    try {
      const updated = await apiService.updateProduct(id, payload);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      showToast(`Product "${updated.name}" updated via API!`, 'success');
      loadData();
    } catch (err: any) {
      showToast('API Error: ' + err?.message, 'error');
      throw err;
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await apiService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Product deleted from API.', 'success');
    } catch (err: any) {
      showToast('API Error: ' + err?.message, 'error');
      throw err;
    }
  };

  const handleToggleStock = async (product: Product) => {
    const newStatus = !product.is_available;
    try {
      await handleUpdateProduct(product.id, { is_available: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await apiService.logout();
    setUser(null);
    setIsLoginOpen(true);
    showToast('Signed out of admin session.', 'info');
  };

  return (
    <div className="app-container">
      {/* Header with Burger Navigation Menu */}
      <Header
        user={user}
        onOpenNavDrawer={() => setIsNavDrawerOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
        onLogout={handleLogout}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
      />

      {/* Main Container */}
      <main className="main-content">
        {/* API Error Notification Banner */}
        {apiError && (
          <div
            style={{
              padding: '14px 20px',
              background: '#FFF1F2',
              border: '1px solid #FECDD3',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} color="var(--danger)" />
              <div>
                <strong style={{ color: 'var(--danger)', fontSize: '13.5px' }}>API Server Status Notice: </strong>
                <span style={{ color: 'var(--text-main)', fontSize: '13px' }}>{apiError}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setIsApiConfigOpen(true)}>
                Change Server URL
              </button>
              <button className="btn btn-primary btn-sm" onClick={loadData} disabled={isRefreshing}>
                <RefreshCw size={13} className={isRefreshing ? 'spin' : ''} /> Retry
              </button>
            </div>
          </div>
        )}

        {/* Statistics Metric Cards */}
        <StatsCards products={products} categories={categories} />

        {/* Toolbar & Filters */}
        <div className="toolbar-card">
          <div className="toolbar-top">
            {/* Search Input */}
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search products by name, SKU, tag, brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sector Tabs */}
            <div className="sector-tabs">
              <button
                className={`sector-tab ${selectedSector === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedSector('ALL')}
              >
                All Sectors
                <span className="sector-tab-count">{products.length}</span>
              </button>

              <button
                className={`sector-tab ${selectedSector === 'BAKERY' ? 'active' : ''}`}
                onClick={() => setSelectedSector('BAKERY')}
              >
                Bakery
                <span className="sector-tab-count">
                  {products.filter((p) => (p.category_sector || p.category_detail?.sector) === 'BAKERY').length}
                </span>
              </button>

              <button
                className={`sector-tab ${selectedSector === 'DAIRY' ? 'active' : ''}`}
                onClick={() => setSelectedSector('DAIRY')}
              >
                Dairy / Milk Products
                <span className="sector-tab-count">
                  {products.filter((p) => (p.category_sector || p.category_detail?.sector) === 'DAIRY').length}
                </span>
              </button>

              <button
                className={`sector-tab ${selectedSector === 'SWEETS' ? 'active' : ''}`}
                onClick={() => setSelectedSector('SWEETS')}
              >
                Sweets
                <span className="sector-tab-count">
                  {products.filter((p) => (p.category_sector || p.category_detail?.sector) === 'SWEETS').length}
                </span>
              </button>

              <button
                className={`sector-tab ${selectedSector === 'CONFECTIONERY' ? 'active' : ''}`}
                onClick={() => setSelectedSector('CONFECTIONERY')}
              >
                Confectionery
                <span className="sector-tab-count">
                  {products.filter((p) => (p.category_sector || p.category_detail?.sector) === 'CONFECTIONERY').length}
                </span>
              </button>
            </div>
          </div>

          <div className="filters-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {/* Stock Filter */}
              <div className="filter-group">
                <Filter size={14} />
                <span>Availability:</span>
                <select
                  className="custom-select"
                  value={stockFilter}
                  onChange={(e: any) => setStockFilter(e.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="IN_STOCK">In Stock (≥ 50)</option>
                  <option value="LOW_STOCK">Low Stock (&lt; 50)</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="filter-group">
                <ArrowUpDown size={14} />
                <span>Sort:</span>
                <select
                  className="custom-select"
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                >
                  <option value="NEWEST">Newest First</option>
                  <option value="PRICE_LOW">Price: Low to High</option>
                  <option value="PRICE_HIGH">Price: High to Low</option>
                  <option value="NAME">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* View Mode Grid/Table */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> items
              </span>

              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === 'GRID' ? 'active' : ''}`}
                  onClick={() => setViewMode('GRID')}
                  title="Card Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  className={`view-btn ${viewMode === 'TABLE' ? 'active' : ''}`}
                  onClick={() => setViewMode('TABLE')}
                  title="Compact Table View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Listing */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <RefreshCw size={28} className="spin" style={{ color: 'var(--primary)', marginBottom: '12px' }} />
            <p style={{ fontWeight: 600 }}>Loading catalog from Swastik Backend API...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Package size={28} />
            </div>
            <h3>No products found in live API</h3>
            <p>
              {searchQuery
                ? `No products matched "${searchQuery}". Try changing your search query.`
                : 'No products found for this sector category. Click "Add Product" to create one in the backend.'}
            </p>
            {searchQuery ? (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSector('ALL');
                  setStockFilter('ALL');
                }}
              >
                Clear Filters
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                <Plus size={16} /> Add Product to Catalog
              </button>
            )}
          </div>
        ) : viewMode === 'GRID' ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={(p) => setViewingProduct(p)}
                onEdit={(p) => setEditingProduct(p)}
                onDelete={(p) => setDeletingProduct(p)}
                onToggleStock={handleToggleStock}
              />
            ))}
          </div>
        ) : (
          <ProductTable
            products={filteredProducts}
            onView={(p) => setViewingProduct(p)}
            onEdit={(p) => setEditingProduct(p)}
            onDelete={(p) => setDeletingProduct(p)}
            onToggleStock={handleToggleStock}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <NavigationDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        categories={categories}
        selectedSector={selectedSector}
        onSelectSector={(sec) => setSelectedSector(sec)}
        onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
        onLogout={handleLogout}
        user={user}
        productCountBySector={productCountBySector}
      />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateProduct}
        categories={categories}
      />

      <EditProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={handleUpdateProduct}
        product={editingProduct}
        categories={categories}
      />

      <ProductDetailsDrawer
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
        onEdit={(p) => setEditingProduct(p)}
      />

      <DeleteConfirmModal
        product={deletingProduct}
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteProduct}
      />

      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        categories={categories}
        selectedSector={selectedSector}
        onSelectSector={(sec) => setSelectedSector(sec)}
        productCountBySector={productCountBySector}
      />

      <ApiConfigModal
        isOpen={isApiConfigOpen}
        onClose={() => setIsApiConfigOpen(false)}
        onSaved={(url) => {
          setApiUrlState(url);
          loadData();
          showToast(`Switched API endpoint to ${url}`, 'success');
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onSuccess={(usr) => {
          setUser(usr);
          setIsLoginOpen(false);
          loadData();
          showToast(`Welcome, ${usr.name || usr.email}!`, 'success');
        }}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
