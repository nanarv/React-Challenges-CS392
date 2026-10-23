import { useState } from 'react';
import Modal from './Modal';
import { terms, type Course, type Term } from '../types';

const toggleList = <T,>(x: T, lst: T[]): T[] => (
  lst.includes(x) ? lst.filter(y => y !== x) : [...lst, x]
);

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onToggle: () => void;
}

const CourseCard = ({ course, isSelected, onToggle }: CourseCardProps) => (
  <button
    type="button"
    aria-pressed={isSelected}
    onClick={onToggle}
    className={`group relative flex flex-col h-full w-full p-6 text-left rounded-2xl cursor-pointer
                transition-all duration-150 ease-out
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spinel
                active:translate-y-0.5 active:shadow-pressed ${
                  isSelected
                    ? 'translate-y-0.5 bg-mint-100 shadow-pressed'
                    : 'bg-white shadow-raised hover:-translate-y-0.5 hover:shadow-lifted'
                }`}
  >
    <span
      aria-hidden="true"
      className={`absolute top-5 right-5 flex size-5 items-center justify-center rounded-full transition-colors ${
        isSelected ? 'bg-spinel' : 'ring-1 ring-vandyke/20 group-hover:ring-spinel/60'
      }`}
    >
      {isSelected && (
        <svg viewBox="0 0 12 12" className="size-3 text-white" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <span className="pr-8 text-xs font-semibold uppercase tracking-[0.16em] text-vandyke/50">
      {course.term} · CS {course.number}
    </span>
    <span className="flex-grow mt-3 text-lg font-semibold leading-snug text-vandyke">
      {course.title}
    </span>
    <span className={`mt-6 pt-4 border-t text-sm text-vandyke/60 ${isSelected ? 'border-mint' : 'border-mint-100'}`}>
      {course.meets}
    </span>
  </button>
);

interface CartProps {
  courses: Record<string, Course>;
  selected: string[];
  onRemove: (id: string) => void;
}

const Cart = ({ courses, selected, onRemove }: CartProps) => (
  <section className="mb-12 rounded-2xl bg-white p-6 shadow-raised">
    <div className="flex items-baseline justify-between">
      <h2 className="text-lg font-semibold text-vandyke">Shopping cart</h2>
      <span className="rounded-full bg-spinel/10 px-3 py-1 text-xs font-semibold text-spinel">
        {selected.length} {selected.length === 1 ? 'course' : 'courses'}
      </span>
    </div>
    {selected.length === 0 ? (
      <p className="mt-4 text-sm text-vandyke/50">Click a course card to add it here.</p>
    ) : (
      <ul className="mt-4 max-h-48 overflow-auto divide-y divide-mint-100">
        {selected.map(id => (
          <li key={`selected-${id}`} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span>
              <span className="font-semibold">CS {courses[id].number}</span>
              <span className="text-vandyke/60"> · {courses[id].term} · {courses[id].title}</span>
            </span>
            <button
              type="button"
              onClick={() => onRemove(id)}
              className="shrink-0 rounded-full px-3 py-1 text-xs font-medium text-vandyke/60 cursor-pointer
                         transition-colors hover:bg-spinel/10 hover:text-spinel
                         focus-visible:outline-2 focus-visible:outline-spinel"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
);

interface CoursePlanModalProps {
  courses: Record<string, Course>;
  selected: string[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
}

const CoursePlanModal = ({ courses, selected, isOpen, onClose, onRemove }: CoursePlanModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Course plan">
    {selected.length === 0 ? (
      <p className="mt-4 text-sm text-vandyke/60">
        No courses selected yet. Pick a term above, then click a course card to add it to your plan.
      </p>
    ) : (
      <div className="mt-4 max-h-[60vh] overflow-auto">
        {terms.map(term => {
          const termIds = selected.filter(id => courses[id].term === term);
          if (termIds.length === 0) return null;
          return (
            <section key={term} className="mt-4 first:mt-0">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-vandyke/50">{term}</h3>
              <ul className="mt-1 divide-y divide-mint-100">
                {termIds.map(id => (
                  <li key={`plan-${id}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span>
                      <span className="font-semibold">CS {courses[id].number}</span>
                      <span className="text-vandyke/60"> · {courses[id].title}</span>
                      <span className="mt-1 block text-vandyke/60">{courses[id].meets}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(id)}
                      className="shrink-0 rounded-full px-3 py-1 text-xs font-medium text-vandyke/60 cursor-pointer
                                 transition-colors hover:bg-spinel/10 hover:text-spinel
                                 focus-visible:outline-2 focus-visible:outline-spinel"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    )}
  </Modal>
);

interface CourseListProps {
  courses: Record<string, Course>;
  selectedTerm: Term;
}

const CourseList = ({ courses, selectedTerm }: CourseListProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [planOpen, setPlanOpen] = useState(false);

  const toggleSelected = (id: string) => {
    setSelected(selected => toggleList(id, selected));
  };

  const termCourses = Object.entries(courses).filter(([, course]) => course.term === selectedTerm);

  return (
    <>
      <button
        type="button"
        onClick={() => setPlanOpen(true)}
        className="mb-6 rounded-full bg-spinel px-5 py-2 text-sm font-semibold text-white cursor-pointer
                   transition-opacity hover:opacity-90
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spinel"
      >
        Course plan ({selected.length})
      </button>
      <CoursePlanModal
        courses={courses}
        selected={selected}
        isOpen={planOpen}
        onClose={() => setPlanOpen(false)}
        onRemove={toggleSelected}
      />
      <Cart courses={courses} selected={selected} onRemove={toggleSelected} />
      {termCourses.length === 0 ? (
        <p className="text-vandyke/60">No courses offered this term.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-6">
          {termCourses.map(([id, course]) => (
            <CourseCard key={id} course={course} isSelected={selected.includes(id)} onToggle={() => toggleSelected(id)} />
          ))}
        </div>
      )}
    </>
  );
};

export default CourseList;
