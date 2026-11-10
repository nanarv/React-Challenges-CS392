You are working in a React + TypeScript + Vite + Tailwind v4 app at
~/Documents/CS392/challenges/prototype. Read the existing code first, especially:
src/main.tsx, src/App.tsx, src/types.ts, src/components/CourseList.tsx,
src/components/TermPage.tsx, src/components/Modal.tsx, src/utilities/fetch.ts.

## Task
Add an edit form for courses, reachable through routing:
1. A form with text inputs for a course's **title** and **meeting times** (the `meets` field),
   filled in with that course's current data.
2. A link on every course card that opens the edit form for that course.
3. The form has a **Cancel** button and **no Submit button**. It has an `onSubmit`
   handler that does nothing except `e.preventDefault()`.
4. Cancel returns the user to the main course list.
5. No form submission and no validation. Those are out of scope.

## Required approach
Use **TanStack Router with file-based routing**:
- Install: `npm i @tanstack/react-router @tanstack/react-router-devtools` and
  `npm i -D @tanstack/router-plugin`.
- Add `tanstackRouter({ target: 'react', autoCodeSplitting: true })` from
  `@tanstack/router-plugin/vite` to vite.config.ts, placed BEFORE `react()`.
  Keep the existing tailwind, babel/react-compiler plugins and vitest config.
- Replace main.tsx with the standard TanStack boilerplate: createRouter({ routeTree })
  from './routeTree.gen', register the router type, and render `<RouterProvider />`.
- Move App.tsx's content into routes, then delete App.tsx.

Route structure (keep the course list mounted while editing):
- `src/routes/__root.tsx`: `<Outlet />` + `<TanStackRouterDevtools />`, a simple
  notFoundComponent, and `import '../App.css'`.
- `src/routes/_courses.tsx`: a pathless layout route. Its `loader` fetches the schedule
  (https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php) and it sets
  `staleTime: Infinity` so the data is fetched once. Use pendingComponent and
  errorComponent for loading and errors. It renders the Banner + `<TermPage />` and
  then an `<Outlet />`.
- `src/routes/_courses.index.tsx`: the index route for `/`. Renders null.
- `src/routes/_courses.course.$id.edit.tsx`: reads `id` with `Route.useParams()`, gets
  courses with `useLoaderData({ from: '/_courses' })`, and renders the form inside the
  existing `<Modal>` component. Show "Course not found" if the id doesn't exist.
  Closing the modal (Cancel, Escape, the ✕ button) navigates to '/' with
  `resetScroll: false`.
- `src/components/CourseForm.tsx`: uncontrolled inputs using defaultValue, rendered
  with `key={id}` so they refill when the course changes. Props: course and onCancel.
  The Cancel button has `type="button"`.
- Move the `Schedule` interface (`{ title: string; courses: Record<string, Course> }`)
  into src/types.ts.

Edit link: CourseCard is already a `<button>`, so don't put a link inside it. In
CourseList's grid, wrap each card in a div and put a TanStack
`<Link to="/course/$id/edit" params={{ id }} resetScroll={false}>` labelled "Edit"
below the card.

Why this structure: the list (cart, selected term, scroll position) must survive
opening and cancelling the edit form, and the schedule must not be fetched again.

## Constraints
- Match the existing Tailwind style tokens (vandyke, spinel, mint-*, shadow-raised, etc.).
- Don't change the selection, cart, time-conflict or course plan behavior.
- Don't hand-edit routeTree.gen.ts. Run `npm run dev` so the plugin generates it.

## Verify before finishing
- `npm run build` and `npm run lint` pass, and `npx vitest run` still passes.
- In the browser: `/` shows the list. Clicking Edit opens a modal with the correct title
  and meeting times filled in. The URL becomes /course/<id>/edit. Cancel, Escape and ✕
  all return to `/` with selected courses and term unchanged. Loading /course/<id>/edit
  directly works. A bad id shows "Course not found".
- Report what you changed, file by file, and any check that failed.
