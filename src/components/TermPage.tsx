import { useState } from 'react';
import TermSelector from './TermSelector';
import CourseList from './CourseList';
import type { Course, Term } from '../types';

const TermPage = ({ courses }: { courses: Record<string, Course> }) => {
  const [selectedTerm, setSelectedTerm] = useState<Term>('Fall');

  return (
    <>
      <TermSelector selected={selectedTerm} setSelected={setSelectedTerm} />
      <CourseList courses={courses} selectedTerm={selectedTerm} />
    </>
  );
};

export default TermPage;
