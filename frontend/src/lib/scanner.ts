import { authFetch } from "./api";

type ValidationResponse = {
  success: boolean;
  data: {
    id: number;
    bookingId: number;
    status: string;
  };
};

export async function validateTicket(qrToken: string) {
  return authFetch<ValidationResponse>(
    "/api/v1/tickets/validate",
    {
      method: "POST",
      body: JSON.stringify({
        qrToken,
      }),
    }
  );
}