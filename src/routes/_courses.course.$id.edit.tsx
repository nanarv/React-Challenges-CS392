import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Modal from '../components/Modal';
import CourseForm from '../components/CourseForm';
import { useSchedule } from '../utilities/schedule';

const EditCourse = () => {
  const { id } = Route.useParams();
  const { courses } = useSchedule();
  const navigate = useNavigate();
  const close = () => navigate({ to: '/', resetScroll: false });
  const course = courses[id];

  return (
    <Modal isOpen onClose={close} title={course ? `Edit CS ${course.number}` : 'Course not found'}>
      {course
        ? <CourseForm key={id} course={course} onCancel={close} />
        : <p className="mt-4 text-sm text-vandyke/60">No course with id "{id}".</p>}
    </Modal>
  );
};

export const Route = createFileRoute('/_courses/course/$id/edit')({
  component: EditCourse,
});
