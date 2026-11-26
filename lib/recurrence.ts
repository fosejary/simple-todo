import { addDays, addMonths, addWeeks, format, getDay, parseISO } from 'date-fns';
import type { Recurrence } from '@/lib/types';

/**
 * The date of the occurrence after `fromDate` (YYYY-MM-DD).
 * Weekly rules with `days_of_week` land on the next selected weekday.
 */
export function nextOccurrence(fromDate: string | null, rule: Recurrence): string {
  const base = fromDate ? parseISO(fromDate) : new Date();
  const interval = Math.max(1, rule.interval || 1);
  let next: Date;

  switch (rule.type) {
    case 'daily':
      next = addDays(base, interval);
      break;
    case 'weekly': {
      const days = (rule.days_of_week ?? []).filter((d) => d >= 0 && d <= 6);
      if (days.length === 0) {
        next = addWeeks(base, interval);
        break;
      }
      next = addDays(base, 1);
      for (let i = 0; i < 7 && !days.includes(getDay(next)); i++) {
        next = addDays(next, 1);
      }
      break;
    }
    case 'monthly':
      next = addMonths(base, interval);
      break;
    default:
      next = addDays(base, 1);
  }
  return format(next, 'yyyy-MM-dd');
}

/** Weekday indexes in display order for the picker, Monday first. */
export const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;
