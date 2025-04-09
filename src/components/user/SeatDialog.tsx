'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/database'
import { Room, Seat } from '@/types'

type SeatDialogProps = {
  room: Room
  isOpen: boolean
  onClose: () => void
}

export default function SeatDialog({ room, isOpen, onClose }: SeatDialogProps) {
  const [seats, setSeats] = useState<Seat[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchSeats()
    }
  }, [isOpen])

  const fetchSeats = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('seats')
        .select('*')
        .eq('room_id', room.id)
      
      if (error) throw error
      setSeats(data || [])
    } catch (error) {
      console.error('Error fetching seats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{room.name} - Seat Availability</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div 
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${room.columns}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: room.rows * room.columns }).map((_, index) => {
                const row = Math.floor(index / room.columns) + 1
                const col = (index % room.columns) + 1
                const seat = seats.find(s => s.row === row && s.column === col)
                
                let bgColor = 'bg-green-500' // Available
                if (seat) {
                  bgColor = seat.status === 'allocated' ? 'bg-gray-500' : 'bg-yellow-500'
                }
                
                return (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center text-xs text-white`}
                    title={`Row ${row}, Col ${col}`}
                  >
                    {seat?.user_name ? seat.user_name.charAt(0) : ''}
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}