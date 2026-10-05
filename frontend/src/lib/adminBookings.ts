import { authFetch } from "./api";

export type AdminBooking = {
  id: number;
  userId: number;
  showId: number;
  status: string;
  totalAmount: string;
  expiresAt: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  show: {
    id: number;
    startTime: string;
    endTime: string;
    price: string;
    movie: {
      id: number;
      title: string;
      posterUrl: string | null;
    };
    screen: {
      id: number;
      name: string;
      cinema: {
        id: number;
        name: string;
        city: string;
      };
    };
  };
  bookingSeats: {
    id: number;
    seat: {
      id: number;
      row: string;
      number: number;
      type: string;
    };
  }[];
  payment: {
    id: number;
    amount: string;
    status: string;
  } | null;
  ticket: {
    id: number;
    status: string;
    qrToken: string;
  } | null;
};

export async function getAdminBookings() {
  return authFetch<{
    success: boolean;
    data: AdminBooking[];
  }>("/api/v1/bookings");
}