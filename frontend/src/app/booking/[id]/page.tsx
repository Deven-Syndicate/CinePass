"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { createPayment, verifyPayment } from "@/lib/payments";
import { createTicket } from "@/lib/tickets";
import { getBookings } from "@/lib/bookings";

type BookingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type Ticket = {
  id: number;
  bookingId?: number;
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

  useEffect(() => {
  if (bookingId === null) return;

  const loadExistingBooking = async () => {
    try {
      const response = await getBookings();

      const booking = response.data.find(
        (item) => item.id === bookingId
      );

      if (!booking?.ticket) return;

      setTicket(booking.ticket);

      const qrImage = await QRCode.toDataURL(
        booking.ticket.qrToken,
        {
          width: 320,
          margin: 2,
        }
      );

      setQrCode(qrImage);
      setStatus("Booking confirmed! Your ticket is ready.");
    } catch (error) {
      console.error("Failed to load booking:", error);
    }
  };

  loadExistingBooking();
}, [bookingId]);

  if (bookingId === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-[var(--primary)]" />
          <p className="mt-4 text-sm text-gray-500">
            Loading booking...
          </p>
        </div>
      </main>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    setStatus("Creating payment...");

    try {
      const payment = await createPayment(bookingId);

      setPaymentId(payment.data.id);
      setStatus(
        "Payment created. Complete the mock payment to confirm your booking."
      );
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

      setStatus(
        "Payment successful! Generating your ticket..."
      );

      const ticketResponse = await createTicket(bookingId);

      setTicket(ticketResponse.data);

      const qrImage = await QRCode.toDataURL(
        ticketResponse.data.qrToken,
        {
          width: 320,
          margin: 2,
        }
      );

      setQrCode(qrImage);

      setStatus(
        "Booking confirmed! Your ticket is ready."
      );
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
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8">

        {/* Header */}

        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back to home
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Checkout
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Complete Your Booking
          </h1>

          <p className="mt-3 text-gray-500">
            Booking #{bookingId}
          </p>
        </div>

        {/* Progress */}

        <div className="mt-10 grid grid-cols-3 gap-3">
          <div
            className={`rounded-lg border p-3 text-center text-xs font-semibold ${
              !paymentId
                ? "border-[var(--primary)] bg-[rgba(229,9,20,0.1)] text-white"
                : "border-[var(--border)] bg-[#10141b] text-gray-500"
            }`}
          >
            1. Payment
          </div>

          <div
            className={`rounded-lg border p-3 text-center text-xs font-semibold ${
              paymentId && !ticket
                ? "border-[var(--primary)] bg-[rgba(229,9,20,0.1)] text-white"
                : "border-[var(--border)] bg-[#10141b] text-gray-500"
            }`}
          >
            2. Confirm
          </div>

          <div
            className={`rounded-lg border p-3 text-center text-xs font-semibold ${
              ticket
                ? "border-green-500/40 bg-green-500/10 text-green-400"
                : "border-[var(--border)] bg-[#10141b] text-gray-500"
            }`}
          >
            3. Ticket
          </div>
        </div>

        {/* Checkout card */}

        <div className="cine-card mt-6 overflow-hidden">

          {/* Status */}

          <div className="border-b border-[var(--border)] bg-[#0d1117] px-6 py-5">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  ticket
                    ? "bg-green-500/10 text-green-400"
                    : "bg-[rgba(229,9,20,0.1)] text-[var(--primary)]"
                }`}
              >
                {ticket ? "✓" : "₹"}
              </div>

              <div>
                <p className="font-semibold">
                  {ticket
                    ? "Booking Confirmed"
                    : paymentId
                      ? "Payment Ready"
                      : "Payment Required"}
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  {status}
                </p>
              </div>
            </div>
          </div>

          {/* Payment */}

          {!ticket && (
            <div className="p-6 sm:p-8">

              {!paymentId ? (
                <>
                  <div className="rounded-xl border border-[var(--border)] bg-[#0d1117] p-5">
                    <p className="text-xs uppercase tracking-wider text-gray-500">
                      Payment method
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          CinePass Mock Payment
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Razorpay integration will be added later.
                        </p>
                      </div>

                      <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                        TEST
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="cine-button mt-6 w-full py-3.5"
                  >
                    {loading
                      ? "Creating Payment..."
                      : "Create Payment →"}
                  </button>
                </>
              ) : (
                <>
                  <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10 text-green-400">
                        ✓
                      </div>

                      <div>
                        <p className="font-semibold">
                          Payment Created
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Payment ID: #{paymentId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleVerify}
                    disabled={loading}
                    className="cine-button mt-6 w-full py-3.5"
                  >
                    {loading
                      ? "Confirming Booking..."
                      : "Complete Mock Payment →"}
                  </button>
                </>
              )}

            </div>
          )}

          {/* Ticket */}

          {ticket && (
            <div className="p-6 sm:p-8">

              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-2xl text-green-400">
                  ✓
                </div>

                <h2 className="mt-4 text-2xl font-bold">
                  Your Ticket is Ready
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Ticket #{ticket.id}
                </p>
              </div>

              {/* QR */}

              {qrCode && (
                <div className="mx-auto mt-8 w-fit rounded-2xl bg-white p-5 shadow-2xl">
                  <img
                    src={qrCode}
                    alt="CinePass ticket QR code"
                    className="h-64 w-64 sm:h-72 sm:w-72"
                  />
                </div>
              )}

              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[#0d1117] p-5 text-center">
                <p className="text-sm font-semibold">
                  Show this QR code at the cinema entrance
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Your ticket contains a secure QR token that can
                  be validated by CinePass scanners.
                </p>
              </div>

              <Link
                href="/"
                className="cine-button-secondary mt-6 w-full py-3.5"
              >
                Back to Home
              </Link>

            </div>
          )}

        </div>

        {/* Security note */}

        {!ticket && (
          <p className="mt-6 text-center text-xs text-gray-600">
            🔒 Your booking is securely processed by CinePass.
          </p>
        )}

      </div>
    </main>
  );
}