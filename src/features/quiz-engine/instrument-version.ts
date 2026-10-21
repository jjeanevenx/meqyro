import "server-only";

/** Deterministic selection; historical sessions always use their pinned version instead. */
export function publishedVersion<T extends { version: string; status: string }>(
  versions: readonly T[],
): T | undefined {
  return versions
    .filter((v) => v.status === "APPROVED" || v.status === "PUBLISHED")
    .slice()
    .sort((a, b) => b.version.localeCompare(a.version, "en", { numeric: true }))[0];
}
