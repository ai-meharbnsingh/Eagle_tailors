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
    upcoming: deliveries.filter(b => !isPast(new Date(b.delivery_date)) && !isToday(new Date(b.delivery_date)))
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
    const status = getDeliveryStatus(bill.delivery_date);
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
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                📅 {format(new Date(bill.delivery_date), 'dd MMM yyyy')}
              </span>
              {bill.customer_phones && bill.customer_phones.length > 0 && (
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                  📞 {bill.customer_phones[0].phone}
                </span>
              )}
            </div>

            {bill.balance_due > 0 && (
              <div style={{
                marginTop: '10px',
                fontSize: '13px',
                color: '#ef4444',
                fontWeight: '500'
              }}>
                Balance: ₹{bill.balance_due.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <span style={{
            fontSize: '11px',
            padding: '4px 10px',
            borderRadius: '6px',
            fontWeight: '500',
            background: status.bg,
            color: status.color
          }}>
            {status.text}
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
      </main>

      <BottomNav />
    </div>
  );
}

export default DeliveriesPage;
