import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState('phone');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, []);

  const performSearch = async () => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    try {
      const res = await customerAPI.search(query, searchType);
      if (res.data.success) {
        setResults(res.data.data);
        if (res.data.data.length === 0) {
          toast.error('No results found');
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf9f7',
      paddingBottom: '90px'
    }}>
      <Header />

      <main style={{
        maxWidth: '700px',
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

        {/* Search Card */}
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
            margin: '0 0 6px 0'
          }}>
            Search Customers
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            margin: '0 0 24px 0'
          }}>
            ग्राहक खोजें
          </p>

          <form onSubmit={handleSearch}>
            {/* Search Type Selector */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '16px'
            }}>
              {[
                { value: 'phone', label: 'Phone', labelHindi: 'फोन' },
                { value: 'name', label: 'Name', labelHindi: 'नाम' }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSearchType(type.value)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: searchType === type.value ? '#1e3a5f' : '#f3f4f6',
                    color: searchType === type.value ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {type.label} <span style={{
                    opacity: searchType === type.value ? 0.7 : 0.5,
                    fontSize: '12px'
                  }}>({type.labelHindi})</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              <input
                type="text"
                placeholder={
                  searchType === 'phone'
                    ? 'Enter phone number...'
                    : 'Enter customer name...'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  outline: 'none',
                  background: 'white'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1e3a5f';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30,58,95,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px 24px',
                  background: '#1e3a5f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                🔍 Search
              </button>
            </div>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '40px'
          }}>
            <div className="spinner"></div>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280',
              marginBottom: '16px'
            }}>
              Found {results.length} result{results.length > 1 ? 's' : ''}
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {results.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => navigate(`/customer/${customer.id}`)}
                  style={{
                    background: 'white',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
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
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#10b98115',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    👤
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {customer.name}
                    </p>
                    {customer.phones && customer.phones.length > 0 && (
                      <p style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        margin: '4px 0 0 0'
                      }}>
                        📞 {customer.phones.map(p => p.phone).join(', ')}
                      </p>
                    )}
                    {customer.address && (
                      <p style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        margin: '2px 0 0 0'
                      }}>
                        📍 {customer.address}
                      </p>
                    )}
                  </div>
                  <span style={{ color: '#d1d5db', fontSize: '20px' }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && query && results.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🔍
            </div>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: '0 0 8px 0'
            }}>
              No customers found
            </p>
            <p style={{
              fontSize: '14px',
              color: '#9ca3af',
              margin: '0 0 24px 0'
            }}>
              कोई ग्राहक नहीं मिला
            </p>
            <button
              onClick={() => navigate('/customer/new')}
              style={{
                padding: '14px 28px',
                background: '#1e3a5f',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              + Create New Customer
            </button>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

export default SearchPage;
