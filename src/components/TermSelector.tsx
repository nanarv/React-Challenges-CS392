import { terms, type Term } from '../types';

interface TermSelectorProps {
  selected: Term;
  setSelected: (term: Term) => void;
}

const TermSelector = ({ selected, setSelected }: TermSelectorProps) => (
  <div className="inline-flex gap-1 mb-10 p-1 rounded-full bg-white shadow-raised" role="group" aria-label="Select term">
    {terms.map(term => (
      <button
        key={term}
        type="button"
        aria-pressed={term === selected}
        onClick={() => setSelected(term)}
        className={`px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spinel ${
          term === selected
            ? 'bg-vandyke text-white'
            : 'text-vandyke/60 hover:text-vandyke hover:bg-mint-100'
        }`}
      >
        {term}
      </button>
    ))}
  </div>
);

export default TermSelector;
