import { createFileRoute, Outlet } from '@tanstack/react-router'
import { z } from 'zod';
import TermPage from '../components/TermPage';
import { ScheduleSchema } from '../types';
import { useDataQuery } from '../utilities/firebase';
import { ScheduleContext } from '../utilities/schedule';

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

const ErrorMessage = ({ message }: { message: string }) => (
  <Shell><p className="whitespace-pre-line text-spinel">Error loading course schedule: {message}</p></Shell>
);

const CoursesLayout = () => {
  const [json, isLoading, error] = useDataQuery('/');

  if (error) return <ErrorMessage message={error.message} />;
  if (isLoading) return <Shell><p className="text-vandyke/60">Loading course schedule...</p></Shell>;
  if (!json) return <ErrorMessage message="No data found" />;

  const result = ScheduleSchema.safeParse(json);
  if (!result.success) {
    console.log(result.error);
    return <ErrorMessage message={`Bad schedule data:\n${z.prettifyError(result.error)}`} />;
  }

  const schedule = result.data;

  return (
    <ScheduleContext.Provider value={schedule}>
      <Shell>
        <Banner title={schedule.title} />
        <TermPage courses={schedule.courses} />
        <Outlet />
      </Shell>
    </ScheduleContext.Provider>
  );
};

export const Route = createFileRoute('/_courses')({
  component: CoursesLayout,
});
