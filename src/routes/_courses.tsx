import { createFileRoute, Outlet } from '@tanstack/react-router'
import { z } from 'zod';
import TermPage from '../components/TermPage';
import { ScheduleSchema, type Schedule } from '../types';

const SCHEDULE_URL = 'https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php';

const fetchSchedule = async (): Promise<Schedule> => {
  const response = await fetch(SCHEDULE_URL);
  if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  const result = ScheduleSchema.safeParse(await response.json());
  if (!result.success) throw new Error(`Bad schedule data:\n${z.prettifyError(result.error)}`);
  return result.data;
};

const Banner = ({ title }: { title: string }) => (
  <header className="mb-10">
    <h1 className="text-4xl font-bold tracking-tight text-vandyke">{title}</h1>
    <div className="mt-4 h-1 w-12 rounded-full bg-spinel" />
  </header>
);

const Shell = ({ children }: { children: React.ReactNode }) => (
  <main className="min-h-screen bg-mint-50 px-6 py-20 font-sans antialiased">
    <div className="max-w-5xl mx-auto">{children}</div>
  </main>
);

const CoursesLayout = () => {
  const { title, courses } = Route.useLoaderData();
  return (
    <Shell>
      <Banner title={title} />
      <TermPage courses={courses} />
      <Outlet />
    </Shell>
  );
};

export const Route = createFileRoute('/_courses')({
  loader: () => fetchSchedule(),
  staleTime: Infinity,
  component: CoursesLayout,
  pendingComponent: () => <Shell><p className="text-vandyke/60">Loading course schedule...</p></Shell>,
  errorComponent: ({ error }) => <Shell><p className="whitespace-pre-line text-spinel">Error loading course schedule: {error instanceof Error ? error.message : String(error)}</p></Shell>,
});
