import React, { useState } from 'react';
import { X, Server, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { getBaseUrl, setBaseUrl, apiService } from '../api/client';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (newUrl: string) => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [url, setUrl] = useState(getBaseUrl());
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setStatusMessage('Checking backend health endpoint...');
    try {
      setBaseUrl(url.trim());
      const health = await apiService.checkHealth();
      setTestStatus('success');
      setStatusMessage(health.message || 'Backend API is connected successfully.');
    } catch (err: any) {
      try {
        const cats = await apiService.getCategories();
        if (Array.isArray(cats)) {
          setTestStatus('success');
          setStatusMessage('Connected and retrieved categories.');
          return;
        }
      } catch {
        // failed
      }
      setTestStatus('failed');
      setStatusMessage(err?.message || 'Unable to reach backend API. Check server URL and CORS.');
    }
  };

  const handleSave = () => {
    const cleanUrl = url.trim().replace(/\/+$/, '');
    setBaseUrl(cleanUrl);
    onSaved(cleanUrl);
    onClose();
  };

  const handlePreset = (presetUrl: string) => {
    setUrl(presetUrl);
    setTestStatus('idle');
    setStatusMessage('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={20} color="var(--primary)" />
            <h3>Backend API Configuration</h3>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Configure the Swastik Backend API URL for live data sync (categories, products, and admin authentication).
          </p>

          <div className="form-group">
            <label className="form-label">Active API Base URL</label>
            <input
              type="url"
              className="form-input"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setTestStatus('idle');
                setStatusMessage('');
              }}
              placeholder="https://swastik-backend.onrender.com"
            />
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Quick Presets
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handlePreset('https://swastik-backend.onrender.com')}
              >
                Render Production
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handlePreset('http://127.0.0.1:8000')}
              >
                Local Dev (127.0.0.1:8000)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handlePreset('http://localhost:8000')}
              >
                Localhost (8000)
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
            >
              <RefreshCw size={14} className={testStatus === 'testing' ? 'spin' : ''} />
              {testStatus === 'testing' ? 'Testing API...' : 'Test Connection'}
            </button>

            {testStatus === 'success' && (
              <span style={{ fontSize: '12px', color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> {statusMessage || 'API Connected'}
              </span>
            )}
            {testStatus === 'failed' && (
              <span style={{ fontSize: '12px', color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={14} /> {statusMessage || 'Connection failed'}
              </span>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Apply & Reload
          </button>
        </div>
      </div>
    </div>
  );
};
