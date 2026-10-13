import { terms, type Term } from '../types';

interface TermSelectorProps {
  selected: Term;
  setSelected: (term: Term) => void;
}

const TermSelector = ({ selected, setSelected }: TermSelectorProps) => (
  <div className="flex gap-2 mb-8" role="group" aria-label="Select term">
    {terms.map(term => (
      <button
        key={term}
        type="button"
        aria-pressed={term === selected}
        onClick={() => setSelected(term)}
        className={`px-4 py-2 rounded-lg text-sm font-medium ring-1 transition-colors ${
          term === selected
            ? 'bg-stone-900 text-white ring-stone-900'
            : 'bg-white text-stone-700 ring-stone-200 hover:bg-stone-100'
        }`}
      >
        {term}
      </button>
    ))}
  </div>
);

export default TermSelector;
