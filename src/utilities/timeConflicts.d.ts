import type { Course } from '../types';

export function findBlockedIds(courses: Record<string, Course>, selectedIds: string[]): Set<string>;
