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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newBook, setNewBook] = useState({
    name: '',
    start_serial: '',
    end_serial: ''
  });
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    start_serial: '',
    end_serial: ''
  });

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

  const handleCreateBook = async (e) => {
    e.preventDefault();
    if (!newBook.name || !newBook.start_serial) {
      toast.error('Please fill in book name and start serial');
      return;
    }

    setCreating(true);
    try {
      const res = await bookAPI.create({
        name: newBook.name,
        start_serial: parseInt(newBook.start_serial),
        end_serial: newBook.end_serial ? parseInt(newBook.end_serial) : null
      });

      if (res.data.success) {
        toast.success('Book created successfully!');
        setNewBook({ name: '', start_serial: '', end_serial: '' });
        setShowCreateForm(false);
        loadBooks();
      }
    } catch (error) {
      console.error('Error creating book:', error);
      toast.error(error.response?.data?.error || 'Failed to create book');
    } finally {
      setCreating(false);
    }
  };

  const handleSetCurrent = async (bookId) => {
    try {
      const res = await bookAPI.setCurrent(bookId);
      if (res.data.success) {
        toast.success('Book set as current!');
        loadBooks();
      }
    } catch (error) {
      console.error('Error setting current book:', error);
      toast.error('Failed to set current book');
    }
  };

  const handleEditClick = (book) => {
    setEditingBook(book.id);
    setEditForm({
      name: book.name,
      start_serial: book.start_serial,
      end_serial: book.end_serial || ''
    });
  };

  const handleEditSave = async (bookId) => {
    if (!editForm.name || !editForm.start_serial) {
      toast.error('Name and start serial are required');
      return;
    }

    try {
      const res = await bookAPI.update(bookId, {
        name: editForm.name,
        startSerial: parseInt(editForm.start_serial),
        endSerial: editForm.end_serial ? parseInt(editForm.end_serial) : null
      });

      if (res.data.success) {
        toast.success('Book updated successfully!');
        setEditingBook(null);
        loadBooks();
      }
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Failed to update book');
    }
  };

  const handleEditCancel = () => {
    setEditingBook(null);
    setEditForm({ name: '', start_serial: '', end_serial: '' });
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
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
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
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: '12px 20px',
              background: '#1e3a5f',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            + New Book / नई किताब
          </button>
        </div>

        {/* Create Book Form */}
        {showCreateForm && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            marginBottom: '20px',
            borderLeft: '4px solid #1e3a5f'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 20px 0'
            }}>
              Create New Book / नई किताब बनाएं
            </h3>
            <form onSubmit={handleCreateBook}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Book Name / किताब का नाम *
                </label>
                <input
                  type="text"
                  value={newBook.name}
                  onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
                  placeholder="e.g., Book 2024"
                  required
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Start Serial / शुरू नंबर *
                  </label>
                  <input
                    type="number"
                    value={newBook.start_serial}
                    onChange={(e) => setNewBook({ ...newBook, start_serial: e.target.value })}
                    placeholder="e.g., 1"
                    required
                    min="1"
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
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    End Serial / अंत नंबर (Optional)
                  </label>
                  <input
                    type="number"
                    value={newBook.end_serial}
                    onChange={(e) => setNewBook({ ...newBook, end_serial: e.target.value })}
                    placeholder="e.g., 500"
                    min="1"
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
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    padding: '12px 24px',
                    background: creating ? '#9ca3af' : '#1e3a5f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: creating ? 'not-allowed' : 'pointer'
                  }}
                >
                  {creating ? 'Creating...' : '✓ Create Book'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
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
            </form>
          </div>
        )}

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
              <div style={{ display: 'flex', gap: '8px' }}>
                {!book.is_current && (
                  <button
                    onClick={() => handleSetCurrent(book.id)}
                    style={{
                      padding: '8px 16px',
                      background: '#f0fdf4',
                      color: '#16a34a',
                      border: '1px solid #bbf7d0',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Set as Current
                  </button>
                )}
                <button
                  onClick={() => handleEditClick(book)}
                  style={{
                    padding: '8px 16px',
                    background: '#f3f4f6',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Edit
                </button>
              </div>
            </div>

            {/* Edit Form */}
            {editingBook === book.id && (
              <div style={{
                background: '#f9fafb',
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                    Book Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      fontSize: '14px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      Start Serial
                    </label>
                    <input
                      type="number"
                      value={editForm.start_serial}
                      onChange={(e) => setEditForm({ ...editForm, start_serial: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                      End Serial
                    </label>
                    <input
                      type="number"
                      value={editForm.end_serial}
                      onChange={(e) => setEditForm({ ...editForm, end_serial: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEditSave(book.id)}
                    style={{
                      padding: '10px 20px',
                      background: '#1e3a5f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    style={{
                      padding: '10px 20px',
                      background: '#f3f4f6',
                      color: '#6b7280',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

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
