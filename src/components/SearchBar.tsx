// src/components/SearchBar.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/database';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async () => {
    const { data, error } = await supabase
      .from('seats')
      .select('*, rooms(*)')
      .eq('user_name', searchTerm);

    if (!error && data) {
      setSearchResults(data);
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search your name..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-lg p-4">
          {searchResults.map((seat) => (
            <div key={seat.id} className="py-2 border-b">
              <p>Room: {seat.rooms.name}</p>
              <p>Seat: Row {seat.row}, Column {seat.column}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}