type Status = 'draft' | 'open' | 'funded' | 'delivered' | 'completed' | 'failed';

const colours: Record<Status, string> = {
  draft:     'bg-gray-100 text-gray-600',
  open:      'bg-green-100 text-green-700',
  funded:    'bg-blue-100 text-blue-700',
  delivered: 'bg-orange-100 text-orange-700',
  completed: 'bg-gray-200 text-gray-700',
  failed:    'bg-red-100 text-red-700',
};

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${colours[status] ?? colours.draft}`}>
      {status}
    </span>
  );
}
