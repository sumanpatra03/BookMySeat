// src/app/(user)/page.tsx
import { supabase } from '@/lib/database';
import RoomDialog from '@/components/RoomDialog';
import SearchBar from '@/components/SearchBar';
import { Film } from 'lucide-react'; // for icons

export default async function UserPage() {
  const { data: rooms } = await supabase.from('rooms').select('*');

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-gray-800 to-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide">🎟️ Seat Booking Portal</h1>
          <p className="text-gray-400 mt-2">Find your room & seat instantly</p>
        </div>

        {/* Search */}
        <div className="mb-12 max-w-xl mx-auto">
          <SearchBar />
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms?.map((room) => (
            <RoomDialog key={room.id} room={room}>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:scale-[1.02] transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white">{room.name}</h2>
                  <Film className="w-6 h-6 text-pink-500" />
                </div>
                <p className="text-sm text-gray-300">
                  Capacity: <span className="font-medium">{room.rows * room.columns} seats</span>
                </p>
                <p className="mt-1 text-sm text-gray-400">Rows: {room.rows}, Columns: {room.columns}</p>
              </div>
            </RoomDialog>
          ))}
        </div>
      </div>
    </div>
  );
}
