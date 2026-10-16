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
    <h1 className="text-4xl font-bold tracking-tight text-vandyke">{title}</h1>
    <div className="mt-4 h-1 w-12 rounded-full bg-spinel" />
  </header>
);

const App = () => {
  const query = useJsonQuery<Schedule>(SCHEDULE_URL);

  return (
    <main className="min-h-screen bg-mint-50 px-6 py-20 font-sans antialiased">
      <div className="max-w-5xl mx-auto">
        {query.status === 'loading' && <p className="text-vandyke/60">Loading course schedule...</p>}
        {query.status === 'error' && <p className="text-spinel">Error loading course schedule: {query.error.message}</p>}
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
