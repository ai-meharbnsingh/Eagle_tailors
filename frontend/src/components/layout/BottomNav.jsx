import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/upload', icon: '📷', label: 'Upload' },
  { path: '/search', icon: '🔍', label: 'Search' },
  { path: '/books', icon: '📚', label: 'Books' },
  { path: '/deliveries', icon: '🚚', label: 'Delivery' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      borderTop: '1px solid #e5e7eb',
      zIndex: 50,
      width: '100%'
    }}>
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '0 8px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          height: '68px'
        }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  height: '100%',
                  padding: '8px 4px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Active indicator */}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '24px',
                    height: '3px',
                    background: '#1e3a5f',
                    borderRadius: '0 0 3px 3px'
                  }} />
                )}

                {/* Icon container */}
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  background: isActive ? '#1e3a5f12' : 'transparent',
                  transition: 'all 0.2s ease'
                }}>
                  {item.icon}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: '11px',
                  marginTop: '4px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#1e3a5f' : '#9ca3af',
                  transition: 'all 0.2s ease'
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
