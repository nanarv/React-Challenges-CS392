import { describe, expect, it } from 'vitest';
import { CourseFormSchema, CourseSchema, ScheduleSchema } from './types';

const meetsError = (meets: string) => {
  const result = CourseFormSchema.safeParse({ title: 'Data Structures', meets });
  return result.success ? null : result.error.issues[0].message;
};

describe('meeting time validation', () => {
  it.each(['MWF 12:00-13:20', 'TuTh 9:30-10:50', 'M 6:00-9:00', 'Sa 10:00-12:00', ''])(
    'accepts "%s"', meets => expect(meetsError(meets)).toBeNull());

  it.each(['MWF', '12:00-13:20', 'MWF 12-13', 'Mon 9:00-10:00', 'MWF 25:00-26:00', 'MM 9:00-10:00'])(
    'rejects badly formatted "%s"', meets => expect(meetsError(meets)).toMatch(/e\.g\./));

  it('rejects an end time before the start time', () => {
    expect(meetsError('MWF 14:00-9:00')).toBe('End time must be after start time');
  });
});

describe('course validation', () => {
  it('rejects a one-character title', () => {
    expect(CourseFormSchema.safeParse({ title: 'X', meets: '' }).success).toBe(false);
  });

  it('trims whitespace from valid values', () => {
    expect(CourseFormSchema.parse({ title: '  Intro  ', meets: ' MWF 9:00-9:50 ' }))
      .toEqual({ title: 'Intro', meets: 'MWF 9:00-9:50' });
  });

  it('rejects an unknown term', () => {
    expect(CourseSchema.safeParse({ term: 'Summer', number: '101', meets: '', title: 'Intro' }).success).toBe(false);
  });

  it('accepts a schedule shaped like the fetched data', () => {
    const schedule = {
      title: 'CS Courses',
      courses: { F101: { term: 'Fall', number: '101', meets: 'MWF 11:00-11:50', title: 'Concepts' } },
    };
    expect(ScheduleSchema.parse(schedule)).toEqual(schedule);
  });
});
