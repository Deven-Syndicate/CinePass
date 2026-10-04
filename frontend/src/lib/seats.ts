import { apiFetch, authFetch } from "./api";

export type Seat = {
  id: number;
  row: string;
  number: number;
  type: "REGULAR" | "PREMIUM" | "RECLINER";
  screenId: number;
  available: boolean;
};

type SeatsResponse = {
  success: boolean;
  data: Seat[];
};

export async function getShowSeats(showId: number) {
  return apiFetch<SeatsResponse>(`/api/v1/seats/${showId}`);
}

export async function createBooking(
  showId: number,
  seatIds: number[]
) {
  return authFetch<{
    success: boolean;
    data: {
      id: number;
      showId: number;
      status: string;
      totalAmount: string;
      expiresAt: string | null;
    };
  }>("/api/v1/bookings", {
    method: "POST",
    body: JSON.stringify({
      showId,
      seatIds,
    }),
  });
}