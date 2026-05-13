import { CheckCircle2 } from 'lucide-react';

export default function WhatsIncluded({ items = [] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-bold text-gray-900">What&apos;s Included</h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700 leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
