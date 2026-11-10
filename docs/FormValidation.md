You are working in a React + TypeScript + Vite + Tailwind v4 app at
~/Documents/CS392/challenges/prototype that uses TanStack Router with file-based routing.
Read the existing code first, especially: src/types.ts, src/components/CourseForm.tsx,
src/routes/_courses.tsx, src/routes/_courses.course.$id.edit.tsx,
src/utilities/timeConflicts.js and its test file.

## Task
Add validation to the course edit form, using Zod and React Hook Form, so users see
an error message next to any field with bad data.

1. **title**: required. After trimming spaces, it has at least 2 characters.
2. **meets**: either empty (no scheduled meeting time) or days followed by a start-end
   time, e.g., `MWF 12:00-13:20` or `TuTh 9:30-10:50`.
   - Days are made only of `M`, `Tu`, `W`, `Th`, `F`, `Sa`, `Su`, and no day repeats.
   - Hours are 0–23 and minutes are 00–59.
   - The end time must be after the start time. Show a different message for this
     than for a bad format.
3. No saving. Keep the Cancel button and do not add a Submit button. Pressing Enter
   should still run validation and show errors.

## Required approach
- Install: `npm i zod react-hook-form @hookform/resolvers`.
- **One meeting-time parser.** Create `src/utilities/meetings.ts` exporting
  `parseMeets(meets: string)`. It returns `{ days: Set<string>, start, end }` (minutes
  after midnight), or `null` if the format is wrong or a day repeats. Change
  `timeConflicts.js` to use `parseMeets` instead of its own regex. The form and the
  conflict checker must never disagree about what a valid meeting time is.
- **Schemas are the source of the types.** In `src/types.ts`, define `TermSchema`,
  a `MeetsSchema` that uses `parseMeets` in `.refine()` checks, `CourseSchema`,
  `ScheduleSchema` and `CourseFormSchema = CourseSchema.pick({ title: true, meets: true })`.
  Derive `Term`, `Course`, `Schedule` and `CourseFormValues` with `z.infer`. Remove the
  hand-written interfaces. Keep the `terms` array export.
- **Validate fetched data with the same schema.** In the `_courses` loader, parse the
  response with `ScheduleSchema.safeParse()`. On failure, throw an error that uses
  `z.prettifyError()`, and let the error component show its line breaks.
- **A reusable field component.** Create `src/components/CourseField.tsx` that takes
  `label`, `registration` (the result of `register()`) and `error`. It renders a
  label linked with `htmlFor`, the input, a red border when invalid, and the error
  message. Use `aria-invalid` and `aria-describedby` to link the message to the input.
- **The form.** In `CourseForm.tsx`, use `useForm` with `defaultValues` from the course,
  `mode: 'onTouched'` (first check on blur, then on every change) and
  `resolver: zodResolver(CourseFormSchema)`. Use `handleSubmit` with an empty
  `onSubmit`, and add `noValidate` to the form.
- Keep the existing Tailwind colors (`vandyke`, `spinel`, `mint`) and styles.

## Tests
Add `src/types.test.ts` with Vitest. Cover:
- valid meeting times, including empty, `Sa` and a single day
- bad formats: no times, no days, missing minutes, `Mon`, hour 25, repeated days
- end time before start time, which gives its own message
- a one-character title, trimming spaces, an unknown term
- a schedule shaped like the fetched data

Run `npx vitest run` and `npx tsc -b`, and both must pass. The existing
`timeConflicts` tests must still pass. Also confirm that the live schedule data from
the loader URL passes `ScheduleSchema`.
