import { parseReservationId } from "../../../../../lib/reservation-id";
import { approveReservation } from "../../../../../lib/reservations";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const reservationId = parseReservationId(id);
  if (reservationId === null) {
    return Response.json({ error: "Invalid reservation ID." }, { status: 400 });
  }

  const result = await approveReservation(reservationId);
  switch (result.kind) {
    case "missing":
      return Response.json({ error: "Reservation not found." }, { status: 404 });
    case "out-of-stock":
      return Response.json({ error: "This item is out of stock." }, { status: 409 });
    case "approved":
      return Response.json(result.reservation);
  }
}
