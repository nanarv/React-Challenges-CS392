import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface CourseFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

const inputClasses = `mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-2`;

const CourseField = ({ label, registration, error }: CourseFieldProps) => {
  const id = `course-${registration.name}`;
  const errorId = `${id}-error`;

  return (
    <div className="text-sm font-medium text-vandyke">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        {...registration}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`${inputClasses} ${error
          ? 'border-red-600 focus:outline-red-600'
          : 'border-vandyke/20 focus:outline-spinel'}`}
      />
      {error && <p id={errorId} className="mt-1 text-xs font-normal text-red-600">{error.message}</p>}
    </div>
  );
};

export default CourseField;
