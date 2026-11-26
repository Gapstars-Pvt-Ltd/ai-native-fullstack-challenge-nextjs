import { listReservations } from "../../../lib/reservations";

export async function GET() {
  return Response.json(await listReservations());
}
