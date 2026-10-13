import './App.css';
import { useJsonQuery } from './utilities/fetch';
import TermPage from './components/TermPage';
import type { Course } from './types';

const SCHEDULE_URL = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';

interface Schedule {
  title: string;
  courses: Record<string, Course>;
}

const Banner = ({ title }: { title: string }) => (
  <header className="mb-10">
    <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{title}</h1>
    <div className="mt-3 h-px w-12 bg-stone-900" />
  </header>
);

const App = () => {
  const query = useJsonQuery<Schedule>(SCHEDULE_URL);

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-16 font-sans antialiased">
      <div className="max-w-5xl mx-auto">
        {query.status === 'loading' && <p className="text-stone-500">Loading course schedule...</p>}
        {query.status === 'error' && <p className="text-red-600">Error loading course schedule: {query.error.message}</p>}
        {query.status === 'success' && (
          <>
            <Banner title={query.data.title} />
            <TermPage courses={query.data.courses} />
          </>
        )}
      </div>
    </main>
  );
};

export default App;
