import { authFetch } from "./api";

export type Booking = {
  id: number;
  status: string;
  totalAmount: string;
  expiresAt: string | null;
  createdAt: string;
  show: {
    id: number;
    startTime: string;
    endTime: string;
    price: string;
    movie: {
      id: number;
      title: string;
      posterUrl: string | null;
      language: string;
      genre: string;
      durationMin: number;
    };
    screen: {
      id: number;
      name: string;
      cinema: {
        id: number;
        name: string;
        address: string;
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
      type: "REGULAR" | "PREMIUM" | "RECLINER";
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

type BookingsResponse = {
  success: boolean;
  data: Booking[];
};

export async function getBookings() {
  return authFetch<BookingsResponse>("/api/v1/bookings");
}