import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { customerAPI } from '../services/api';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

function NewCustomerPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    notes: '',
    phones: [{ phone: searchParams.get('phone') || '', isPrimary: true }]
  });

  const addPhone = () => {
    setFormData({
      ...formData,
      phones: [...formData.phones, { phone: '', isPrimary: false }]
    });
  };

  const removePhone = (index) => {
    const newPhones = formData.phones.filter((_, i) => i !== index);
    setFormData({ ...formData, phones: newPhones });
  };

  const updatePhone = (index, value) => {
    const newPhones = [...formData.phones];
    newPhones[index].phone = value;
    setFormData({ ...formData, phones: newPhones });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (formData.phones.length === 0 || !formData.phones[0].phone.trim()) {
      toast.error('At least one phone number is required');
      return;
    }

    setLoading(true);

    try {
      const res = await customerAPI.create(formData);

      if (res.data.success) {
        toast.success('Customer created successfully!');
        const returnTo = searchParams.get('returnTo');
        if (returnTo) {
          navigate(returnTo);
        } else {
          navigate(`/customer/${res.data.data.id}`);
        }
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      if (error.response?.status === 409) {
        toast.error('Possible duplicate customer found. Please check existing customers.');
      } else {
        toast.error('Failed to create customer');
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
            New Customer
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            margin: '0 0 28px 0'
          }}>
            नया ग्राहक बनाएं
          </p>

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Name <span style={{ color: '#ef4444' }}>*</span>
                <span style={labelHindiStyle}>नाम</span>
              </label>
              <input
                type="text"
                style={inputStyle}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter customer name"
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

            {/* Phone Numbers */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Phone Numbers <span style={{ color: '#ef4444' }}>*</span>
                <span style={labelHindiStyle}>फोन नंबर</span>
              </label>
              {formData.phones.map((phone, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="tel"
                    style={{ ...inputStyle, flex: 1 }}
                    value={phone.phone}
                    onChange={(e) => updatePhone(index, e.target.value)}
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
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removePhone(index)}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '10px',
                        border: '1px solid #fecaca',
                        background: '#fef2f2',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px'
                      }}
                    >
                      🗑
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addPhone}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: '#f3f4f6',
                  border: '1px dashed #d1d5db',
                  borderRadius: '10px',
                  color: '#6b7280',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                + Add Another Phone
              </button>
            </div>

            {/* Address */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Address
                <span style={labelHindiStyle}>पता</span>
              </label>
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
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

            {/* Notes */}
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>
                Notes
                <span style={labelHindiStyle}>टिप्पणी</span>
              </label>
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes"
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
                  Creating...
                </>
              ) : (
                <>💾 Create Customer / ग्राहक बनाएं</>
              )}
            </button>
          </form>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default NewCustomerPage;
