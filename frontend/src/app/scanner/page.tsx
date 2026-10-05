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
  const [result, setResult] = useState<
    "idle" | "success" | "error"
  >("idle");

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  const startScanner = async () => {
    if (scanning) return;

    setResult("idle");
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
          setResult("idle");

          try {
            const response = await validateTicket(decodedText);

            setResult("success");
            setMessage(
              `Ticket validated successfully! Ticket #${response.data.id}`
            );
          } catch (error) {
            setResult("error");
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
      setResult("error");

      setMessage(
        "Unable to access the camera. Please allow camera permission."
      );
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[var(--background)] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Staff Portal
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Ticket Scanner
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
            Scan a customer's CinePass QR ticket to verify
            their booking at the entrance.
          </p>
        </div>

        {/* Scanner card */}
        <div className="cine-card mt-10 overflow-hidden">
          <div className="border-b border-[var(--border)] bg-[#0d1117] px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(229,9,20,0.1)] text-lg">
                📷
              </div>

              <div>
                <h2 className="font-semibold">
                  QR Ticket Verification
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Camera access is required to scan tickets.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {/* Camera */}
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-black">
              <div
                id="reader"
                className="min-h-[280px] overflow-hidden"
              />

              {!scanning && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#05070a]/80">
                  <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#151a23] text-3xl">
                      📷
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-300">
                      Camera scanner ready
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Press the button below to start
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div
              className={`mt-5 rounded-xl border p-4 ${
                result === "success"
                  ? "border-green-500/20 bg-green-500/10"
                  : result === "error"
                    ? "border-red-500/20 bg-red-500/10"
                    : "border-[var(--border)] bg-[#0d1117]"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">
                  {result === "success"
                    ? "✓"
                    : result === "error"
                      ? "!"
                      : scanning
                        ? "◉"
                        : "ℹ"}
                </span>

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      result === "success"
                        ? "text-green-400"
                        : result === "error"
                          ? "text-red-400"
                          : "text-gray-300"
                    }`}
                  >
                    {result === "success"
                      ? "Ticket Valid"
                      : result === "error"
                        ? "Validation Failed"
                        : scanning
                          ? "Scanning..."
                          : "Ready to Scan"}
                  </p>

                  <p className="mt-1 text-sm leading-5 text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            {/* Button */}
            {!scanning && (
              <button
                onClick={startScanner}
                className="cine-button mt-5 w-full py-3.5"
              >
                📷 Start Scanner
              </button>
            )}

            {scanning && (
              <div className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[#0d1117] py-3 text-sm text-gray-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                Camera is scanning for a QR code...
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="cine-card p-4">
            <div className="text-xl">📱</div>
            <p className="mt-3 text-sm font-semibold">
              Show QR
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Ask the customer to display their ticket QR.
            </p>
          </div>

          <div className="cine-card p-4">
            <div className="text-xl">📷</div>
            <p className="mt-3 text-sm font-semibold">
              Scan
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Position the QR code inside the scanner.
            </p>
          </div>

          <div className="cine-card p-4">
            <div className="text-xl">✓</div>
            <p className="mt-3 text-sm font-semibold">
              Verify
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Only valid tickets are accepted.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}