import { authFetch } from "./api";

type TicketResponse = {
  success: boolean;
  data: {
    id: number;
    bookingId: number;
    qrToken: string;
    status: string;
  };
};

export async function createTicket(bookingId: number) {
  return authFetch<TicketResponse>(
    `/api/v1/tickets/${bookingId}`,
    {
      method: "POST",
    }
  );
}