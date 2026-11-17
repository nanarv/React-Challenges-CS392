# Add Database

Switch this app's course data from a static JSON URL to Firebase Realtime
Database. The deployed app must look and behave exactly the same.

## Context
- Vite + React + TypeScript app using TanStack Router (file-based routes in
  `src/routes`) and Zod. Firebase Hosting is already set up (`firebase.json`
  serves `dist/`).
- `src/routes/_courses.tsx` loads data with a route `loader` that fetches
  https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php and
  validates it with `ScheduleSchema` from `src/types.ts`. The data has the shape
  `{ title: string, courses: { [id]: { term, number, meets, title } } }`.
- `src/routes/_courses.course.$id.edit.tsx` reads the same data with
  `useLoaderData({ from: '/_courses' })`.

## Goal
Both routes get their schedule from the Realtime Database at the root path `"/"`
through a live subscription, so later database edits show up without a reload.
A later task will add writes. Do not add any write code now.

## Requirements
1. Run `npm install firebase`. Create `src/utilities/firebase.ts` with
   `initializeApp` + `getDatabase`, using a `firebaseConfig` object. Leave config
   values as clearly marked placeholders and tell me where to paste them
   (Firebase console → Project settings → General → web app → Config). Put all
   Firebase calls in this file.
2. In the same file, export a hook
   `useDataQuery(path: string): [unknown, boolean, Error | undefined]` that
   subscribes with `onValue(ref(...))`, returns data/loading/error, resets state
   when `path` changes, and returns `onValue`'s unsubscribe function from
   `useEffect` so listeners don't leak. Use an explicit tuple return type.
3. Replace the fetch loader. Pick the cleanest way to share one validated
   `Schedule` between the layout and the edit route (for example, call the hook
   in the layout and pass data down through a React context or Outlet context).
   Explain the choice in one sentence. Validate with `ScheduleSchema.safeParse`;
   on failure, `console.log` the Zod error and show an error message.
4. Keep the loading and error UI visually identical: same `Shell` wrapper, same
   text ("Loading course schedule...", "Error loading course schedule: ..."),
   same Tailwind classes.
5. Delete the dead code (`SCHEDULE_URL`, `fetchSchedule`,
   loader/pending/error route options) and `src/utilities/fetch.ts` if nothing
   uses it anymore.
6. Run `firebase init database`, or hand-write `database.rules.json` plus the
   `firebase.json` entry, with rules `{ ".read": true, ".write": false }`.

## Out of scope
Auth, writing data, Firestore, restyling, changes to unrelated components.

## Verify before reporting done
- `npm run build`, `npx tsc -b`, and the existing tests (`npx vitest run`) pass.
- Download the current JSON from the URL above to a scratch file. This is the
  file I will import at the database root in the console.
- List the manual steps I still need to do, in order: enable Realtime Database,
  paste config, import JSON, `firebase deploy`, push to GitHub.
- Do not commit, deploy, or push. I will do that after I check it.
