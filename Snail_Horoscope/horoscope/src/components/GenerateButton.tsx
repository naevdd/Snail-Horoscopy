interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
}

export default function GenerateButton({ onClick, loading }: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 -mt-40 font-pixelify text-lg py-3 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg transition disabled:opacity-50"
    >
      {loading ? 'Summoning Prophecy...' : 'Reveal My Snail’s Fate'}
    </button>
  );
}
