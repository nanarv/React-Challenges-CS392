import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CourseFormSchema, type Course, type CourseFormValues } from '../types';
import CourseField from './CourseField';

interface CourseFormProps {
  course: Course;
  onCancel: () => void;
}

const CourseForm = ({ course, onCancel }: CourseFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CourseFormValues>({
    defaultValues: { title: course.title, meets: course.meets },
    mode: 'onTouched', // first check when a field loses focus, then on every change
    resolver: zodResolver(CourseFormSchema),
  });

  // Saving is out of scope; pressing Enter still runs validation and shows errors.
  const onSubmit = (_data: CourseFormValues) => {};

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 flex flex-col gap-4">
      <CourseField label="Title" registration={register('title')} error={errors.title} />
      <CourseField label="Meeting times" registration={register('meets')} error={errors.meets} />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-5 py-2 text-sm font-semibold text-vandyke/70 ring-1 ring-vandyke/20
                     cursor-pointer hover:bg-mint-100 focus-visible:outline-2 focus-visible:outline-spinel"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
