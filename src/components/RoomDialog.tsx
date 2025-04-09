// src/components/RoomDialog.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/database';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface RoomDialogProps {
  room: any;
  children: React.ReactNode;
}

export default function RoomDialog({ room, children }: RoomDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [seats, setSeats] = useState<any[]>([]);

  const fetchSeats = async () => {
    const { data } = await supabase
      .from('seats')
      .select('*')
      .eq('room_id', room.id);
    setSeats(data || []);
  };

  const handleOpen = async () => {
    setIsOpen(true);
    await fetchSeats();
  };

  return (
    <>
      <div onClick={handleOpen}>{children}</div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{room.name} - Seat Availability</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid gap-2" style={{
              gridTemplateColumns: `repeat(${room.columns}, minmax(0, 1fr))`
            }}>
              {Array.from({ length: room.rows * room.columns }).map((_, index) => {
                const row = Math.floor(index / room.columns) + 1;
                const col = (index % room.columns) + 1;
                const seat = seats.find(s => s.row === row && s.column === col);
                
                let bgColor = 'bg-green-500'; // Available
                if (seat?.status === 'allocated') bgColor = 'bg-gray-500';
                if (seat?.status === 'unavailable') bgColor = 'bg-red-500';
                
                return (
                  <div 
                    key={index}
                    className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center text-white text-xs`}
                    title={`Row ${row}, Column ${col}`}
                  >
                    {seat?.user_name ? seat.user_name.charAt(0) : ''}
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}