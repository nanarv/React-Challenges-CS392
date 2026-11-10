import { z } from 'zod';
import { parseMeets } from './utilities/meetings';

export const terms = ['Fall', 'Winter', 'Spring'] as const;

export const TermSchema = z.enum(terms);

// Empty means the course has no scheduled meeting time.
export const MeetsSchema = z
  .string()
  .trim()
  .refine(meets => meets === '' || parseMeets(meets) !== null, {
    message: 'Use days then start-end, e.g., MWF 12:00-13:20',
  })
  .refine(meets => {
    const meeting = parseMeets(meets);
    return meeting === null || meeting.start < meeting.end;
  }, { message: 'End time must be after start time' });

export const CourseSchema = z.object({
  term: TermSchema,
  number: z.string().trim().min(1, 'Course number is required'),
  meets: MeetsSchema,
  title: z.string().trim().min(2, 'Title must be at least 2 characters'),
});

export const ScheduleSchema = z.object({
  title: z.string(),
  courses: z.record(z.string(), CourseSchema),
});

// The fields the edit form lets users change.
export const CourseFormSchema = CourseSchema.pick({ title: true, meets: true });

export type Term = z.infer<typeof TermSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;
export type CourseFormValues = z.infer<typeof CourseFormSchema>;
