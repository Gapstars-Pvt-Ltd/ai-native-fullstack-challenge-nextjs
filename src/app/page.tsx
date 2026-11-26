import { listReservations } from "../lib/reservations";
import { ReservationTable } from "./reservation-table";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const reservations = await listReservations();

  return (
    <>
      <h1>Reservations</h1>
      <p className="intro">Review requests and allocate equipment from available stock.</p>
      <ReservationTable reservations={reservations} />
    </>
  );
}
