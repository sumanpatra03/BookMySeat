// src/types/index.ts
export interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
  }
  
  export interface Room {
    id: string;
    name: string;
    rows: number;
    columns: number;
    created_at: string;
  }
  
  export type SeatStatus = 'available' | 'allocated' | 'unavailable';
  
  export interface Seat {
    id: string;
    room_id: string;
    row: number;
    column: number;
    user_id: string | null;
    status: SeatStatus;
    created_at: string;
    user_name?: string; // Joined field from users table
  }
  
  export interface SeatWithUser extends Seat {
    rooms: any;
    user: User | null;
  }
  
  export interface RoomWithSeats extends Room {
    seats: SeatWithUser[];
  }