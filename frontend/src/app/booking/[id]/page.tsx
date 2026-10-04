"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { createPayment, verifyPayment } from "@/lib/payments";
import { createTicket } from "@/lib/tickets";

type BookingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Ticket = {
  id: number;
  bookingId: number;
  qrToken: string;
  status: string;
};

export default function BookingPage({
  params,
}: BookingPageProps) {
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const [status, setStatus] = useState("Ready for payment");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      setBookingId(Number(id));
    });
  }, [params]);

  if (bookingId === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Loading...
      </main>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    setStatus("Creating payment...");

    try {
      const payment = await createPayment(bookingId);

      setPaymentId(payment.data.id);
      setStatus("Payment created. Click Pay Now to complete.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Failed to create payment"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!paymentId) return;

    setLoading(true);
    setStatus("Verifying payment...");

    try {
      await verifyPayment(paymentId);

      setStatus("Payment successful! Generating your ticket...");

      const ticketResponse = await createTicket(bookingId);

      setTicket(ticketResponse.data);

      const qrImage = await QRCode.toDataURL(
        ticketResponse.data.qrToken
      );

      setQrCode(qrImage);

      setStatus("Booking confirmed! Your ticket is ready.");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Payment verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-xl rounded-xl border p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
          Booking #{bookingId}
        </h1>

        <p className="mt-4 text-gray-600">
          {status}
        </p>

        {!paymentId ? (
          <button
            onClick={handlePayment}
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-black px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Processing..." : "Create Payment"}
          </button>
        ) : !ticket ? (
          <button
            onClick={handleVerify}
            disabled={loading}
            className="mt-8 w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Complete Mock Payment"}
          </button>
        ) : null}

        {ticket && (
          <div className="mt-8 rounded-xl border p-6">
            <h2 className="text-xl font-bold text-center">
              Your Ticket
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Ticket #{ticket.id}
            </p>

            {qrCode && (
              <div className="mt-6 flex justify-center">
                <img
                  src={qrCode}
                  alt="Ticket QR Code"
                  className="h-64 w-64"
                />
              </div>
            )}

            <p className="mt-4 text-center text-sm text-gray-500">
              Show this QR code at the cinema entrance.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}