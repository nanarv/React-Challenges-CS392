import type { Course, Term } from '../types';

const CourseCard = ({ course }: { course: Course }) => (
  <article className="flex flex-col p-6 bg-white rounded-2xl ring-1 ring-stone-200
                      shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-lg">
    <p className="text-xs font-medium uppercase tracking-[0.15em] text-stone-400">
      {course.term} · CS {course.number}
    </p>
    <h2 className="flex-grow mt-3 text-lg font-semibold leading-snug text-stone-900">
      {course.title}
    </h2>
    <p className="mt-6 pt-4 border-t border-stone-100 text-sm text-stone-500">
      {course.meets}
    </p>
  </article>
);

interface CourseListProps {
  courses: Record<string, Course>;
  selectedTerm: Term;
}

const CourseList = ({ courses, selectedTerm }: CourseListProps) => {
  const termCourses = Object.entries(courses).filter(([, course]) => course.term === selectedTerm);

  if (termCourses.length === 0) {
    return <p className="text-stone-500">No courses offered this term.</p>;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-6">
      {termCourses.map(([id, course]) => (
        <CourseCard key={id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;
