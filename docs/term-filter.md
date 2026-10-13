Create a TermSelector component and a TermPage component for the course schedule app.

 - TermPage owns the selected-term state, initialized to 'Fall'. It renders TermSelector above CourseList and passes the state down.
 - TermSelector renders one button each for Fall, Winter, and Spring. Clicking a button sets it as the selected term. The active button is visually distinct and marked with aria-pressed.
 - CourseList receives the selected term and uses filter to show only courses whose term matches it.
 - There is no "All" option, so exactly one term is always selected.
 - Each component goes in its own file under src/components/. Use a Term type ('Fall' | 'Winter' | 'Spring') instead of a plain string, so invalid terms are caught at compile time.
 - If no courses match the selected term, show a short "No courses offered this term" message instead of an empty grid.
