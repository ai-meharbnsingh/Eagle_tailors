import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  // Get user from localStorage if not passed as prop
  const currentUser = user || (() => {
    try {
      const auth = localStorage.getItem('eagle_auth');
      return auth ? JSON.parse(auth).user : 'Admin';
    } catch {
      return 'Admin';
    }
  })();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('eagle_auth');
    }
    toast.success('Logged out successfully');
    navigate('/login');
    setShowMenu(false);
  };

  return (
    <header style={{
      background: '#1e3a5f',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px'
          }}>
            🦅
          </div>
          <div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '600',
              letterSpacing: '-0.3px',
              margin: 0
            }}>
              Eagle Tailors
            </h1>
            <p style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
              fontWeight: '400'
            }}>
              ईगल टेलर्स, मेरठ
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{
            position: 'relative',
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}>
            <span style={{ fontSize: '16px' }}>🔔</span>
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              background: '#ef4444',
              borderRadius: '50%',
              border: '2px solid #1e3a5f'
            }} />
          </button>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(255,255,255,0.1)',
                padding: '6px 14px 6px 8px',
                borderRadius: '10px',
                marginLeft: '4px',
                border: 'none',
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}>
                👤
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  margin: 0,
                  lineHeight: '1.2'
                }}>{currentUser}</p>
                <p style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.5)',
                  margin: 0,
                  lineHeight: '1.2'
                }}>Online</p>
              </div>
              <span style={{
                fontSize: '10px',
                marginLeft: '4px',
                transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}>▼</span>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                {/* Backdrop */}
                <div
                  onClick={() => setShowMenu(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 40
                  }}
                />

                {/* Menu */}
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                  minWidth: '180px',
                  zIndex: 50,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0 0 2px 0'
                    }}>
                      {currentUser}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      Administrator
                    </p>
                  </div>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#ef4444',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    🚪 Logout / लॉग आउट
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
