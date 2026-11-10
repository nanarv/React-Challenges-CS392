// The one place that decides what a meeting-time string like "TuTh 9:30-10:50" means.
// Used by the course schema (validation) and by timeConflicts (scheduling).

export const DAYS = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'] as const;

export interface Meeting {
  days: Set<string>;
  start: number; // minutes after midnight
  end: number;
}

const MEETS_PATTERN = /^((?:M|Tu|W|Th|F|Sa|Su)+) +([01]?\d|2[0-3]):([0-5]\d)-([01]?\d|2[0-3]):([0-5]\d)$/;
const DAY_PATTERN = /M|Tu|W|Th|F|Sa|Su/g;

const toMinutes = (hours: string, minutes: string) => Number(hours) * 60 + Number(minutes);

/** Parses "days start-end", or returns null if the format is wrong or a day repeats. */
export const parseMeets = (meets: string): Meeting | null => {
  const match = meets.trim().match(MEETS_PATTERN);
  if (!match) return null;
  const [, dayText, startHours, startMinutes, endHours, endMinutes] = match;
  const dayList = dayText.match(DAY_PATTERN) ?? [];
  const days = new Set(dayList);
  if (days.size !== dayList.length) return null;
  return { days, start: toMinutes(startHours, startMinutes), end: toMinutes(endHours, endMinutes) };
};
