'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/database';
import { Loader2 } from 'lucide-react';

export default function CreateRoomPage() {
  const [name, setName] = useState('');
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(10);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase
      .from('rooms')
      .insert([{ name, rows, columns }])
      .select();

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if (data && data[0]) {
      router.push(`/rooms/${data[0].id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white/10 text-white backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center">🎯 Create New Room</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Room Name */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Room Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="E.g. Lab A1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Row & Column Inputs */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Number of Rows</label>
              <input
                type="number"
                min="1"
                max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Number of Columns</label>
              <input
                type="number"
                min="1"
                max="100"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={columns}
                onChange={(e) => setColumns(parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-md">
              ⚠️ {errorMsg}
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-4 py-2 rounded-lg border border-white/30 text-gray-300 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
