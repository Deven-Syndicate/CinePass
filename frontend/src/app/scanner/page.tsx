"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { validateTicket } from "@/lib/scanner";

export default function ScannerPage() {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const [message, setMessage] = useState(
    "Point the camera at a CinePass QR code."
  );
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  const startScanner = async () => {
    if (scanning) return;

    setMessage("Starting camera...");
    setScanning(true);

    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (decodedText) => {
          await scanner.stop();
          scannerRef.current = null;
          setScanning(false);

          setMessage("QR code detected. Validating ticket...");

          try {
            const response = await validateTicket(decodedText);

            setMessage(
              `Ticket validated successfully! Ticket #${response.data.id}`
            );
          } catch (error) {
            setMessage(
              error instanceof Error
                ? error.message
                : "Ticket validation failed"
            );
          }
        },
        () => {}
      );
    } catch (error) {
      console.error(error);
      setScanning(false);

      setMessage(
        "Unable to access the camera. Please allow camera permission."
      );
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-xl rounded-xl border p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
          CinePass Scanner
        </h1>

        <p className="mt-2 text-gray-500">
          Scan the customer's ticket QR code.
        </p>

        <div
          id="reader"
          className="mt-8 overflow-hidden rounded-xl"
        />

        {!scanning && (
          <button
            onClick={startScanner}
            className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-semibold text-white"
          >
            Start Scanner
          </button>
        )}

        <p className="mt-6 rounded-lg bg-gray-100 p-4 text-sm">
          {message}
        </p>
      </div>
    </main>
  );
}