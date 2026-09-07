import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { apiService } from '../api/client';
import type { AdminUser } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onSuccess: (user: AdminUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onSuccess }) => {
  const [email, setEmail] = useState('Swastikartisanbakehouse@gmail.com');
  const [password, setPassword] = useState('ASHISH.kc1999');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiService.login(email.trim(), password);
      onSuccess(res.user);
    } catch (err: any) {
      setError(err?.message || 'Invalid administrator credentials. Only staff or superuser accounts can sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '420px', margin: 'auto' }}>
        <div style={{ padding: '32px 28px 20px 28px', textAlign: 'center' }}>
          <img
            src="/assets/logo.png"
            alt="Swastik"
            style={{ width: '64px', height: '64px', borderRadius: '14px', marginBottom: '12px' }}
          />
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            Swastik Admin Portal
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Sign in with your administrator account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '0 28px 24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div
                style={{
                  padding: '10px 14px',
                  background: 'var(--danger-bg)',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--danger)',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Administrator Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Swastikartisanbakehouse@gmail.com"
                  required
                />
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)',
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-light)',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px', padding: '11px' }}
              disabled={loading}
            >
              {loading ? 'Authenticating via API...' : 'Sign In as Administrator'}
              <ArrowRight size={16} />
            </button>

            <div
              style={{
                fontSize: '11.5px',
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginTop: '4px',
                lineHeight: '1.4',
              }}
            >
              Credentials verified against <code>/api/auth/admin/login/</code>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
