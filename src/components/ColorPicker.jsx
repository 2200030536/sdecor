'use client';
import { useState } from 'react';
import { Check } from 'lucide-react';

export default function ColorPicker({ colors = [], label = 'Choose Balloon Color' }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-800">{label}</h4>
        {selected && (
          <span className="text-xs text-gray-500 capitalize">
            Selected: <span className="font-semibold text-brand">{selected}</span>
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color}
            title={color}
            onClick={() => setSelected(selected === color ? null : color)}
            className={`relative w-9 h-9 rounded-full border-2 transition-all duration-200 shadow-sm hover:scale-110 ${
              selected === color
                ? 'border-brand scale-110 shadow-md'
                : 'border-gray-200 hover:border-gray-400'
            }`}
            style={{ backgroundColor: color }}
          >
            {selected === color && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Check
                  size={14}
                  className={
                    color === '#FFFFFF' || color === '#FFFACD' || color === '#FFD700'
                      ? 'text-gray-700'
                      : 'text-white'
                  }
                  strokeWidth={3}
                />
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400">
        Colour selection is indicative. Final shades may vary slightly based on availability.
      </p>
    </div>
  );
}
