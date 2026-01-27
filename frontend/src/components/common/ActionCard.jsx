import React from 'react';

const accentColors = {
  blue: '#3b82f6',
  green: '#10b981',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  navy: '#1e3a5f',
};

const ActionCard = ({
  icon,
  title,
  titleHindi,
  subtitle,
  badge,
  badgeColor = 'red',
  gradient = 'navy',
  onClick,
}) => {
  const accentColor = accentColors[gradient] || accentColors.navy;

  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '14px',
        padding: '24px 20px',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '140px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Badge */}
      {badge && (
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          minWidth: '20px',
          height: '20px',
          padding: '0 6px',
          background: badgeColor === 'red' ? '#ef4444' : badgeColor === 'green' ? '#10b981' : '#f59e0b',
          borderRadius: '10px',
          fontSize: '11px',
          fontWeight: '600',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {badge}
        </span>
      )}

      {/* Icon */}
      <div style={{
        width: '56px',
        height: '56px',
        background: `${accentColor}10`,
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '26px',
        marginBottom: '14px',
        border: `1px solid ${accentColor}20`
      }}>
        {icon}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: '15px',
        fontWeight: '600',
        color: '#1f2937',
        margin: 0,
        lineHeight: '1.3'
      }}>
        {title}
      </h3>

      {/* Hindi */}
      <p style={{
        fontSize: '12px',
        color: '#9ca3af',
        margin: '3px 0 0 0',
        fontWeight: '400'
      }}>
        {titleHindi}
      </p>

      {/* Subtitle */}
      {subtitle && (
        <p style={{
          fontSize: '11px',
          color: accentColor,
          margin: '8px 0 0 0',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span style={{
            width: '4px',
            height: '4px',
            background: accentColor,
            borderRadius: '50%'
          }} />
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default ActionCard;
