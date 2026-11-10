import { parseMeets } from './meetings';

const parseMeeting = ({ term, meets }) => {
  const meeting = parseMeets(meets);
  return meeting && { term, ...meeting };
};

const sameTerm = (a, b) => a.term === b.term;

const shareDay = (a, b) => [...a.days].some(day => b.days.has(day));

const overlapInTime = (a, b) => a.start < b.end && b.start < a.end;

const meetingsConflict = (a, b) => sameTerm(a, b) && shareDay(a, b) && overlapInTime(a, b);

/**
 * Ids of unselected courses that conflict with at least one selected course.
 * @param {Record<string, import('../types').Course>} courses
 * @param {string[]} selectedIds
 * @returns {Set<string>}
 */
export const findBlockedIds = (courses, selectedIds) => {
  const selectedMeetings = selectedIds.map(id => parseMeeting(courses[id])).filter(Boolean);
  const isBlocked = ([id, course]) => {
    if (selectedIds.includes(id)) return false;
    const meeting = parseMeeting(course);
    return meeting !== null && selectedMeetings.some(selected => meetingsConflict(meeting, selected));
  };
  return new Set(Object.entries(courses).filter(isBlocked).map(([id]) => id));
};
