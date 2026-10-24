// Duration is selected only from the protected request row, never from visitor input.
export function viewingMinutes(visitor: { viewing_duration_minutes?: number }) {
  return visitor.viewing_duration_minutes === 60 ? 60 : 40;
}