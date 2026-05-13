'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';

export default function ImageGallery({ images = [], title = '' }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 h-full">
      {/* Thumbnail strip */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[500px] md:w-20 flex-shrink-0">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative flex-shrink-0 w-16 h-16 md:w-full md:h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              i === active
                ? 'border-brand shadow-lg scale-105'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image
              src={src}
              alt={`${title} thumbnail ${i + 1}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="relative flex-1 aspect-[4/3] md:aspect-auto md:min-h-[400px] rounded-2xl overflow-hidden bg-gray-100 group">
        <Image
          key={active}
          src={images[active]}
          alt={title}
          fill
          className="object-cover animate-fade-in"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
        {/* Zoom hint */}
        <div className="absolute top-4 right-4 w-9 h-9 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={16} />
        </div>
        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-200 ${
                i === active ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
