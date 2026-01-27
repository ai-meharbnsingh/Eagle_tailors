import React from 'react';

const accentColors = {
  blue: '#3b82f6',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  navy: '#1e3a5f',
};

const StatsCard = ({
  icon,
  value,
  label,
  labelHindi,
  color = 'navy',
  alert,
  onClick,
}) => {
  const accentColor = accentColors[color] || accentColors.navy;

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        borderTop: `3px solid ${accentColor}`,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Alert indicator */}
      {alert && (
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '8px',
          height: '8px',
          background: '#ef4444',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />
      )}

      {/* Icon */}
      <div style={{
        width: '40px',
        height: '40px',
        background: `${accentColor}12`,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        marginBottom: '14px'
      }}>
        {icon}
      </div>

      {/* Value */}
      <p style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#1f2937',
        margin: 0,
        lineHeight: '1.1',
        letterSpacing: '-0.5px'
      }}>
        {value}
      </p>

      {/* Labels */}
      <p style={{
        fontSize: '13px',
        fontWeight: '500',
        color: '#4b5563',
        margin: '6px 0 0 0'
      }}>
        {label}
      </p>
      {labelHindi && (
        <p style={{
          fontSize: '11px',
          color: '#9ca3af',
          margin: '2px 0 0 0',
          fontWeight: '400'
        }}>
          {labelHindi}
        </p>
      )}
    </div>
  );
};

export default StatsCard;
