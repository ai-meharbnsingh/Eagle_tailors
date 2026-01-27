import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';

function BooksPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const res = await bookAPI.getAll();
      if (res.data.success) {
        setBooks(res.data.data);
      }
    } catch (error) {
      console.error('Error loading books:', error);
      toast.error('Failed to load books');
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
        <div className="spinner"></div>
      </div>
    );
  }

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

        {/* Page Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          marginBottom: '20px'
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
            📚 Books
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            margin: 0
          }}>
            किताबें प्रबंधित करें
          </p>
        </div>

        {/* Books List */}
        {books.map((book) => (
          <div
            key={book.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              marginBottom: '16px',
              borderLeft: book.is_current ? '4px solid #1e3a5f' : '4px solid transparent'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  background: '#1e3a5f15',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px'
                }}>
                  📖
                </div>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    {book.name}
                  </h3>
                  {book.is_current && (
                    <span style={{
                      fontSize: '11px',
                      background: '#dcfce7',
                      color: '#16a34a',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: '500',
                      marginTop: '4px',
                      display: 'inline-block'
                    }}>
                      ✓ Current Book
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px'
            }}>
              <div style={{
                background: '#f9fafb',
                borderRadius: '10px',
                padding: '14px'
              }}>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                  Serial Range
                </p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  {book.start_serial} - {book.end_serial || '...'}
                </p>
              </div>
              <div style={{
                background: '#f9fafb',
                borderRadius: '10px',
                padding: '14px'
              }}>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                  Total Bills
                </p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  {book.bill_count || 0}
                </p>
              </div>
              <div style={{
                background: '#f9fafb',
                borderRadius: '10px',
                padding: '14px'
              }}>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                  Last Folio
                </p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a5f', margin: 0 }}>
                  #{book.last_folio || book.start_serial - 1}
                </p>
              </div>
              <div style={{
                background: '#f0fdf4',
                borderRadius: '10px',
                padding: '14px'
              }}>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
                  Next Available
                </p>
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#16a34a', margin: 0 }}>
                  #{(book.last_folio || book.start_serial - 1) + 1}
                </p>
              </div>
            </div>

            {/* Date Info */}
            {(book.first_bill_date || book.last_bill_date) && (
              <div style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                gap: '24px'
              }}>
                {book.first_bill_date && (
                  <div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 2px 0' }}>
                      First Bill
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      {format(new Date(book.first_bill_date), 'dd MMM yyyy')}
                    </p>
                  </div>
                )}
                {book.last_bill_date && (
                  <div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 2px 0' }}>
                      Last Bill
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                      {format(new Date(book.last_bill_date), 'dd MMM yyyy')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {books.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              No books found
            </p>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: '4px 0 0 0' }}>
              कोई किताब नहीं मिली
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

export default BooksPage;
