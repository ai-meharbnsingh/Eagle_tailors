import React, { useState, useRef, useEffect } from 'react';

const SearchBar = ({
  onSearch,
  placeholder = "Search phone, folio, or name...",
  placeholderHindi = "फ़ोन, फ़ोलियो या नाम खोजें...",
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={`
          bg-white rounded-2xl card-shadow overflow-hidden transition-all duration-300
          ${isFocused ? 'ring-2 ring-blue-500 shadow-lg' : ''}
        `}
      >
        <div className="flex items-center px-5 py-4">
          {/* Search icon */}
          <span className="text-2xl text-gray-400 mr-3">🔍</span>

          {/* Input */}
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="w-full text-gray-800 placeholder-gray-400 outline-none text-lg"
            />
            <p className="text-xs text-gray-300 mt-0.5">{placeholderHindi}</p>
          </div>

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}

          {/* Search button */}
          <button
            type="submit"
            className="ml-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Quick filters */}
        {isFocused && (
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex gap-2">
            <span className="text-xs text-gray-500">Quick:</span>
            <button
              type="button"
              onClick={() => setQuery('today')}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
            >
              Today's bills
            </button>
            <button
              type="button"
              onClick={() => setQuery('pending')}
              className="text-xs px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200"
            >
              Pending delivery
            </button>
            <button
              type="button"
              onClick={() => setQuery('unpaid')}
              className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
            >
              Unpaid
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
