// src/app/(admin)/page.tsx
import { supabase } from '@/lib/database';
import Link from 'next/link';
import { Users, Building } from 'lucide-react'; // Optional icons for visual feel

export default async function AdminPage() {
  const { data: rooms } = await supabase.from('rooms').select('*');
  const { data: users } = await supabase.from('users').select('*');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h1 className="text-4xl font-bold mb-10 text-center tracking-wide">🔧 Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Rooms Summary */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Building className="w-6 h-6 text-indigo-400" />
                Rooms
              </h2>
              <Link
                href="/rooms/create"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Create Room
              </Link>
            </div>
            <div className="space-y-4">
              {rooms?.map((room) => (
                <Link
                  key={room.id}
                  href={`/rooms/${room.id}`}
                  className="block bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition"
                >
                  <h3 className="text-lg font-medium text-white">{room.name}</h3>
                  <p className="text-sm text-gray-400">{room.rows} × {room.columns} layout</p>
                </Link>
              ))}
              {rooms?.length === 0 && (
                <p className="text-sm text-gray-500">No rooms available yet.</p>
              )}
            </div>
          </div>

          {/* Users Summary */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Users className="w-6 h-6 text-pink-400" />
                Users
              </h2>
              <Link
                href="/users"
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Manage Users
              </Link>
            </div>
            <div className="space-y-4">
              {users?.slice(0, 5).map((user) => (
                <div key={user.id} className="bg-white/5 rounded-xl px-4 py-3">
                  <h3 className="text-white font-medium">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              ))}
              {users && users.length > 5 && (
                <p className="text-sm text-gray-400 mt-2">+ {users.length - 5} more users</p>
              )}
              {users?.length === 0 && (
                <p className="text-sm text-gray-500">No users found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
