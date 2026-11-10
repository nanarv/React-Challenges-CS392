You're working in a React 19 + TypeScript + Vite + Tailwind v4 course-scheduler app.
Implement time-conflict blocking for course selection.

## Context (read these first)
- src/types.ts — `Course { term: Term; number: string; meets: string; title: string }`. Courses have no id field; ids are the keys of `courses: Record<string, Course>`.
- src/components/CourseList.tsx — `CourseList` holds `selected: string[]` (course ids) in useState and toggles with `toggleList`. `CourseCard` is a `<button>` with `isSelected` / `onToggle` props. The cart and the CoursePlanModal also call `toggleSelected` to remove courses.
- src/utilities/fetch.ts — the existing utility-module style to match.

## Requirements
1. A course card is selectable only if it has no time conflict with any currently selected course.
2. Already-selected courses must ALWAYS stay clickable so they can be unselected (from the card, the cart, and the modal). A course must never be treated as conflicting with itself.
3. Conflicting, unselected cards look disabled: reduced opacity, `cursor-not-allowed`, no hover lift, and a small "✕" badge in place of the empty selection circle (top-right). Set `aria-disabled="true"` and add a short `title`/sr-only reason such as "Time conflict with a selected course". Clicking does nothing. Don't use the HTML `disabled` attribute, so the card stays focusable.
4. The display updates immediately on select/unselect. Derive disabled status during render from `selected`; do NOT store it in state.

## Conflict rules
Two courses conflict if and only if ALL of these are true:
- they're in the same term
- both `meets` strings are non-empty (an empty string never conflicts)
- they share at least one day
- their time spans overlap. Use the half-open check `startA < endB && startB < endA`, so 9:00-9:50 and 9:50-10:40 do NOT conflict.

Meeting string format: `"<days> <H:MM>-<H:MM>"`, e.g. `"MWF 9:00-9:50"`, `"TuTh 14:00-15:20"`.
Days are any non-empty subset of M, Tu, W, Th, F, Sa, Su, with no repeats. Hours may be one or two digits (0:00–23:59), and start < end is guaranteed.

## Code structure
- Create `src/utilities/timeConflicts.js` (plain JavaScript, as the assignment requires).
- Break the logic into short, well-named pure functions, e.g. `parseDays`, `toMinutes`, `parseMeets`, `daysOverlap`, `timesOverlap`, `coursesConflict`.
- Export ONLY what the component needs (e.g. `hasConflictWithSelected`). Keep the helpers module-private.
- Add JSDoc types to the exported function(s). The tsconfig doesn't currently set `allowJs`, so make the .js import type-check cleanly in the .tsx: either enable `allowJs`/`checkJs` or add a small `timeConflicts.d.ts`. Pick the cleaner option and say which you chose.
- No comments in the code unless something is truly non-obvious. Match the existing style: arrow functions, concise expressions.

## Tests
Write Vitest unit tests in `src/utilities/timeConflicts.test.js`, testing through the exported function(s) only. Cover:
- overlapping same-day times → conflict
- shared days but non-overlapping times → no conflict
- back-to-back times (end == start) → no conflict
- same times, no shared days (MWF vs TuTh) → no conflict
- different terms → no conflict
- empty meets on either side → no conflict
- the Tu/Th vs T/H parsing trap (e.g. "Th" alone must not match "Tu")
- 1-digit vs 2-digit hours (9:00 vs 10:00) compared numerically, not as strings
- a selected course is never blocked by itself
Run them with `npx vitest run` (the `npm test` script opens the UI; don't use it).

## Done when
- `npx vitest run` passes
- `npm run build` and `npm run lint` pass with no new errors
- Summarize the files changed and any decisions you made (allowJs vs .d.ts, the badge design).