/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/database";

export default function RoomManagementPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [room, setRoom] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<{
    row: number;
    columns: number;
  } | null>(null);
  const [selectedUserId, setSelectedUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchRoom();
    fetchSeats();
    fetchUsers();
  }, [id]);

  const fetchRoom = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", id)
      .single();
    if (error) console.error("Room fetch error:", error);
    setRoom(data);
  };

  const fetchSeats = async () => {
    const { data, error } = await supabase
      .from("seats")
      .select("*, users(name)")
      .eq("room_id", id);

    if (error) console.error("Seats fetch error:", error);
    setSeats(data || []);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) console.error("Users fetch error:", error);
    setUsers(data || []);
  };

  const handleSeatClick = (row: number, columns: number) => {
    setSelectedSeat({ row, columns });
    const seat = seats.find((s) => s.row === row && s.columns === columns);
    setSelectedUserId(seat?.user_id || "");
  };

  const handleAllocate = async () => {
    if (!selectedSeat) return;

    const { row, columns } = selectedSeat;
    const now = new Date().toISOString();

    const existingSeat = seats.find(
      (s) => s.row === row && s.columns === columns
    );

    if (selectedUserId) {
      if (existingSeat) {
        const { error } = await supabase
          .from("seats")
          .update({
            user_id: selectedUserId,
            status: "allocated",
            updated_at: now,
          })
          .eq("id", existingSeat.id);

        if (error) console.error("Update seat error:", error);
      } else {
        const { error } = await supabase.from("seats").insert([
          {
            room_id: id,
            row,
            columns,
            user_id: selectedUserId,
            status: "allocated",
            inserted_at: now,
            updated_at: now,
          },
        ]);
        if (error) console.error("Insert seat error:", error);
      }
    } else {
      if (existingSeat) {
        const { error } = await supabase
          .from("seats")
          .update({
            user_id: null,
            status: "unavailable",
            updated_at: now,
          })
          .eq("id", existingSeat.id);

        if (error) console.error("Update (unavailable) error:", error);
      } else {
        const { error } = await supabase.from("seats").insert([
          {
            room_id: id,
            row,
            columns,
            user_id: null,
            status: "unavailable",
            inserted_at: now,
            updated_at: now,
          },
        ]);

        if (error) console.error("Insert (unavailable) error:", error);
      }
    }

    await fetchSeats();
    setSelectedSeat(null);
  };

  const handleClearSeat = async () => {
    if (!selectedSeat) return;

    const seat = seats.find(
      (s) => s.row === selectedSeat.row && s.columns === selectedSeat.columns
    );

    if (seat) {
      const { error } = await supabase.from("seats").delete().eq("id", seat.id);
      if (error) console.error("Delete seat error:", error);
      await fetchSeats();
    }
    setSelectedSeat(null);
  };

  if (!room)
    return (
      <div className="text-center py-20 text-gray-500 font-bold">
        Loading room data...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            {room.name} - Room Management
          </h1>
          <button
            onClick={() => router.push("/admin")}
            className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 shadow border border-white/30"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Seat Layout ({room.rows} x {room.columns})
            </h2>
            <div className="overflow-auto">
              <div
                className="inline-grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${room.columns}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: room.rows * room.columns }).map(
                  (_, index) => {
                    const row = Math.floor(index / room.columns) + 1;
                    const columns = (index % room.columns) + 1;
                    const seat = seats.find(
                      (s) => s.row === row && s.columns === columns
                    );

                    let bgColor = "bg-green-200 hover:bg-green-300";
                    if (seat?.status === "allocated") bgColor = "bg-gray-400";
                    if (seat?.status === "unavailable") bgColor = "bg-red-300";

                    const isSelected =
                      selectedSeat?.row === row &&
                      selectedSeat?.columns === columns;
                    if (isSelected) bgColor = "bg-blue-400 ring-2 ring-blue-600";

                    return (
                      <button
                        key={index}
                        onClick={() => handleSeatClick(row, columns)}
                        className={`w-10 h-10 text-sm font-medium text-gray-800 rounded-md flex items-center justify-center transition ${bgColor}`}
                        title={`Row ${row}, Column ${columns}`}
                      >
                        {seat?.users?.name?.[0] || ""}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Seat Management
            </h2>
            {selectedSeat ? (
              <>
                <p className="text-white/80 mb-4">
                  Managing seat at <strong>Row {selectedSeat.row}</strong>, Column{" "}
                  <strong>{selectedSeat.columns}</strong>
                </p>
                <label className="block text-sm font-medium text-white mb-1">
                  Assign User
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full mb-4 p-2 border border-white/30 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">-- Select User --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id} className="text-black">
                      {user.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={handleAllocate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow"
                  >
                    {selectedUserId ? "Allocate Seat" : "Mark Unavailable"}
                  </button>
                  <button
                    onClick={handleClearSeat}
                    className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 shadow"
                  >
                    Clear Seat
                  </button>
                </div>
              </>
            ) : (
              <p className="text-white/70">Click a seat to manage it</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
