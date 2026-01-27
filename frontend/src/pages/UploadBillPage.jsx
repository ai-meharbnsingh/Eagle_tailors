import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { billAPI, customerAPI, bookAPI } from '../services/api';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

function UploadBillPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [customerPreview, setCustomerPreview] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    folioNumber: '',
    billDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    totalAmount: '',
    advancePaid: '',
    remarks: ''
  });

  useEffect(() => {
    loadCurrentBook();
  }, []);

  const loadCurrentBook = async () => {
    try {
      const res = await bookAPI.getCurrent();
      if (res.data.success && res.data.data) {
        setCurrentBook(res.data.data);
        const nextFolio = (res.data.data.last_folio || res.data.data.start_serial - 1) + 1;
        setFormData(prev => ({ ...prev, folioNumber: nextFolio.toString() }));
      } else {
        toast.error('No current book found. Please create a book first.');
      }
    } catch (error) {
      console.error('Error loading current book:', error);
      toast.error('Failed to load current book');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePhoneChange = async (e) => {
    const phone = e.target.value;
    setFormData({ ...formData, phone });

    if (phone.length >= 3) {
      try {
        let foundCustomer = null;

        // Try phone search first (works for partial matches like 991099...)
        try {
          const phoneRes = await customerAPI.search(phone, 'phone');
          if (phoneRes.data?.success && phoneRes.data?.data?.length > 0) {
            foundCustomer = phoneRes.data.data[0];
          }
        } catch (phoneErr) {
          console.log('Phone search error:', phoneErr);
        }

        // If phone search didn't find anything, try name search as fallback
        if (!foundCustomer) {
          try {
            const nameRes = await customerAPI.search(phone, 'name');
            if (nameRes.data?.success && nameRes.data?.data?.length > 0) {
              foundCustomer = nameRes.data.data[0];
            }
          } catch (nameErr) {
            console.log('Name search error:', nameErr);
          }
        }

        setCustomerPreview(foundCustomer);
      } catch (error) {
        console.error('Error searching customer:', error);
        setCustomerPreview(null);
      }
    } else {
      setCustomerPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    if (!formData.phone) {
      toast.error('Phone number is required');
      return;
    }

    if (!customerPreview) {
      const create = window.confirm('Customer not found. Create new customer?');
      if (create) {
        navigate(`/customer/new?phone=${formData.phone}&returnTo=/upload`);
        return;
      }
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('image', imageFile);
      data.append('bookId', currentBook.id);
      data.append('customerId', customerPreview.id);
      data.append('folioNumber', formData.folioNumber);
      data.append('billDate', formData.billDate);
      data.append('deliveryDate', formData.deliveryDate);
      data.append('totalAmount', formData.totalAmount);
      data.append('advancePaid', formData.advancePaid);
      data.append('remarks', formData.remarks);

      const res = await billAPI.create(data);

      if (res.data.success) {
        toast.success('Bill uploaded successfully!');
        navigate(`/bill/${res.data.data.id}`);
      }
    } catch (error) {
      console.error('Error uploading bill:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to upload bill');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    fontSize: '15px',
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: 'white'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  };

  const labelHindiStyle = {
    color: '#9ca3af',
    fontWeight: '400',
    marginLeft: '6px',
    fontSize: '12px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf9f7',
      paddingBottom: '90px'
    }}>
      <Header />

      <main style={{
        maxWidth: '600px',
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

        {/* Form Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 6px 0'
          }}>
            Upload Bill
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            margin: '0 0 28px 0'
          }}>
            बिल अपलोड करें
          </p>

          <form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>
                Bill Image <span style={{ color: '#ef4444' }}>*</span>
                <span style={labelHindiStyle}>बिल की फोटो</span>
              </label>
              <div
                onClick={() => document.getElementById('image-input').click()}
                style={{
                  border: '2px dashed #e5e7eb',
                  borderRadius: '14px',
                  padding: imagePreview ? '0' : '40px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: '#fafafa',
                  transition: 'all 0.2s',
                  overflow: 'hidden'
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      maxHeight: '300px',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>📷</div>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
                      Take Photo / फोटो लें
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                      or choose from Gallery / गैलरी से चुनें
                    </p>
                  </>
                )}
              </div>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Folio Number */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Folio Number <span style={{ color: '#ef4444' }}>*</span>
                <span style={labelHindiStyle}>फोलियो नंबर</span>
              </label>
              <input
                type="number"
                style={inputStyle}
                value={formData.folioNumber}
                onChange={(e) => setFormData({ ...formData, folioNumber: e.target.value })}
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e3a5f';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
                💡 Auto-suggested. Change only if different.
              </p>
            </div>

            {/* Phone Number */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Phone Number <span style={{ color: '#ef4444' }}>*</span>
                <span style={labelHindiStyle}>फोन नंबर</span>
              </label>
              <input
                type="tel"
                style={inputStyle}
                value={formData.phone}
                onChange={handlePhoneChange}
                placeholder="9876543210"
                required
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e3a5f';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Customer Preview */}
            {customerPreview && (
              <div style={{
                background: '#f0fdf4',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                border: '1px solid #bbf7d0'
              }}>
                <p style={{ fontSize: '12px', color: '#16a34a', marginBottom: '8px', fontWeight: '500' }}>
                  ✓ Customer Found / ग्राहक मिला
                </p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                  👤 {customerPreview.name}
                </p>
                {customerPreview.address && (
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                    📍 {customerPreview.address}
                  </p>
                )}
              </div>
            )}

            {/* Two Column Layout for Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>
                  Bill Date
                  <span style={labelHindiStyle}>बिल तिथि</span>
                </label>
                <input
                  type="date"
                  style={inputStyle}
                  value={formData.billDate}
                  onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1e3a5f';
                    e.target.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Delivery Date
                  <span style={labelHindiStyle}>डिलीवरी तिथि</span>
                </label>
                <input
                  type="date"
                  style={inputStyle}
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1e3a5f';
                    e.target.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Two Column Layout for Amounts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>
                  Total Amount
                  <span style={labelHindiStyle}>कुल राशि</span>
                </label>
                <input
                  type="number"
                  style={inputStyle}
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                  placeholder="₹ 0"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1e3a5f';
                    e.target.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Advance Paid
                  <span style={labelHindiStyle}>अग्रिम राशि</span>
                </label>
                <input
                  type="number"
                  style={inputStyle}
                  value={formData.advancePaid}
                  onChange={(e) => setFormData({ ...formData, advancePaid: e.target.value })}
                  placeholder="₹ 0"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1e3a5f';
                    e.target.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Remarks */}
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>
                Remarks
                <span style={labelHindiStyle}>टिप्पणी</span>
              </label>
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Any special notes..."
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e3a5f';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                background: loading ? '#9ca3af' : '#1e3a5f',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Uploading...
                </>
              ) : (
                <>💾 SAVE / सेव करें</>
              )}
            </button>
          </form>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default UploadBillPage;
