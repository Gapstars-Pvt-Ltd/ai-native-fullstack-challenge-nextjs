export function parseReservationId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return id <= 2_147_483_647 ? id : null;
}
