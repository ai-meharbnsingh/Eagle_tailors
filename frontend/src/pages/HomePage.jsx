import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import StatsCard from '../components/common/StatsCard';
import ActionCard from '../components/common/ActionCard';
import { bookAPI, billAPI, customerAPI } from '../services/api';
import toast from 'react-hot-toast';

function HomePage() {
  const navigate = useNavigate();
  const [currentBook, setCurrentBook] = useState(null);
  const [stats, setStats] = useState({
    ordersToday: 0,
    readyToPick: 0,
    overdueDeliveries: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-search when query changes (debounced)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery.trim());
      }, 300); // 300ms debounce
    } else {
      setSearchResults([]);
      setShowResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (query) => {
    setIsSearching(true);
    setShowResults(true);

    try {
      const isNumeric = /^\d+$/.test(query);
      const isCustomerCode = /^ET-?\d*/i.test(query); // Matches ET- or ET followed by numbers
      let allResults = [];

      // Try customer code search first if it looks like a code (ET-XXXXX)
      if (isCustomerCode) {
        try {
          console.log('Searching by code:', query);
          const codeRes = await customerAPI.search(query, 'code');
          console.log('Code search response:', codeRes.data);
          if (codeRes.data?.success && Array.isArray(codeRes.data?.data) && codeRes.data.data.length > 0) {
            allResults = [...codeRes.data.data];
            console.log('Found customers by code:', allResults);
          }
        } catch (e) {
          console.log('Code search failed:', e);
        }
      }

      // Try phone search if it looks like a number
      if (allResults.length === 0 && isNumeric) {
        try {
          console.log('Searching by phone:', query);
          const phoneRes = await customerAPI.search(query, 'phone');
          console.log('Phone search response:', phoneRes.data);
          if (phoneRes.data?.success && Array.isArray(phoneRes.data?.data) && phoneRes.data.data.length > 0) {
            allResults = [...phoneRes.data.data];
            console.log('Found customers by phone:', allResults);
          }
        } catch (e) {
          console.log('Phone search failed:', e);
        }
      }

      // If no results, try name search
      if (allResults.length === 0) {
        try {
          console.log('Searching by name:', query);
          const nameRes = await customerAPI.search(query, 'name');
          console.log('Name search response:', nameRes.data);
          if (nameRes.data?.success && Array.isArray(nameRes.data?.data) && nameRes.data.data.length > 0) {
            allResults = [...nameRes.data.data];
            console.log('Found customers by name:', allResults);
          }
        } catch (e) {
          console.log('Name search failed:', e);
        }
      }

      // If still no results and it's a short number (likely folio), try folio search
      if (allResults.length === 0 && isNumeric && query.length <= 4) {
        try {
          console.log('Searching by folio:', query);
          const billRes = await billAPI.getByFolio(query, currentBook?.id);
          console.log('Folio search response:', billRes.data);
          const billData = billRes.data?.data;

          if (billRes.data?.success && billData) {
            // API returns an array of bills
            if (Array.isArray(billData) && billData.length > 0 && billData[0].folio_number) {
              allResults = billData.map(bill => ({
                type: 'bill',
                ...bill
              }));
              console.log('Found bills by folio:', allResults);
            }
            // Handle if API returns a single object (shouldn't happen but just in case)
            else if (!Array.isArray(billData) && billData.folio_number) {
              allResults = [{
                type: 'bill',
                ...billData
              }];
              console.log('Found single bill by folio:', allResults);
            } else {
              console.log('Folio search returned data but no valid folio_number:', billData);
            }
          }
        } catch (e) {
          console.log('Folio search failed:', e);
        }
      }

      // Filter out any invalid results
      const validResults = allResults.filter(result => {
        if (result.type === 'bill') {
          return result.folio_number !== undefined && result.folio_number !== null;
        }
        return result.id && result.name; // Customers must have id and name
      });
      console.log('Final results:', validResults);
      setSearchResults(validResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (result) => {
    if (result.type === 'bill') {
      navigate(`/bill/${result.id}`);
    } else {
      navigate(`/customer/${result.id}`);
    }
    setShowResults(false);
    setSearchQuery('');
  };

  const loadDashboardData = async () => {
    try {
      // Load essential data first
      const [bookRes, statsRes] = await Promise.all([
        bookAPI.getCurrent(),
        billAPI.getStats(),
      ]);

      if (bookRes.data.success) {
        setCurrentBook(bookRes.data.data);
      }

      if (statsRes.data.success) {
        const apiStats = statsRes.data.data;
        setStats({
          ordersToday: apiStats.total_bills || 0,
          readyToPick: apiStats.ready_count || 0,
          overdueDeliveries: apiStats.overdue_count || 0,
          pendingPayments: apiStats.total_pending || 0,
        });
      }

      // Load upcoming deliveries separately (non-critical)
      try {
        const upcomingRes = await billAPI.getUpcomingDeliveries(3);
        if (upcomingRes.data.success) {
          setUpcomingDeliveries(upcomingRes.data.data || []);
        }
      } catch (upcomingError) {
        console.error('Failed to load upcoming deliveries:', upcomingError);
        // Don't show error toast for this - it's optional
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#faf9f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf9f7',
      paddingBottom: '90px',
      width: '100%'
    }}>
      <Header />

      <main style={{
        width: '100%',
        maxWidth: '960px',
        margin: '0 auto',
        padding: '24px 20px'
      }}>

        {/* Search Bar - Now with actual input */}
        <div
          ref={searchContainerRef}
          style={{
            position: 'relative',
            marginBottom: '32px'
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '14px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              boxShadow: showResults
                ? '0 4px 20px rgba(0,0,0,0.1)'
                : '0 1px 3px rgba(0,0,0,0.04), inset 0 1px 2px rgba(0,0,0,0.02)',
              border: showResults ? '1px solid #1e3a5f' : '1px solid #e5e7eb',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              background: '#f3f4f6',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0
            }}>
              {isSearching ? (
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid #e5e7eb',
                  borderTopColor: '#1e3a5f',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
              ) : '🔍'}
            </div>
            <div style={{ flex: 1 }}>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                placeholder="Search phone, code (ET-), folio, or name..."
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '15px',
                  color: '#1f2937',
                  background: 'transparent',
                  fontWeight: '400'
                }}
              />
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '2px 0 0 0'
              }}>
                फ़ोन, कोड (ET-), फ़ोलियो या नाम खोजें...
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowResults(false);
                  searchInputRef.current?.focus();
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  border: 'none',
                  background: '#f3f4f6',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              background: 'white',
              borderRadius: '14px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 100
            }}>
              {searchResults.length === 0 ? (
                <div style={{
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: 0
                  }}>
                    {isSearching ? 'Searching...' : 'No results found'}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#9ca3af',
                    margin: '4px 0 0 0'
                  }}>
                    {isSearching ? 'खोज रहा है...' : 'कोई परिणाम नहीं मिला'}
                  </p>
                </div>
              ) : (
                <div>
                  {searchResults.map((result, index) => (
                    <div
                      key={result.id || index}
                      onClick={() => handleResultClick(result)}
                      style={{
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                        borderBottom: index < searchResults.length - 1 ? '1px solid #f3f4f6' : 'none',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{
                        width: '44px',
                        height: '44px',
                        background: result.type === 'bill' ? '#3b82f610' : '#10b98110',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px'
                      }}>
                        {result.type === 'bill' ? '📋' : '👤'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1f2937',
                          margin: 0
                        }}>
                          {result.type === 'bill'
                            ? `Folio #${result.folio_number}`
                            : result.name}
                        </p>
                        <p style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          margin: '2px 0 0 0'
                        }}>
                          {result.type === 'bill'
                            ? `₹${result.total_amount || 0}`
                            : `${result.customer_code || ''} ${result.customer_code ? '•' : ''} ${result.phones?.[0]?.phone || 'No phone'}`}
                        </p>
                      </div>
                      <span style={{ color: '#d1d5db', fontSize: '18px' }}>›</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Today's Summary Section */}
        <section style={{ marginBottom: '36px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '18px'
          }}>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                Today's Summary
              </h2>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '2px 0 0 0'
              }}>
                आज का सारांश
              </p>
            </div>
            <span style={{
              fontSize: '12px',
              color: '#6b7280',
              background: '#f3f4f6',
              padding: '6px 12px',
              borderRadius: '20px',
              fontWeight: '500'
            }}>
              {new Date().toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
              })}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            <StatsCard
              icon="📋"
              value={stats.ordersToday}
              label="Total Bills"
              labelHindi="कुल बिल"
              color="navy"
              onClick={() => navigate('/search')}
            />
            <StatsCard
              icon="✓"
              value={stats.readyToPick}
              label="Ready"
              labelHindi="तैयार"
              color="green"
              onClick={() => navigate('/deliveries')}
            />
            <StatsCard
              icon="⏱"
              value={stats.overdueDeliveries}
              label="Overdue"
              labelHindi="देरी से"
              color="red"
              alert={stats.overdueDeliveries > 0}
              onClick={() => navigate('/deliveries')}
            />
            <StatsCard
              icon="₹"
              value={`₹${(stats.pendingPayments / 1000).toFixed(1)}k`}
              label="Pending"
              labelHindi="बकाया"
              color="yellow"
              onClick={() => navigate('/search')}
            />
          </div>
        </section>

        {/* Quick Actions Section */}
        <section style={{ marginBottom: '36px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0
            }}>
              Quick Actions
            </h2>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: '2px 0 0 0'
            }}>
              त्वरित कार्य
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px'
          }}>
            <ActionCard
              icon="📷"
              title="Upload Bill"
              titleHindi="बिल अपलोड"
              subtitle={currentBook ? `Next: #${(currentBook.last_folio || 0) + 1}` : null}
              gradient="blue"
              onClick={() => navigate('/upload')}
            />
            <ActionCard
              icon="👤"
              title="New Customer"
              titleHindi="नया ग्राहक"
              subtitle="Add customer"
              gradient="green"
              onClick={() => navigate('/customer/new')}
            />
            <ActionCard
              icon="📚"
              title="Books"
              titleHindi="किताबें"
              subtitle={currentBook ? currentBook.name : 'Manage'}
              gradient="purple"
              onClick={() => navigate('/books')}
            />
            <ActionCard
              icon="🚚"
              title="Deliveries"
              titleHindi="डिलीवरी"
              badge={stats.overdueDeliveries > 0 ? stats.overdueDeliveries : null}
              badgeColor="red"
              subtitle={`${stats.readyToPick} ready`}
              gradient="orange"
              onClick={() => navigate('/deliveries')}
            />
          </div>
        </section>

        {/* Upcoming Deliveries Section */}
        {upcomingDeliveries.length > 0 && (
          <section style={{ marginBottom: '36px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '18px'
            }}>
              <div>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  🔔 Upcoming Deliveries
                  <span style={{
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>
                    {upcomingDeliveries.length}
                  </span>
                </h2>
                <p style={{
                  fontSize: '12px',
                  color: '#9ca3af',
                  margin: '2px 0 0 0'
                }}>
                  आने वाली डिलीवरी (3 दिनों में)
                </p>
              </div>
              <button
                onClick={() => navigate('/deliveries')}
                style={{
                  fontSize: '12px',
                  color: '#1e3a5f',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                View All →
              </button>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {upcomingDeliveries.slice(0, 5).map((delivery) => {
                const daysUntil = delivery.days_until_delivery;
                const isUrgent = daysUntil <= 1;
                const isToday = daysUntil === 0;

                return (
                  <div
                    key={delivery.id}
                    onClick={() => navigate(`/bill/${delivery.id}`)}
                    style={{
                      background: 'white',
                      borderRadius: '14px',
                      padding: '16px 20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      border: isUrgent ? '2px solid #ef4444' : '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                    }}
                  >
                    {/* Status/Days Badge */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: isToday ? '#fee2e2' : isUrgent ? '#fef3c7' : '#dbeafe',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: isToday ? '#dc2626' : isUrgent ? '#d97706' : '#2563eb'
                      }}>
                        {isToday ? '!' : daysUntil}
                      </span>
                      <span style={{
                        fontSize: '9px',
                        color: isToday ? '#dc2626' : isUrgent ? '#d97706' : '#2563eb',
                        fontWeight: '500',
                        textTransform: 'uppercase'
                      }}>
                        {isToday ? 'Today' : daysUntil === 1 ? 'Day' : 'Days'}
                      </span>
                    </div>

                    {/* Customer & Order Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>
                          {delivery.customer_name}
                        </span>
                        {delivery.customer_code && (
                          <span style={{
                            fontSize: '10px',
                            background: '#1e3a5f',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}>
                            {delivery.customer_code}
                          </span>
                        )}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        <span>📋 Folio #{delivery.folio_number}</span>
                        <span>•</span>
                        <span>📚 {delivery.book_name}</span>
                        <span>•</span>
                        <span style={{
                          color: delivery.status === 'ready' ? '#059669' : '#d97706',
                          fontWeight: '500'
                        }}>
                          {delivery.status === 'cutting' && '✂️ Cutting'}
                          {delivery.status === 'stitching' && '🧵 Stitching'}
                          {delivery.status === 'ready' && '✅ Ready'}
                        </span>
                      </div>
                    </div>

                    {/* Amount & Action */}
                    <div style={{
                      textAlign: 'right',
                      flexShrink: 0
                    }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1f2937',
                        margin: 0
                      }}>
                        ₹{delivery.total_amount?.toLocaleString()}
                      </p>
                      {delivery.balance_due > 0 && (
                        <p style={{
                          fontSize: '11px',
                          color: '#ef4444',
                          margin: '2px 0 0 0',
                          fontWeight: '500'
                        }}>
                          Due: ₹{delivery.balance_due?.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <span style={{ color: '#d1d5db', fontSize: '18px' }}>›</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Current Book Status - Slim elegant card */}
        {currentBook && (
          <section style={{
            background: 'white',
            borderRadius: '14px',
            padding: '18px 22px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            borderLeft: '4px solid #1e3a5f'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  background: '#1e3a5f10',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  📖
                </div>
                <div>
                  <p style={{
                    fontSize: '11px',
                    color: '#9ca3af',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: '500'
                  }}>
                    Current Book
                  </p>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '2px 0 0 0'
                  }}>
                    {currentBook.name}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontSize: '10px',
                    color: '#9ca3af',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    Last Folio
                  </p>
                  <p style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1e3a5f',
                    margin: '2px 0 0 0'
                  }}>
                    #{currentBook.last_folio || 0}
                  </p>
                </div>
                <div style={{
                  width: '1px',
                  height: '36px',
                  background: '#e5e7eb'
                }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontSize: '10px',
                    color: '#9ca3af',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    Range
                  </p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#4b5563',
                    margin: '2px 0 0 0'
                  }}>
                    {currentBook.start_serial} - {currentBook.end_serial || '∞'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

export default HomePage;
