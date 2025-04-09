'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/database';
import { Plus, Trash2 } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('*');
    setUsers(data || []);
  };

  const handleAddUser = async () => {
    if (!name || !email) return;

    const { data, error } = await supabase.from('users').insert([{ name, email }]).select();
    if (!error && data) {
      setUsers((prev) => [...prev, data[0]]);
      setName('');
      setEmail('');
    }
  };

  const handleDeleteUser = async (id: string) => {
    await supabase.from('users').delete().eq('id', id);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center tracking-wide">👤 User Management</h1>

        {/* Add User Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold mb-6">➕ Add New User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter user name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-white/5 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email"
              />
            </div>
          </div>
          <button
            onClick={handleAddUser}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            <Plus className="w-5 h-5" /> Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
          <h2 className="text-2xl font-semibold mb-6">📋 Existing Users</h2>
          {users.length === 0 ? (
            <p className="text-sm text-gray-400">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="text-gray-300 border-b border-white/20">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition">
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
