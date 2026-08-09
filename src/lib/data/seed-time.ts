/** Relative-date helpers so seeded data always looks current. */

export function at(daysAgo: number, hour = 6, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function inDays(days: number, hour = 12) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export function inHours(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}
