import { authFetch } from "./api";

type PaymentResponse = {
  success: boolean;
  data: {
    id: number;
    bookingId: number;
    amount: string;
    status: string;
  };
};

export async function createPayment(bookingId: number) {
  return authFetch<PaymentResponse>(
    `/api/v1/payments/${bookingId}`,
    {
      method: "POST",
    }
  );
}

export async function verifyPayment(paymentId: number) {
  return authFetch<PaymentResponse>(
    `/api/v1/payments/${paymentId}/verify`,
    {
      method: "POST",
    }
  );
}
