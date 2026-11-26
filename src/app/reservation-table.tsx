"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type ReservationRow = {
  id: number;
  requester: string;
  status: "PENDING" | "APPROVED";
  equipment: { name: string; available: number };
};

export function ReservationTable({ reservations }: { reservations: ReservationRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [refreshing, startRefresh] = useTransition();

  async function approve(id: number) {
    setBusyId(id);
    setMessage("");

    try {
      const response = await fetch(`/api/reservations/${id}/approve`, { method: "POST" });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        setMessage(result.error ?? "Approval failed. Try again.");
      }
      startRefresh(() => router.refresh());
    } catch {
      setMessage("Could not reach the server. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  if (reservations.length === 0) {
    return <p className="panel">There are no reservations yet.</p>;
  }

  return (
    <>
      {message && <p className="notice" role="alert">{message}</p>}
      <div className="table-wrap">
        <table aria-label="Equipment reservations">
          <thead>
            <tr>
              <th scope="col">Request</th>
              <th scope="col">Requester</th>
              <th scope="col">Equipment</th>
              <th scope="col">Available</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <th scope="row">#{reservation.id}</th>
                <td>{reservation.requester}</td>
                <td>{reservation.equipment.name}</td>
                <td>{reservation.equipment.available}</td>
                <td>
                  <span className={reservation.status === "APPROVED" ? "status approved" : "status"}>
                    {reservation.status === "APPROVED" ? "Approved" : "Pending"}
                  </span>
                </td>
                <td>
                  {reservation.status === "PENDING" && (
                    <button
                      type="button"
                      disabled={busyId !== null || refreshing}
                      aria-label={`Approve reservation ${reservation.id} for ${reservation.requester}`}
                      onClick={() => void approve(reservation.id)}
                    >
                      {busyId === reservation.id ? "Approving…" : "Approve"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
