'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Package, Plus, Sparkles,
  LogOut, Loader2, Menu, X, ExternalLink, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV = [
  { label: 'Dashboard',    href: '/admin',              icon: LayoutDashboard },
  { label: 'All Packages', href: '/admin/packages',     icon: Package },
  { label: 'Add Package',  href: '/admin/packages/new', icon: Plus },
];

/* ─── Sidebar ─────────────────────────────────────────────── */
function AdminSidebar({ open, onClose, adminName, onLogout }) {
  const path = usePathname();

  return (
    <>
      {/* Backdrop (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          w-[260px] gradient-dark flex flex-col shadow-2xl
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo row */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-md">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white font-black text-lg leading-none tracking-tight">SDecor</div>
              <div className="text-white/40 text-[9px] font-semibold tracking-widest uppercase mt-0.5">Admin Panel</div>
            </div>
          </div>
          {/* Close btn – mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Admin greeting */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-black shadow">
              {adminName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-white text-sm font-bold leading-tight truncate max-w-[150px]">{adminName}</div>
              <div className="text-white/40 text-[10px] font-medium">Administrator</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-4 mb-3 text-[9px] font-bold text-white/30 uppercase tracking-widest">Menu</p>
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold
                  transition-all duration-200 relative overflow-hidden
                  ${active
                    ? 'gradient-brand text-white shadow-lg shadow-brand/30'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Icon size={17} className={active ? 'text-white' : 'text-white/50 group-hover:text-white'} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={14} className="text-white/70" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer links */}
        <div className="px-3 pb-5 space-y-1 border-t border-white/10 pt-3">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all"
          >
            <ExternalLink size={17} />
            View Site
          </Link>
          <button
            id="admin-logout"
            onClick={() => { onClose(); onLogout(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-semibold transition-all"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─── Top Navbar ──────────────────────────────────────────── */
function AdminTopbar({ onMenuClick, adminName }) {
  const path = usePathname();

  const currentPage = NAV.find(n => n.href === path)?.label ?? 'Admin';

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        {/* Hamburger (mobile / tablet) */}
        <button
          id="admin-menu-toggle"
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={19} />
        </button>

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-black text-gray-800 truncate">{currentPage}</h2>
          <p className="text-[10px] text-gray-400 font-medium hidden sm:block">SDecor Admin Panel</p>
        </div>

        {/* Right – user badge */}
        <div className="flex items-center gap-2.5">
          <span className="hidden sm:block text-sm text-gray-600 font-semibold truncate max-w-[120px]">{adminName}</span>
          <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-black shadow">
            {adminName?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Layout ──────────────────────────────────────────────── */
export default function AdminLayout({ children }) {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  const path = usePathname();
  useEffect(() => { setSidebarOpen(false); }, [path]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin())) {
      router.replace('/login');
    }
  }, [user, loading, isAdmin, router]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

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
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        adminName={user.name}
        onLogout={handleLogout}
      />

      {/* Main content — offset on desktop by sidebar width */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[260px]">
        <AdminTopbar
          onMenuClick={() => setSidebarOpen(prev => !prev)}
          adminName={user.name}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
