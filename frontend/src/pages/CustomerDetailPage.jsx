import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerAPI, billAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    address: '',
    notes: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [customerRes, billsRes] = await Promise.all([
        customerAPI.getById(id),
        billAPI.getByCustomer(id)
      ]);

      if (customerRes.data.success) {
        setCustomer(customerRes.data.data);
      }

      if (billsRes.data.success) {
        setBills(billsRes.data.data);
      }
    } catch (error) {
      console.error('Error loading customer:', error);
      toast.error('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setEditForm({
      name: customer.name || '',
      address: customer.address || '',
      notes: customer.notes || ''
    });
    setIsEditing(true);
  };

  const handleEditSave = async () => {
    if (!editForm.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setSaving(true);
    try {
      const res = await customerAPI.update(id, {
        name: editForm.name,
        address: editForm.address,
        notes: editForm.notes
      });

      if (res.data.success) {
        toast.success('Customer updated successfully!');
        setIsEditing(false);
        loadData();
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Failed to update customer');
    } finally {
      setSaving(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditForm({ name: '', address: '', notes: '' });
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

  if (!customer) {
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
        <p style={{ fontSize: '16px', color: '#6b7280' }}>Customer not found</p>
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

  // Group bills by book
  const billsByBook = bills.reduce((acc, bill) => {
    const bookName = bill.book_name || 'Unknown';
    if (!acc[bookName]) {
      acc[bookName] = [];
    }
    acc[bookName].push(bill);
    return acc;
  }, {});

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

        {/* Customer Info Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              background: '#1e3a5f15',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h2 style={{
                  fontSize: '22px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  {customer.name}
                </h2>
                {customer.customer_code && (
                  <span style={{
                    fontSize: '12px',
                    background: '#1e3a5f',
                    color: 'white',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}>
                    {customer.customer_code}
                  </span>
                )}
              </div>
              <p style={{
                fontSize: '13px',
                color: '#9ca3af',
                margin: 0
              }}>
                Customer since {customer.created_at ? format(new Date(customer.created_at), 'MMM yyyy') : 'N/A'}
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={handleEditClick}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 16px 0' }}>
                Edit Customer / ग्राहक संपादित करें
              </h4>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Name / नाम *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Address / पता
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Notes / नोट्स
                </label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '10px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleEditSave}
                  disabled={saving}
                  style={{
                    padding: '12px 24px',
                    background: saving ? '#9ca3af' : '#1e3a5f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Saving...' : '✓ Save Changes'}
                </button>
                <button
                  onClick={handleEditCancel}
                  disabled={saving}
                  style={{
                    padding: '12px 24px',
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
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div style={{ marginBottom: '20px' }}>
            {customer.phones && customer.phones.length > 0 && (
              <div style={{ marginBottom: '10px' }}>
                {customer.phones.map((phoneObj, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '6px'
                  }}>
                    <span style={{ fontSize: '15px' }}>📞 {phoneObj.phone}</span>
                    {phoneObj.is_primary && (
                      <span style={{
                        fontSize: '10px',
                        background: '#dbeafe',
                        color: '#2563eb',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: '500'
                      }}>
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {customer.address && (
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                📍 {customer.address}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          {customer.stats && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px'
            }}>
              <div style={{
                background: '#f9fafb',
                borderRadius: '10px',
                padding: '14px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  {customer.stats.total_bills || 0}
                </p>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                  Total Bills
                </p>
              </div>
              <div style={{
                background: '#f9fafb',
                borderRadius: '10px',
                padding: '14px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  ₹{((customer.stats.total_value || 0) / 1000).toFixed(1)}k
                </p>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                  Total Value
                </p>
              </div>
              <div style={{
                background: '#fef3c7',
                borderRadius: '10px',
                padding: '14px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '22px', fontWeight: '700', color: '#d97706', margin: 0 }}>
                  {customer.stats.pending_orders || 0}
                </p>
                <p style={{ fontSize: '11px', color: '#d97706', margin: '4px 0 0 0' }}>
                  Pending
                </p>
              </div>
              <div style={{
                background: '#fef2f2',
                borderRadius: '10px',
                padding: '14px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '22px', fontWeight: '700', color: '#ef4444', margin: 0 }}>
                  ₹{((customer.stats.total_balance_due || 0) / 1000).toFixed(1)}k
                </p>
                <p style={{ fontSize: '11px', color: '#ef4444', margin: '4px 0 0 0' }}>
                  Balance Due
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bills by Book */}
        {Object.entries(billsByBook).map(([bookName, bookBills]) => (
          <div key={bookName} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            marginBottom: '16px'
          }}>
            <h3 style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📖 {bookName}
              <span style={{
                fontSize: '12px',
                fontWeight: '400',
                color: '#9ca3af'
              }}>
                ({bookBills.length} bill{bookBills.length > 1 ? 's' : ''})
              </span>
            </h3>

            {bookBills.map((bill, index) => {
              const statusStyle = getStatusStyle(bill.status);
              return (
                <div
                  key={bill.id}
                  onClick={() => navigate(`/bill/${bill.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    marginBottom: index < bookBills.length - 1 ? '10px' : 0,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f9fafb';
                  }}
                >
                  {bill.thumbnail_url && (
                    <img
                      src={bill.thumbnail_url}
                      alt={`Bill #${bill.folio_number}`}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>
                        #{bill.folio_number}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: '500',
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        textTransform: 'capitalize'
                      }}>
                        {bill.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {bill.bill_date && (
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          📅 {format(new Date(bill.bill_date), 'dd MMM yyyy')}
                        </span>
                      )}
                      {bill.total_amount && (
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          💰 ₹{bill.total_amount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    {bill.balance_due > 0 && (
                      <p style={{
                        fontSize: '12px',
                        color: '#ef4444',
                        margin: '6px 0 0 0',
                        fontWeight: '500'
                      }}>
                        Balance: ₹{bill.balance_due.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                  <span style={{ color: '#d1d5db', fontSize: '18px' }}>›</span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Empty State */}
        {bills.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              No bills found for this customer
            </p>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: '4px 0 0 0' }}>
              इस ग्राहक के लिए कोई बिल नहीं मिला
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

export default CustomerDetailPage;
