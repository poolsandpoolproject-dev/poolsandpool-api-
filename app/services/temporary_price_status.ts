import { DateTime } from 'luxon'

export type TemporaryPriceStatus = 'ACTIVE' | 'UPCOMING' | 'EXPIRED'

export function getTemporaryPriceStatus(
  startAt: DateTime,
  endAt: DateTime,
  now: DateTime = DateTime.now()
): TemporaryPriceStatus {
  if (now < startAt) return 'UPCOMING'
  if (now > endAt) return 'EXPIRED'
  return 'ACTIVE'
}
