export const terms = ['Fall', 'Winter', 'Spring'] as const;

export type Term = typeof terms[number];

export interface Course {
  term: Term;
  number: string;
  meets: string;
  title: string;
}
