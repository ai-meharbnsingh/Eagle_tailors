import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { billAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

function BillDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageZoom, setImageZoom] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadBill();
  }, [id]);

  const loadBill = async () => {
    try {
      const res = await billAPI.getById(id);
      if (res.data.success) {
        setBill(res.data.data);
      }
    } catch (error) {
      console.error('Error loading bill:', error);
      toast.error('Failed to load bill details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async () => {
    const amount = parseFloat(paymentAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (amount > bill.balance_due) {
      toast.error('Amount exceeds balance due');
      return;
    }

    setUpdating(true);
    try {
      const newAdvance = (bill.advance_paid || 0) + amount;
      const res = await billAPI.update(id, { advancePaid: newAdvance });
      if (res.data.success) {
        toast.success(`₹${amount} payment recorded!`);
        setPaymentAmount('');
        setShowPaymentModal(false);
        loadBill();
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to record payment');
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await billAPI.update(id, { status: newStatus });
      if (res.data.success) {
        toast.success(`Status updated to ${newStatus}!`);
        setShowStatusModal(false);
        loadBill();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (bill.balance_due > 0) {
      const confirm = window.confirm(`There is ₹${bill.balance_due} balance pending. Mark as delivered anyway?`);
      if (!confirm) return;
    }
    await handleStatusChange('delivered');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered':
        return { bg: '#dcfce7', color: '#16a34a' };
      case 'ready':
        return { bg: '#dbeafe', color: '#2563eb' };
      case 'stitching':
      case 'cutting':
        return { bg: '#fef3c7', color: '#d97706' };
      default:
        return { bg: '#f3f4f6', color: '#6b7280' };
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

  if (!bill) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#faf9f7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>Bill not found</p>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 24px',
            background: '#1e3a5f',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  const statusStyle = getStatusStyle(bill.status);

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
          onClick={() => navigate(`/customer/${bill.customer_id}`)}
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
          ← Back to Customer
        </button>

        {/* Bill Header Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0
              }}>
                Bill #{bill.folio_number}
              </h2>
              <p style={{
                fontSize: '13px',
                color: '#9ca3af',
                margin: '4px 0 0 0'
              }}>
                📖 {bill.book_name}
              </p>
            </div>
            <span style={{
              fontSize: '12px',
              padding: '6px 14px',
              borderRadius: '8px',
              fontWeight: '600',
              background: statusStyle.bg,
              color: statusStyle.color,
              textTransform: 'capitalize'
            }}>
              {bill.status}
            </span>
          </div>

          {/* Customer Info */}
          <div
            onClick={() => navigate(`/customer/${bill.customer_id}`)}
            style={{
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f9fafb'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                background: '#1e3a5f15',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                👤
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  {bill.customer_name}
                </p>
                {bill.customer_phones && bill.customer_phones.length > 0 && (
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0 0' }}>
                    📞 {bill.customer_phones.map(p => p.phone).join(', ')}
                  </p>
                )}
                {bill.customer_address && (
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                    📍 {bill.customer_address}
                  </p>
                )}
              </div>
              <span style={{ color: '#d1d5db', fontSize: '18px' }}>›</span>
            </div>
          </div>
        </div>

        {/* Bill Image */}
        {bill.image_url && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 12px 0'
            }}>
              Bill Image / बिल की फोटो
            </h3>
            <img
              src={bill.image_url}
              alt={`Bill #${bill.folio_number}`}
              style={{
                width: '100%',
                maxWidth: '100%',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
              onClick={() => setImageZoom(true)}
            />
            <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px', textAlign: 'center' }}>
              Tap image to zoom
            </p>
          </div>
        )}

        {/* Bill Details */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Details / विवरण
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            <div style={{
              background: '#f9fafb',
              borderRadius: '10px',
              padding: '14px'
            }}>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                Book
              </p>
              <p style={{ fontSize: '15px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                📖 {bill.book_name}
              </p>
            </div>
            <div style={{
              background: '#f9fafb',
              borderRadius: '10px',
              padding: '14px'
            }}>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                Folio Number
              </p>
              <p style={{ fontSize: '15px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                #{bill.folio_number}
              </p>
            </div>
            {bill.bill_date && (
              <div style={{
                background: '#f9fafb',
                borderRadius: '10px',
                padding: '14px'
              }}>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                  Bill Date
                </p>
                <p style={{ fontSize: '15px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                  {format(new Date(bill.bill_date), 'dd MMM yyyy')}
                </p>
              </div>
            )}
            {bill.delivery_date && (
              <div style={{
                background: '#f9fafb',
                borderRadius: '10px',
                padding: '14px'
              }}>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                  Delivery Date
                </p>
                <p style={{ fontSize: '15px', fontWeight: '500', color: '#1f2937', margin: 0 }}>
                  {format(new Date(bill.delivery_date), 'dd MMM yyyy')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Financial Details */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Financial Details / वित्तीय विवरण
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <div style={{
              background: '#f9fafb',
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                Total / कुल
              </p>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                ₹{(bill.total_amount || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div style={{
              background: '#f0fdf4',
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '11px', color: '#16a34a', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
                Paid / भुगतान
              </p>
              <p style={{ fontSize: '22px', fontWeight: '700', color: '#16a34a', margin: 0 }}>
                ₹{(bill.advance_paid || 0).toLocaleString('en-IN')}
              </p>
            </div>
            <div style={{
              background: bill.balance_due > 0 ? '#fef2f2' : '#f0fdf4',
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '11px',
                color: bill.balance_due > 0 ? '#ef4444' : '#16a34a',
                margin: '0 0 6px 0',
                textTransform: 'uppercase'
              }}>
                Balance / बकाया
              </p>
              <p style={{
                fontSize: '22px',
                fontWeight: '700',
                color: bill.balance_due > 0 ? '#ef4444' : '#16a34a',
                margin: 0
              }}>
                ₹{(bill.balance_due || 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginTop: '20px',
            flexWrap: 'wrap'
          }}>
            {bill.balance_due > 0 && (
              <button
                onClick={() => setShowPaymentModal(true)}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                💰 Add Payment / भुगतान जोड़ें
              </button>
            )}
            {bill.balance_due === 0 && bill.status !== 'delivered' && (
              <div style={{
                flex: 1,
                padding: '14px',
                background: '#dcfce7',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <span style={{ color: '#16a34a', fontWeight: '600' }}>✓ Fully Paid / पूरा भुगतान</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Update Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 16px 0'
          }}>
            Order Status / ऑर्डर स्थिति
          </h3>

          {/* Status Progress */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            position: 'relative'
          }}>
            {['cutting', 'stitching', 'ready', 'delivered'].map((status, index) => {
              const isActive = ['cutting', 'stitching', 'ready', 'delivered'].indexOf(bill.status) >= index;
              const isCurrent = bill.status === status;
              return (
                <div key={status} style={{
                  flex: 1,
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  {index > 0 && (
                    <div style={{
                      position: 'absolute',
                      left: '-50%',
                      top: '15px',
                      width: '100%',
                      height: '3px',
                      background: isActive ? '#16a34a' : '#e5e7eb',
                      zIndex: 0
                    }} />
                  )}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isActive ? '#16a34a' : '#e5e7eb',
                    color: isActive ? 'white' : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    position: 'relative',
                    zIndex: 1,
                    border: isCurrent ? '3px solid #1e3a5f' : 'none'
                  }}>
                    {isActive ? '✓' : index + 1}
                  </div>
                  <p style={{
                    fontSize: '11px',
                    color: isActive ? '#16a34a' : '#9ca3af',
                    margin: 0,
                    textTransform: 'capitalize',
                    fontWeight: isCurrent ? '600' : '400'
                  }}>
                    {status === 'cutting' ? 'Cutting' :
                     status === 'stitching' ? 'Stitching' :
                     status === 'ready' ? 'Ready' : 'Delivered'}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Status Action Buttons */}
          {bill.status !== 'delivered' && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowStatusModal(true)}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                🔄 Change Status
              </button>
              <button
                onClick={handleMarkDelivered}
                disabled={updating}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: bill.status === 'ready' ? '#1e3a5f' : '#f3f4f6',
                  color: bill.status === 'ready' ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: updating ? 'not-allowed' : 'pointer'
                }}
              >
                ✓ Mark Delivered / डिलीवर किया
              </button>
            </div>
          )}

          {bill.status === 'delivered' && (
            <div style={{
              padding: '16px',
              background: '#dcfce7',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '20px' }}>🎉</span>
              <p style={{ color: '#16a34a', fontWeight: '600', margin: '8px 0 0 0' }}>
                Order Delivered Successfully!
              </p>
            </div>
          )}
        </div>

        {/* Remarks */}
        {bill.remarks && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 12px 0'
            }}>
              Remarks / टिप्पणी
            </h3>
            <p style={{
              padding: '14px',
              background: '#f9fafb',
              borderRadius: '10px',
              fontSize: '14px',
              color: '#6b7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {bill.remarks}
            </p>
          </div>
        )}

        {/* Measurements */}
        {bill.measurements && bill.measurements.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
          }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 16px 0'
            }}>
              Measurements / माप
            </h3>
            {bill.measurements.map((m, index) => (
              <div
                key={index}
                style={{
                  background: '#f9fafb',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: index < bill.measurements.length - 1 ? '12px' : 0
                }}
              >
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 10px 0'
                }}>
                  {m.garment_name || 'Garment'}
                </h4>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {m.measurements && Object.entries(m.measurements).map(([key, value]) => (
                    <span
                      key={key}
                      style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        background: 'white',
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}
                    >
                      {key}: <strong>{value}</strong>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0' }}>
              Add Payment / भुगतान जोड़ें
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
                Balance Due: <strong style={{ color: '#ef4444' }}>₹{bill.balance_due?.toLocaleString('en-IN')}</strong>
              </p>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '18px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {[100, 500, 1000, bill.balance_due].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setPaymentAmount(amount.toString())}
                  style={{
                    padding: '8px 16px',
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {amount === bill.balance_due ? 'Full Amount' : `₹${amount}`}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setShowPaymentModal(false); setPaymentAmount(''); }}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                disabled={updating || !paymentAmount}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: updating || !paymentAmount ? '#9ca3af' : '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: updating || !paymentAmount ? 'not-allowed' : 'pointer'
                }}
              >
                {updating ? 'Saving...' : '✓ Add Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 20px 0' }}>
              Change Status / स्थिति बदलें
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { value: 'cutting', label: '✂️ Cutting / कटाई', color: '#fef3c7' },
                { value: 'stitching', label: '🧵 Stitching / सिलाई', color: '#fef3c7' },
                { value: 'ready', label: '✅ Ready / तैयार', color: '#dbeafe' },
                { value: 'delivered', label: '🚚 Delivered / डिलीवर', color: '#dcfce7' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  disabled={updating || bill.status === option.value}
                  style={{
                    padding: '16px',
                    background: bill.status === option.value ? option.color : '#f9fafb',
                    border: bill.status === option.value ? '2px solid #1e3a5f' : '1px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: bill.status === option.value ? '600' : '400',
                    cursor: bill.status === option.value ? 'default' : 'pointer',
                    textAlign: 'left'
                  }}
                >
                  {option.label}
                  {bill.status === option.value && ' (Current)'}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowStatusModal(false)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#f3f4f6',
                color: '#6b7280',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {imageZoom && bill.image_url && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
            cursor: 'pointer'
          }}
          onClick={() => setImageZoom(false)}
        >
          <button
            onClick={() => setImageZoom(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
          <img
            src={bill.image_url}
            alt={`Bill #${bill.folio_number}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}
    </div>
  );
}

export default BillDetailPage;
