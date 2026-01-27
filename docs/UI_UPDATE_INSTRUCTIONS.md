# Eagle Tailors - UI Update Instructions

## TASK: Completely Redesign the Frontend UI

The current UI is too simple and plain. You need to transform it into a professional, visually appealing, modern interface.

**IMPORTANT:** 
- Do NOT change any backend code or API logic
- Only update frontend components, styles, and layouts
- Keep all existing functionality working
- Make it look like a premium app, not a basic template

---

## CURRENT PROBLEMS TO FIX

1. ❌ Too much white/empty space
2. ❌ Generic boring icons
3. ❌ No visual hierarchy
4. ❌ No branding/personality
5. ❌ No useful stats at a glance
6. ❌ No color gradients
7. ❌ Cards look flat and lifeless
8. ❌ No bottom navigation for mobile
9. ❌ No recent activity feed
10. ❌ Looks like a template, not a professional app

---

## NEW DESIGN REQUIREMENTS

### Color Palette (Use These Exact Colors)

```javascript
// tailwind.config.js - extend colors
const colors = {
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',  // Main primary
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  success: {
    500: '#10B981',
    600: '#059669',
  },
  warning: {
    500: '#F59E0B',
    600: '#D97706',
  },
  danger: {
    500: '#EF4444',
    600: '#DC2626',
  }
};
```

### Gradient Definitions (Add to globals.css)

```css
/* Gradient backgrounds for cards */
.gradient-blue {
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
}

.gradient-purple {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
}

.gradient-orange {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
}

.gradient-red {
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
}

.gradient-header {
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
}

/* Card shadows */
.card-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Hover effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Status indicators */
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-new { background-color: #3B82F6; }
.status-pending { background-color: #F59E0B; }
.status-ready { background-color: #10B981; }
.status-delivered { background-color: #6B7280; }
.status-overdue { background-color: #EF4444; animation: pulse 2s infinite; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

---

## COMPONENT UPDATES

### 1. CREATE: Header Component (src/components/layout/Header.tsx)

```tsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { user, role } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="gradient-header text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              🦅
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Eagle Tailors</h1>
              <p className="text-xs text-blue-200">ईगल टेलर्स, मेरठ</p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* User badge */}
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                👤
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium capitalize">{role}</p>
                <p className="text-xs text-blue-200">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### 2. CREATE: StatsCard Component (src/components/common/StatsCard.tsx)

```tsx
import React from 'react';

interface StatsCardProps {
  icon: string;
  value: string | number;
  label: string;
  labelHindi?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  alert?: boolean;
  onClick?: () => void;
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-600',
  green: 'bg-green-50 border-green-200 text-green-600',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
  red: 'bg-red-50 border-red-200 text-red-600',
  purple: 'bg-purple-50 border-purple-200 text-purple-600',
};

const iconBgClasses = {
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  yellow: 'bg-yellow-100',
  red: 'bg-red-100',
  purple: 'bg-purple-100',
};

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  value,
  label,
  labelHindi,
  trend,
  trendValue,
  color,
  alert,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border-2 card-shadow card-hover cursor-pointer
        ${colorClasses[color]}
        ${alert ? 'animate-pulse' : ''}
      `}
    >
      {alert && (
        <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
      )}
      
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl ${iconBgClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        
        {trend && (
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        )}
      </div>

      <div className="mt-3">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm font-medium mt-1">{label}</p>
        {labelHindi && <p className="text-xs opacity-75">{labelHindi}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
```

### 3. CREATE: ActionCard Component (src/components/common/ActionCard.tsx)

```tsx
import React from 'react';

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  titleHindi: string;
  subtitle?: string;
  badge?: string | number;
  badgeColor?: 'red' | 'green' | 'yellow';
  gradient: 'blue' | 'green' | 'purple' | 'orange';
  onClick: () => void;
}

const gradientClasses = {
  blue: 'from-blue-500 to-blue-700',
  green: 'from-emerald-500 to-emerald-700',
  purple: 'from-purple-500 to-purple-700',
  orange: 'from-orange-500 to-orange-700',
};

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  titleHindi,
  subtitle,
  badge,
  badgeColor = 'red',
  gradient,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl p-6 text-white cursor-pointer
        bg-gradient-to-br ${gradientClasses[gradient]}
        card-shadow-lg card-hover
        min-h-[160px] flex flex-col justify-between
      `}
    >
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Badge */}
      {badge && (
        <span className={`
          absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold
          ${badgeColor === 'red' ? 'bg-red-500' : badgeColor === 'green' ? 'bg-green-500' : 'bg-yellow-500'}
        `}>
          {badge}
        </span>
      )}

      {/* Icon */}
      <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl backdrop-blur-sm">
        {icon}
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-white/80">{titleHindi}</p>
        {subtitle && (
          <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
            <span className="w-2 h-2 bg-white/60 rounded-full" />
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActionCard;
```

### 4. CREATE: RecentActivity Component (src/components/common/RecentActivity.tsx)

```tsx
import React from 'react';

interface ActivityItem {
  id: string;
  folio: number;
  customerName: string;
  items: string;
  amount: number;
  time: string;
  status: 'new' | 'pending' | 'ready' | 'delivered' | 'overdue';
}

interface RecentActivityProps {
  activities: ActivityItem[];
  onViewAll: () => void;
  onItemClick: (id: string) => void;
}

const statusConfig = {
  new: { color: 'bg-blue-500', label: 'New', icon: '🆕' },
  pending: { color: 'bg-yellow-500', label: 'Pending', icon: '⏳' },
  ready: { color: 'bg-green-500', label: 'Ready', icon: '✅' },
  delivered: { color: 'bg-gray-400', label: 'Delivered', icon: '📦' },
  overdue: { color: 'bg-red-500', label: 'Overdue', icon: '⚠️' },
};

const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onViewAll,
  onItemClick,
}) => {
  return (
    <div className="bg-white rounded-2xl card-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-800">Recent Activity</h3>
          <p className="text-sm text-gray-500">हाल की गतिविधि</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          View All
          <span>→</span>
        </button>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-50">
        {activities.map((activity) => {
          const status = statusConfig[activity.status];
          return (
            <div
              key={activity.id}
              onClick={() => onItemClick(activity.id)}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {/* Status indicator */}
              <div className={`w-10 h-10 rounded-full ${status.color} flex items-center justify-center text-white text-lg`}>
                {status.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">#{activity.folio}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-700 truncate">{activity.customerName}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{activity.items}</p>
              </div>

              {/* Amount & Time */}
              <div className="text-right">
                <p className="font-bold text-gray-800">₹{activity.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>

              {/* Arrow */}
              <span className="text-gray-300">›</span>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {activities.length === 0 && (
        <div className="py-12 text-center">
          <span className="text-4xl">📭</span>
          <p className="mt-2 text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
```

### 5. CREATE: BottomNav Component (src/components/layout/BottomNav.tsx)

```tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavItem {
  path: string;
  icon: string;
  activeIcon: string;
  label: string;
  labelHindi: string;
}

const navItems: NavItem[] = [
  { path: '/', icon: '🏠', activeIcon: '🏠', label: 'Home', labelHindi: 'होम' },
  { path: '/upload', icon: '📷', activeIcon: '📸', label: 'Upload', labelHindi: 'अपलोड' },
  { path: '/search', icon: '🔍', activeIcon: '🔎', label: 'Search', labelHindi: 'खोजें' },
  { path: '/customers', icon: '👥', activeIcon: '👥', label: 'Customers', labelHindi: 'ग्राहक' },
  { path: '/settings', icon: '⚙️', activeIcon: '⚙️', label: 'More', labelHindi: 'अधिक' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                flex flex-col items-center justify-center flex-1 h-full
                transition-all duration-200
                ${isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              <span className={`text-2xl transition-transform ${isActive ? 'scale-110' : ''}`}>
                {isActive ? item.activeIcon : item.icon}
              </span>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
```

### 6. UPDATE: HomePage (src/pages/HomePage.tsx)

```tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import StatsCard from '../components/common/StatsCard';
import ActionCard from '../components/common/ActionCard';
import RecentActivity from '../components/common/RecentActivity';
import { useBooks } from '../hooks/useBooks';
import { useBills } from '../hooks/useBills';
import { api } from '../api/client';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentBook } = useBooks();
  const [stats, setStats] = useState({
    ordersToday: 0,
    readyToPick: 0,
    overdueDeliveries: 0,
    pendingPayments: 0,
    totalCustomers: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load stats
      const [statsRes, activitiesRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/bills?limit=5&sort=created_at:desc'),
      ]);
      
      setStats(statsRes.data);
      setRecentActivities(activitiesRes.data.bills || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatActivityItem = (bill: any) => ({
    id: bill.id,
    folio: bill.folio_number,
    customerName: bill.customer?.name || 'Unknown',
    items: bill.items?.map((i: any) => i.garment_name).join(', ') || 'No items',
    amount: bill.total_amount || 0,
    time: getRelativeTime(bill.created_at),
    status: bill.status,
  });

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Search Bar */}
        <div className="mb-6">
          <div 
            onClick={() => navigate('/search')}
            className="bg-white rounded-2xl card-shadow px-5 py-4 flex items-center gap-3 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <span className="text-2xl">🔍</span>
            <div className="flex-1">
              <p className="text-gray-400">Search phone, folio, or name...</p>
              <p className="text-sm text-gray-300">फ़ोन, फ़ोलियो या नाम खोजें...</p>
            </div>
            <span className="text-gray-300 text-2xl">›</span>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Today's Summary</h2>
              <p className="text-sm text-gray-500">आज का सारांश</p>
            </div>
            <p className="text-sm text-gray-400">
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              icon="📦"
              value={stats.ordersToday}
              label="Orders Today"
              labelHindi="आज के ऑर्डर"
              color="blue"
              onClick={() => navigate('/bills?filter=today')}
            />
            <StatsCard
              icon="✅"
              value={stats.readyToPick}
              label="Ready to Pick"
              labelHindi="तैयार"
              color="green"
              onClick={() => navigate('/bills?filter=ready')}
            />
            <StatsCard
              icon="⏰"
              value={stats.overdueDeliveries}
              label="Overdue"
              labelHindi="देरी से"
              color="red"
              alert={stats.overdueDeliveries > 0}
              onClick={() => navigate('/deliveries?filter=overdue')}
            />
            <StatsCard
              icon="₹"
              value={`₹${(stats.pendingPayments / 1000).toFixed(1)}k`}
              label="Pending"
              labelHindi="बकाया"
              color="yellow"
              onClick={() => navigate('/bills?filter=pending-payment')}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Quick Actions</h2>
          <p className="text-sm text-gray-500 mb-4">त्वरित कार्य</p>

          <div className="grid grid-cols-2 gap-4">
            <ActionCard
              icon="📷"
              title="Upload Bill"
              titleHindi="बिल अपलोड करें"
              subtitle={currentBook ? `Next: #${(currentBook.last_used_folio || 0) + 1}` : undefined}
              gradient="blue"
              onClick={() => navigate('/upload')}
            />
            <ActionCard
              icon="👤"
              title="New Customer"
              titleHindi="नया ग्राहक"
              subtitle={`Total: ${stats.totalCustomers.toLocaleString()}`}
              gradient="green"
              onClick={() => navigate('/customers/new')}
            />
            <ActionCard
              icon="📚"
              title="Books"
              titleHindi="किताबें"
              subtitle={currentBook ? `Current: ${currentBook.name}` : 'No active book'}
              gradient="purple"
              onClick={() => navigate('/books')}
            />
            <ActionCard
              icon="🚚"
              title="Deliveries"
              titleHindi="डिलीवरी"
              badge={stats.overdueDeliveries > 0 ? stats.overdueDeliveries : undefined}
              badgeColor="red"
              subtitle={`Today: ${stats.readyToPick} pending`}
              gradient="orange"
              onClick={() => navigate('/deliveries')}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <RecentActivity
            activities={recentActivities.map(formatActivityItem)}
            onViewAll={() => navigate('/bills')}
            onItemClick={(id) => navigate(`/bills/${id}`)}
          />
        </div>

        {/* Current Book Info */}
        {currentBook && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current Book / वर्तमान किताब</p>
                <p className="text-2xl font-bold mt-1">{currentBook.name}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Last Folio / अंतिम फ़ोलियो</p>
                <p className="text-2xl font-bold mt-1">#{currentBook.last_used_folio || 0}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between text-sm">
              <span className="text-gray-400">
                Started: {new Date(currentBook.start_date).toLocaleDateString('en-IN')}
              </span>
              <span className="text-gray-400">
                Range: {currentBook.start_serial} - {currentBook.end_serial || '∞'}
              </span>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default HomePage;
```

### 7. UPDATE: SearchBar Component Enhancement

```tsx
// src/components/common/SearchBar.tsx
import React, { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  placeholderHindi?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search phone, folio, or name...",
  placeholderHindi = "फ़ोन, फ़ोलियो या नाम खोजें...",
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div 
        className={`
          bg-white rounded-2xl card-shadow overflow-hidden transition-all duration-300
          ${isFocused ? 'ring-2 ring-blue-500 shadow-lg' : ''}
        `}
      >
        <div className="flex items-center px-5 py-4">
          {/* Search icon */}
          <span className="text-2xl text-gray-400 mr-3">🔍</span>

          {/* Input */}
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="w-full text-gray-800 placeholder-gray-400 outline-none text-lg"
            />
            <p className="text-xs text-gray-300 mt-0.5">{placeholderHindi}</p>
          </div>

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            className="ml-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Quick filters */}
        {isFocused && (
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2">
            <span className="text-xs text-gray-500">Quick:</span>
            <button
              type="button"
              onClick={() => setQuery('today')}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
            >
              Today's bills
            </button>
            <button
              type="button"
              onClick={() => setQuery('pending')}
              className="text-xs px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200"
            >
              Pending delivery
            </button>
            <button
              type="button"
              onClick={() => setQuery('unpaid')}
              className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
            >
              Unpaid
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
```

### 8. UPDATE: Button Component (src/components/common/Button.tsx)

```tsx
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  success: 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/30',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-200 transform active:scale-95
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {loading && (
        <span className="animate-spin">⏳</span>
      )}
      {!loading && icon && iconPosition === 'left' && icon}
      {children}
      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  );
};

export default Button;
```

### 9. UPDATE: Input Component (src/components/common/Input.tsx)

```tsx
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelHindi?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  labelHindi,
  error,
  hint,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {labelHindi && (
            <span className="text-xs text-gray-400 ml-2">{labelHindi}</span>
          )}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
            ${icon && iconPosition === 'left' ? 'pl-12' : ''}
            ${icon && iconPosition === 'right' ? 'pr-12' : ''}
            ${error 
              ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20' 
              : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
            }
            placeholder-gray-400 text-gray-800
            outline-none
            ${className}
          `}
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}

      {hint && !error && (
        <p className="mt-2 text-sm text-gray-400">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
```

### 10. UPDATE: globals.css (src/styles/globals.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --color-primary: #2563EB;
  --color-primary-dark: #1E40AF;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
}

* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Safe area for mobile devices */
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

/* Gradient backgrounds */
.gradient-blue {
  background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
}

.gradient-green {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
}

.gradient-purple {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
}

.gradient-orange {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
}

.gradient-red {
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
}

.gradient-header {
  background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
}

.gradient-dark {
  background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
}

/* Card styles */
.card-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Status animations */
@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.pulse-ring {
  animation: pulse-ring 1.5s infinite;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Custom checkbox */
.custom-checkbox {
  @apply w-5 h-5 rounded border-2 border-gray-300 appearance-none cursor-pointer transition-all;
}

.custom-checkbox:checked {
  @apply bg-blue-600 border-blue-600;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}

/* Loading skeleton */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Toast animations */
.toast-enter {
  transform: translateY(-100%);
  opacity: 0;
}

.toast-enter-active {
  transform: translateY(0);
  opacity: 1;
  transition: all 0.3s ease-out;
}

.toast-exit {
  transform: translateY(0);
  opacity: 1;
}

.toast-exit-active {
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease-in;
}

/* Page transitions */
.page-enter {
  opacity: 0;
  transform: translateX(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease-out;
}

.page-exit {
  opacity: 1;
}

.page-exit-active {
  opacity: 0;
  transition: opacity 0.2s ease-in;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  /* Larger touch targets */
  button, a {
    min-height: 44px;
  }
}

/* High contrast mode */
.theme-high-contrast {
  --bg-primary: #000000;
  --text-primary: #FFFFFF;
  --text-numbers: #FFFF00;
}

.theme-high-contrast body {
  background: #000000;
  color: #FFFFFF;
}

.theme-high-contrast .card-shadow {
  border: 2px solid #FFFFFF;
}

/* Dark mode */
.dark {
  --bg-primary: #1F2937;
  --bg-secondary: #111827;
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
}

.dark body {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.dark .bg-white {
  background: var(--bg-primary);
}

.dark .text-gray-800 {
  color: var(--text-primary);
}

.dark .text-gray-500 {
  color: var(--text-secondary);
}

.dark .border-gray-200 {
  border-color: #374151;
}
```

---

## ADDITIONAL UPDATES NEEDED

### 11. Update tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
```

### 12. Add API endpoint for dashboard stats

Create `GET /api/dashboard/stats` endpoint in backend that returns:

```typescript
// Backend: src/routes/dashboardRoutes.ts
router.get('/stats', async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  const stats = await db.query(`
    SELECT
      (SELECT COUNT(*) FROM bills WHERE DATE(created_at) = $1 AND is_deleted = false) as orders_today,
      (SELECT COUNT(*) FROM bills WHERE status = 'ready' AND is_deleted = false) as ready_to_pick,
      (SELECT COUNT(*) FROM bills WHERE delivery_date < CURRENT_DATE AND status NOT IN ('delivered', 'cancelled') AND is_deleted = false) as overdue_deliveries,
      (SELECT COALESCE(SUM(balance_due), 0) FROM bills WHERE balance_due > 0 AND is_deleted = false) as pending_payments,
      (SELECT COUNT(*) FROM customers WHERE is_deleted = false) as total_customers
  `, [today]);
  
  res.json({
    success: true,
    data: {
      ordersToday: parseInt(stats.rows[0].orders_today),
      readyToPick: parseInt(stats.rows[0].ready_to_pick),
      overdueDeliveries: parseInt(stats.rows[0].overdue_deliveries),
      pendingPayments: parseFloat(stats.rows[0].pending_payments),
      totalCustomers: parseInt(stats.rows[0].total_customers),
    }
  });
});
```

---

## SUMMARY: Files to Create/Update

### Create New Files:
1. `src/components/layout/Header.tsx`
2. `src/components/layout/BottomNav.tsx`
3. `src/components/common/StatsCard.tsx`
4. `src/components/common/ActionCard.tsx`
5. `src/components/common/RecentActivity.tsx`

### Update Existing Files:
1. `src/pages/HomePage.tsx` - Complete redesign
2. `src/components/common/Button.tsx` - Add gradients, sizes
3. `src/components/common/Input.tsx` - Better styling
4. `src/components/common/SearchBar.tsx` - Enhanced version
5. `src/styles/globals.css` - Add all new styles
6. `tailwind.config.js` - Extend theme

### Backend (Minor):
1. Add `GET /api/dashboard/stats` endpoint

---

## EXECUTE NOW

Read this file and update ALL the frontend components as specified. Create all new files with complete code. Update all existing files. Make the UI look professional and premium.

DO NOT:
- Change any backend logic
- Break existing functionality
- Leave any TODOs or placeholders

DO:
- Create beautiful, modern UI
- Add all gradients and shadows
- Make it mobile-responsive
- Add the bottom navigation
- Add the stats dashboard
- Add recent activity feed
- Make cards look premium with hover effects

START NOW!
