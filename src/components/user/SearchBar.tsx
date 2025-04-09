'use client'

import { useState } from 'react'
import { supabase } from '@/lib/database'

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('seats')
        .select('*, rooms(*)')
        .ilike('user_name', `%${searchTerm}%`)
      
      if (error) throw error
      setSearchResults(data || [])
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search your name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 rounded-md"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {searchResults.length > 0 && (
        <div className="mt-4 bg-white p-4 rounded-md shadow">
          <h3 className="font-medium mb-2">Your Seats:</h3>
          <ul className="space-y-2">
            {searchResults.map((seat) => (
              <li key={seat.id} className="border-b pb-2">
                <p>Room: {seat.rooms.name}</p>
                <p>Seat: Row {seat.row}, Col {seat.column}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}