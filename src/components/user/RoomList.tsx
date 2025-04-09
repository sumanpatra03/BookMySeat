'use client'

import { useState } from 'react'
import { Room } from '@/types'
import SeatDialog from './SeatDialog'

type RoomListProps = {
  rooms: Room[]
}

export default function RoomList({ rooms }: RoomListProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room)
    setIsDialogOpen(true)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleRoomClick(room)}
            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium">{room.name}</h3>
            <p className="text-sm text-gray-500">Capacity: {room.rows * room.columns} seats</p>
          </div>
        ))}
      </div>

      {selectedRoom && (
        <SeatDialog
          room={selectedRoom}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  )
}