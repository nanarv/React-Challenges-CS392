import { describe, expect, it } from 'vitest';
import { findBlockedIds } from './timeConflicts';

const course = (meets, term = 'Fall') => ({ term, number: '000', title: 'Test', meets });

const isBlocked = (candidate, selected) =>
  findBlockedIds({ candidate: course(...candidate), selected: course(...selected) }, ['selected']).has('candidate');

describe('findBlockedIds', () => {
  it('blocks overlapping times on a shared day', () => {
    expect(isBlocked(['MW 9:30-10:50'], ['MWF 9:00-9:50'])).toBe(true);
  });

  it('blocks a course fully inside another', () => {
    expect(isBlocked(['W 10:00-10:30'], ['MWF 9:00-11:00'])).toBe(true);
  });

  it('allows shared days with non-overlapping times', () => {
    expect(isBlocked(['MWF 11:00-11:50'], ['MWF 9:00-9:50'])).toBe(false);
  });

  it('allows back-to-back classes', () => {
    expect(isBlocked(['MWF 9:50-10:40'], ['MWF 9:00-9:50'])).toBe(false);
  });

  it('allows identical times on different days', () => {
    expect(isBlocked(['TuTh 9:00-9:50'], ['MWF 9:00-9:50'])).toBe(false);
  });

  it('does not confuse Tu with Th', () => {
    expect(isBlocked(['Th 9:00-9:50'], ['Tu 9:00-9:50'])).toBe(false);
    expect(isBlocked(['Th 9:00-9:50'], ['TuTh 9:00-9:50'])).toBe(true);
  });

  it('does not confuse Sa with Su', () => {
    expect(isBlocked(['Sa 9:00-9:50'], ['Su 9:00-9:50'])).toBe(false);
  });

  it('allows the same meeting in different terms', () => {
    expect(isBlocked(['MWF 9:00-9:50', 'Winter'], ['MWF 9:00-9:50', 'Fall'])).toBe(false);
  });

  it('never blocks on an empty meeting string', () => {
    expect(isBlocked([''], ['MWF 9:00-9:50'])).toBe(false);
    expect(isBlocked(['MWF 9:00-9:50'], [''])).toBe(false);
  });

  it('compares 1-digit and 2-digit hours numerically', () => {
    expect(isBlocked(['M 10:00-11:00'], ['M 9:00-9:59'])).toBe(false);
    expect(isBlocked(['M 9:30-10:30'], ['M 10:00-11:00'])).toBe(true);
  });

  it('handles times at the edges of the day', () => {
    expect(isBlocked(['F 23:00-23:59'], ['F 0:00-23:30'])).toBe(true);
  });

  it('never blocks a selected course, so it can always be unselected', () => {
    const courses = { a: course('MWF 9:00-9:50'), b: course('MWF 9:00-9:50') };
    expect(findBlockedIds(courses, ['a'])).toEqual(new Set(['b']));
    expect(findBlockedIds(courses, ['a', 'b'])).toEqual(new Set());
  });

  it('blocks nothing when nothing is selected', () => {
    expect(findBlockedIds({ a: course('MWF 9:00-9:50') }, [])).toEqual(new Set());
  });

  it('blocks a course that conflicts with any one of several selections', () => {
    const courses = {
      a: course('MWF 9:00-9:50'),
      b: course('TuTh 14:00-15:20'),
      c: course('Th 15:00-16:00'),
      d: course('Th 16:00-17:00'),
    };
    expect(findBlockedIds(courses, ['a', 'b'])).toEqual(new Set(['c']));
  });
});
