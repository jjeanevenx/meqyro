export function countdownState(remainingMs: number, limitSeconds: number) {
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const ratio = Math.max(0, Math.min(1, remainingMs / (limitSeconds * 1000)));
  return {
    text: `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`,
    percent: ratio * 100,
    state: seconds === 0 ? "expired" : ratio <= 0.1 ? "critical" : ratio <= 0.2 ? "low" : "normal",
  } as const;
}
