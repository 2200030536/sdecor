import PackageCard from './PackageCard';

export default function PackageGrid({ packages }) {
  if (!packages?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🎈</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">No packages found</h3>
        <p className="text-gray-500 text-sm">Try a different filter or browse all packages.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {packages.map((pkg, i) => (
        <div
          key={pkg.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
        >
          <PackageCard pkg={pkg} />
        </div>
      ))}
    </div>
  );
}
