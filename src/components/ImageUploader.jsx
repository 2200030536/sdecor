'use client';
/**
 * ImageUploader — drag-and-drop / click-to-upload component.
 * Uploads files to Cloudinary via /api/upload and appends the returned URL
 * to the images list. Supports multiple uploads and shows live previews.
 */
import { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, ImageIcon, CheckCircle2, AlertCircle, Link2 } from 'lucide-react';
import { uploadAPI } from '@/lib/api';

// ── Single uploaded item preview ──────────────────────────────────────────────
function PreviewItem({ url, onRemove }) {
  const isVideo = /\.(mp4|mov|avi|webm)$/i.test(url);
  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square">
      {isVideo ? (
        <video src={url} className="w-full h-full object-cover" muted />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Preview" className="w-full h-full object-cover" />
      )}
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onRemove(url)}
          className="p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
          title="Remove"
        >
          <X size={14} />
        </button>
      </div>
      {/* URL tooltip */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
        {url.split('/').pop()}
      </div>
    </div>
  );
}

// ── Upload queue item ─────────────────────────────────────────────────────────
function UploadingItem({ name, progress }) {
  return (
    <div className="rounded-xl border border-brand/30 bg-brand-light aspect-square flex flex-col items-center justify-center gap-2 p-3">
      <Loader2 size={20} className="animate-spin text-brand" />
      <p className="text-[10px] text-brand font-semibold text-center truncate w-full">{name}</p>
      <div className="w-full h-1.5 bg-white rounded-full overflow-hidden">
        <div
          className="h-full gradient-brand rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ImageUploader({ urls = [], onChange }) {
  const [uploading, setUploading] = useState([]); // [{ name, progress }]
  const [error,     setError]     = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef(null);

  // Handle files selected via input or drop
  const handleFiles = useCallback(async (files) => {
    setError('');
    const fileArr = Array.from(files);
    if (!fileArr.length) return;

    // Add to uploading queue
    const queue = fileArr.map(f => ({ name: f.name, progress: 10 }));
    setUploading(prev => [...prev, ...queue]);

    const results = await Promise.allSettled(
      fileArr.map(async (file, i) => {
        // Simulate progress tick
        setUploading(prev =>
          prev.map((u, idx) => idx === prev.length - fileArr.length + i ? { ...u, progress: 40 } : u)
        );
        const res = await uploadAPI.file(file);
        setUploading(prev =>
          prev.map((u, idx) => idx === prev.length - fileArr.length + i ? { ...u, progress: 100 } : u)
        );
        return res.url;
      })
    );

    const newUrls = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length) setError(`${failed.length} file(s) failed to upload.`);

    onChange([...urls, ...newUrls]);
    setUploading([]);
  }, [urls, onChange]);

  // Drag-and-drop handlers
  const [dragging, setDragging] = useState(false);
  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); };

  const removeUrl = (urlToRemove) => onChange(urls.filter(u => u !== urlToRemove));

  const addManualUrl = () => {
    const trimmed = manualUrl.trim();
    if (!trimmed || urls.includes(trimmed)) return;
    onChange([...urls, trimmed]);
    setManualUrl('');
  };

  return (
    <div className="space-y-4">

      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-brand bg-brand-light scale-[1.01]'
            : 'border-gray-200 hover:border-brand hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/mov,video/webm"
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${dragging ? 'gradient-brand' : 'bg-gray-100'}`}>
            <Upload size={22} className={dragging ? 'text-white' : 'text-gray-400'} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {dragging ? 'Drop to upload!' : 'Click or drag & drop files here'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              JPG, PNG, GIF, WebP, MP4, MOV — up to 20 MB each
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
          <AlertCircle size={14} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Previews grid */}
      {(urls.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {urls.map(url => (
            <PreviewItem key={url} url={url} onRemove={removeUrl} />
          ))}
          {uploading.map((u, i) => (
            <UploadingItem key={i} name={u.name} progress={u.progress} />
          ))}
        </div>
      )}

      {/* Manual URL input */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
          <Link2 size={12} /> Or paste a Cloudinary / image URL directly
        </p>
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={e => setManualUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addManualUrl())}
            placeholder="https://res.cloudinary.com/…"
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-brand"
          />
          <button
            type="button"
            onClick={addManualUrl}
            disabled={!manualUrl.trim()}
            className="px-4 py-2 gradient-brand text-white text-sm font-bold rounded-xl disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>
      </div>

      {/* Summary */}
      {urls.length > 0 && (
        <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
          <CheckCircle2 size={13} />
          {urls.length} image{urls.length !== 1 ? 's' : ''} attached
        </p>
      )}
    </div>
  );
}
