import type { DayOfWeek } from '@/db';
import type { TranslateFn } from '@/i18n/translate';

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const MONTH_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

/** YYYY-MM-DD in the device's local timezone (not UTC, so it matches what the user sees). */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isSameDate(a: string, b: string): boolean {
  return a === b;
}

/**
 * Parses a YYYY-MM-DD string as local midnight. `new Date(isoString)` parses
 * date-only strings as UTC midnight instead, which shifts the date by a day
 * in any timezone behind UTC — this avoids that.
 */
export function parseISODate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** Start of the week containing `date`, per the profile's first-day-of-week preference (defaults to Monday, per the Dashboard mockup's M–S columns). */
export function startOfWeek(date: Date, firstDay: DayOfWeek = 'monday'): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = result.getDay();
  const offset = firstDay === 'monday' ? 1 : 0;
  const diff = (day - offset + 7) % 7;
  result.setDate(result.getDate() - diff);
  return result;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** The 7 ISO dates (Mon–Sun) for the week starting at `weekStart`. */
export function getWeekDates(weekStart: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => toISODate(addDays(weekStart, i)));
}

export function weekdayLetter(isoDate: string, t: TranslateFn): string {
  return t(`date.weekdayLetter.${WEEKDAY_KEYS[parseISODate(isoDate).getDay()]}`);
}

/** "Aug 5–11" or "Jul 29 – Aug 4" when the week spans two months. */
export function formatWeekRange(weekStart: Date, t: TranslateFn): string {
  const weekEnd = addDays(weekStart, 6);
  const startMonth = t(`date.monthShort.${MONTH_KEYS[weekStart.getMonth()]}`);
  const endMonth = t(`date.monthShort.${MONTH_KEYS[weekEnd.getMonth()]}`);
  if (startMonth === endMonth) {
    return `${startMonth} ${weekStart.getDate()}–${weekEnd.getDate()}`;
  }
  return `${startMonth} ${weekStart.getDate()} – ${endMonth} ${weekEnd.getDate()}`;
}

/** "Today · Aug 8" for today, otherwise "Thu · Aug 7". */
export function formatDayLabel(isoDate: string, todayIsoDate: string, t: TranslateFn): string {
  const date = parseISODate(isoDate);
  const monthDay = `${t(`date.monthShort.${MONTH_KEYS[date.getMonth()]}`)} ${date.getDate()}`;
  if (isoDate === todayIsoDate) {
    return t('date.todayLabel', { monthDay });
  }
  const weekday = t(`date.weekdayShort.${WEEKDAY_KEYS[date.getDay()]}`);
  return t('date.weekdayDateLabel', { weekday, monthDay });
}

/** "Today" for today, otherwise the full weekday name, e.g. "Wednesday". */
export function formatDayTitle(isoDate: string, todayIsoDate: string, t: TranslateFn): string {
  if (isoDate === todayIsoDate) {
    return t('date.today');
  }
  return t(`date.weekdayLong.${WEEKDAY_KEYS[parseISODate(isoDate).getDay()]}`);
}

/** "Friday, Aug 8" */
export function formatFullDate(isoDate: string, t: TranslateFn): string {
  const date = parseISODate(isoDate);
  const weekday = t(`date.weekdayLong.${WEEKDAY_KEYS[date.getDay()]}`);
  const month = t(`date.monthShort.${MONTH_KEYS[date.getMonth()]}`);
  return `${weekday}, ${month} ${date.getDate()}`;
}
