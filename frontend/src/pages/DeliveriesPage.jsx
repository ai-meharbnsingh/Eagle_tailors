import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billAPI } from '../services/api';
import { format, isPast, isToday } from 'date-fns';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

function DeliveriesPage() {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      const res = await billAPI.getDueDeliveries();
      if (res.data.success) {
        setDeliveries(res.data.data);
      }
    } catch (error) {
      console.error('Error loading deliveries:', error);
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryStatus = (deliveryDate) => {
    if (!deliveryDate) return null;
    const date = new Date(deliveryDate);

    if (isToday(date)) {
      return { text: 'Due Today', color: '#f59e0b', bg: '#fef3c7' };
    } else if (isPast(date)) {
      return { text: 'Overdue', color: '#ef4444', bg: '#fef2f2' };
    } else {
      return { text: 'Upcoming', color: '#3b82f6', bg: '#eff6ff' };
    }
  };

  const groupedDeliveries = {
    overdue: deliveries.filter(b => isPast(new Date(b.delivery_date)) && !isToday(new Date(b.delivery_date))),
    today: deliveries.filter(b => isToday(new Date(b.delivery_date))),
    upcoming: deliveries.filter(b => !isPast(new Date(b.delivery_date)) && !isToday(new Date(b.delivery_date))),
    ready: deliveries.filter(b => b.status === 'ready'),
    stitching: deliveries.filter(b => b.status === 'stitching'),
    cutting: deliveries.filter(b => b.status === 'cutting')
  };

  const handleMarkDelivered = async (bill, e) => {
    e.stopPropagation();
    if (bill.balance_due > 0) {
      toast.error('Please collect pending payment first');
      setSelectedBill(bill);
      setShowPaymentModal(true);
      return;
    }
    setUpdating(true);
    try {
      const res = await billAPI.update(bill.id, { status: 'delivered' });
      if (res.data.success) {
        toast.success('Marked as delivered! ✅');
        loadDeliveries();
      }
    } catch (error) {
      console.error('Error marking delivered:', error);
      toast.error('Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenPayment = (bill, e) => {
    e.stopPropagation();
    setSelectedBill(bill);
    setPaymentAmount(bill.balance_due?.toString() || '');
    setShowPaymentModal(true);
  };

  const handleAddPayment = async () => {
    if (!selectedBill) return;
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error('Enter valid amount');
      return;
    }
    if (amount > selectedBill.balance_due) {
      toast.error('Amount exceeds balance');
      return;
    }
    setUpdating(true);
    try {
      const newAdvance = (selectedBill.advance_paid || 0) + amount;
      const res = await billAPI.update(selectedBill.id, { advancePaid: newAdvance });
      if (res.data.success) {
        toast.success(`₹${amount} payment recorded!`);
        setShowPaymentModal(false);
        setSelectedBill(null);
        setPaymentAmount('');
        loadDeliveries();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to record payment');
    } finally {
      setUpdating(false);
    }
  };

  const getFilteredDeliveries = () => {
    switch (activeFilter) {
      case 'overdue': return groupedDeliveries.overdue;
      case 'today': return groupedDeliveries.today;
      case 'upcoming': return groupedDeliveries.upcoming;
      case 'ready': return groupedDeliveries.ready;
      case 'stitching': return groupedDeliveries.stitching;
      case 'cutting': return groupedDeliveries.cutting;
      default: return deliveries;
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
        <div className="spinner"></div>
      </div>
    );
  }

  const DeliveryCard = ({ bill }) => {
    const dateStatus = getDeliveryStatus(bill.delivery_date);
    const statusConfig = {
      cutting: { icon: '✂️', text: 'Cutting', color: '#9333ea', bg: '#f3e8ff' },
      stitching: { icon: '🧵', text: 'Stitching', color: '#d97706', bg: '#fef3c7' },
      ready: { icon: '✅', text: 'Ready', color: '#059669', bg: '#d1fae5' }
    };
    const workStatus = statusConfig[bill.status] || statusConfig.cutting;

    return (
      <div
        onClick={() => navigate(`/bill/${bill.id}`)}
        style={{
          background: 'white',
          borderRadius: '14px',
          padding: '18px 20px',
          cursor: 'pointer',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          marginBottom: '12px',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#1f2937'
              }}>
                #{bill.folio_number}
              </span>
              <span style={{ color: '#d1d5db' }}>•</span>
              <span style={{
                fontSize: '14px',
                color: '#6b7280'
              }}>
                {bill.customer_name}
              </span>
              {bill.customer_code && (
                <span style={{
                  fontSize: '10px',
                  background: '#1e3a5f',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: '500'
                }}>
                  {bill.customer_code}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                📅 {format(new Date(bill.delivery_date), 'dd MMM yyyy')}
              </span>
              {bill.customer_phones && bill.customer_phones.length > 0 && (
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                  📞 {bill.customer_phones[0].phone}
                </span>
              )}
              <span style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '5px',
                fontWeight: '500',
                background: workStatus.bg,
                color: workStatus.color
              }}>
                {workStatus.icon} {workStatus.text}
              </span>
            </div>

            {bill.balance_due > 0 && (
              <div style={{
                marginTop: '10px',
                fontSize: '13px',
                color: '#ef4444',
                fontWeight: '500'
              }}>
                Balance Due: ₹{bill.balance_due.toLocaleString('en-IN')}
              </div>
            )}

            {/* Quick Actions */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '12px'
            }}>
              {bill.balance_due > 0 && (
                <button
                  onClick={(e) => handleOpenPayment(bill, e)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: '#dbeafe',
                    color: '#2563eb',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  💵 Add Payment
                </button>
              )}
              {bill.status === 'ready' && (
                <button
                  onClick={(e) => handleMarkDelivered(bill, e)}
                  disabled={updating}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: bill.balance_due > 0 ? '#f3f4f6' : '#d1fae5',
                    color: bill.balance_due > 0 ? '#9ca3af' : '#059669',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: bill.balance_due > 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🚚 Mark Delivered
                </button>
              )}
            </div>
          </div>

          <span style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: '500',
            background: dateStatus.bg,
            color: dateStatus.color
          }}>
            {dateStatus.text}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf9f7',
      paddingBottom: '90px'
    }}>
      <Header />

      <main style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px 20px'
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#1e3a5f',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '20px',
            padding: '8px 0'
          }}
        >
          ← Back to Home
        </button>

        {/* Page Header with Stats */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 6px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🚚 Deliveries
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            margin: '0 0 20px 0'
          }}>
            डिलीवरी प्रबंधित करें
          </p>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              background: '#fef2f2',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444', margin: 0 }}>
                {groupedDeliveries.overdue.length}
              </p>
              <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0', fontWeight: '500' }}>
                Overdue
              </p>
            </div>
            <div style={{
              background: '#fef3c7',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b', margin: 0 }}>
                {groupedDeliveries.today.length}
              </p>
              <p style={{ fontSize: '12px', color: '#f59e0b', margin: '4px 0 0 0', fontWeight: '500' }}>
                Due Today
              </p>
            </div>
            <div style={{
              background: '#eff6ff',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', margin: 0 }}>
                {groupedDeliveries.upcoming.length}
              </p>
              <p style={{ fontSize: '12px', color: '#3b82f6', margin: '4px 0 0 0', fontWeight: '500' }}>
                Upcoming
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {[
            { key: 'all', label: 'All', count: deliveries.length },
            { key: 'overdue', label: '⚠️ Overdue', count: groupedDeliveries.overdue.length, color: '#ef4444' },
            { key: 'today', label: '📅 Today', count: groupedDeliveries.today.length, color: '#f59e0b' },
            { key: 'ready', label: '✅ Ready', count: groupedDeliveries.ready.length, color: '#059669' },
            { key: 'stitching', label: '🧵 Stitching', count: groupedDeliveries.stitching.length, color: '#d97706' },
            { key: 'cutting', label: '✂️ Cutting', count: groupedDeliveries.cutting.length, color: '#9333ea' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              style={{
                padding: '8px 14px',
                fontSize: '13px',
                fontWeight: '500',
                background: activeFilter === filter.key ? (filter.color || '#1e3a5f') : 'white',
                color: activeFilter === filter.key ? 'white' : '#6b7280',
                border: activeFilter === filter.key ? 'none' : '1px solid #e5e7eb',
                borderRadius: '20px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {filter.label}
              <span style={{
                background: activeFilter === filter.key ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                padding: '2px 6px',
                borderRadius: '10px',
                fontSize: '11px'
              }}>
                {filter.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filtered Results */}
        {activeFilter !== 'all' ? (
          <div style={{ marginBottom: '24px' }}>
            {getFilteredDeliveries().length > 0 ? (
              getFilteredDeliveries().map((bill) => (
                <DeliveryCard key={bill.id} bill={bill} />
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'white',
                borderRadius: '14px'
              }}>
                <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                  No deliveries in this category
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
        {/* Overdue Section */}
        {groupedDeliveries.overdue.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#ef4444',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚠️ Overdue ({groupedDeliveries.overdue.length})
            </h3>
            {groupedDeliveries.overdue.map((bill) => (
              <DeliveryCard key={bill.id} bill={bill} />
            ))}
          </div>
        )}

        {/* Due Today Section */}
        {groupedDeliveries.today.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#f59e0b',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📅 Due Today ({groupedDeliveries.today.length})
            </h3>
            {groupedDeliveries.today.map((bill) => (
              <DeliveryCard key={bill.id} bill={bill} />
            ))}
          </div>
        )}

        {/* Upcoming Section */}
        {groupedDeliveries.upcoming.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#3b82f6',
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📆 Upcoming ({groupedDeliveries.upcoming.length})
            </h3>
            {groupedDeliveries.upcoming.slice(0, 10).map((bill) => (
              <DeliveryCard key={bill.id} bill={bill} />
            ))}
            {groupedDeliveries.upcoming.length > 10 && (
              <p style={{
                textAlign: 'center',
                fontSize: '13px',
                color: '#9ca3af',
                marginTop: '16px'
              }}>
                ... and {groupedDeliveries.upcoming.length - 10} more
              </p>
            )}
          </div>
        )}

        {/* Empty State */}
        {deliveries.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              No pending deliveries
            </p>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: '4px 0 0 0' }}>
              कोई लंबित डिलीवरी नहीं
            </p>
          </div>
        )}
          </>
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 8px 0'
            }}>
              💵 Add Payment
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0 0 20px 0'
            }}>
              Folio #{selectedBill.folio_number} • {selectedBill.customer_name}
            </p>

            <div style={{
              background: '#f9fafb',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Balance Due</span>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#ef4444' }}>
                ₹{selectedBill.balance_due?.toLocaleString()}
              </span>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Payment Amount
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedBill(null);
                  setPaymentAmount('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                disabled={updating}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  background: '#059669',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  opacity: updating ? 0.7 : 1
                }}
              >
                {updating ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default DeliveriesPage;
