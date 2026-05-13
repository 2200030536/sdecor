'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, Package, Plus, Sparkles, LogOut, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { label: 'Dashboard',    href: '/admin',               icon: LayoutDashboard },
  { label: 'All Packages', href: '/admin/packages',      icon: Package },
  { label: 'Add Package',  href: '/admin/packages/new',  icon: Plus },
];

function AdminSidebar({ adminName, onLogout }) {
  const path = usePathname();
  return (
    <aside className="fixed top-0 left-0 h-full w-60 gradient-dark flex flex-col z-50 shadow-xl">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
            <Sparkles size={15} className="text-white" />
          </div>
          <div>
            <div className="text-white font-black text-lg leading-none">SDecor</div>
            <div className="text-white/40 text-[10px] font-medium tracking-widest uppercase">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? 'gradient-brand text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all"
        >
          <LogOut size={17} />
          Back to Site
        </Link>
        <button
          id="admin-logout"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-white/10 text-sm font-semibold transition-all"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }) {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin())) {
      router.replace('/login');
    }
  }, [user, loading, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Show spinner while checking auth
  if (loading || !user || !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-dark">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-white/60" />
          <p className="text-white/40 text-sm">Checking credentials…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar adminName={user.name} onLogout={handleLogout} />
      <main className="ml-60 flex-1 min-h-screen">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500">SDecor Admin</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">{user.name}</span>
            <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
