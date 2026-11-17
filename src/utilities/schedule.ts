import { createContext, useContext } from 'react';
import type { Schedule } from '../types';

export const ScheduleContext = createContext<Schedule | null>(null);

export const useSchedule = (): Schedule => {
  const schedule = useContext(ScheduleContext);
  if (!schedule) throw new Error('useSchedule must be used inside the /_courses layout');
  return schedule;
};
