'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, MessageCircle, Sparkles, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { categories } from '@/lib/mockData';
import { useAuth } from '@/context/AuthContext';

const navCategories = categories.map(c => ({
  ...c,
  href: `/category/${c.value.toLowerCase().replace(' ', '-')}`,
}));

export default function Navbar() {
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [userMenuOpen,   setUserMenuOpen]   = useState(false);
  const [scrolled,       setScrolled]       = useState(false);
  const timeoutRef  = useRef(null);
  const userMenuRef = useRef(null);

  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openDropdown  = (label) => { clearTimeout(timeoutRef.current); setActiveDropdown(label); };
  const closeDropdown = ()      => { timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150); };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    router.push('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ──────────────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-900 tracking-tight gradient-brand-text">SDecor</span>
              <span className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">Patna</span>
            </div>
          </Link>

          {/* ── Desktop category nav ──────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {navCategories.map((cat) => (
              <div
                key={cat.value}
                className="relative"
                onMouseEnter={() => openDropdown(cat.value)}
                onMouseLeave={closeDropdown}
              >
                <Link
                  href={cat.href}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-brand hover:bg-brand-light transition-colors"
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${activeDropdown === cat.value ? 'rotate-180' : ''}`}
                  />
                </Link>
              </div>
            ))}
          </nav>

          {/* ── Right actions ─────────────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* WhatsApp — desktop */}
            <Link
              href="https://wa.me/919386738937"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </Link>
            {/* WhatsApp — mobile icon */}
            <Link
              href="https://wa.me/919386738937"
              target="_blank"
              rel="noopener noreferrer"
              className="sm:hidden p-2 bg-emerald-500 text-white rounded-lg"
            >
              <MessageCircle size={18} />
            </Link>

            {/* ── Auth button (desktop) ──────────────────────────── */}
            {!loading && (
              user ? (
                /* Logged-in → avatar + dropdown */
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button
                    id="navbar-user-menu"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-brand hover:bg-brand-light transition-all group"
                  >
                    <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-brand max-w-[90px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up z-50">
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      {/* Admin panel link */}
                      {isAdmin() && (
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brand hover:bg-brand-light transition-colors"
                        >
                          <LayoutDashboard size={15} />
                          Admin Panel
                        </Link>
                      )}
                      {/* Logout */}
                      <button
                        id="navbar-logout"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Logged-out → Login button */
                <Link
                  id="navbar-login"
                  href="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 gradient-brand text-white text-sm font-bold rounded-xl shadow-md hover:opacity-90 transition-opacity"
                >
                  <LogIn size={15} />
                  Login
                </Link>
              )
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navCategories.map((cat) => (
              <Link
                key={cat.value}
                href={cat.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-brand-light hover:text-brand transition-colors font-medium"
              >
                <span className="text-xl">{cat.emoji}</span>
                <span>{cat.label}</span>
              </Link>
            ))}

            <div className="pt-2 border-t border-gray-100 space-y-2">
              {/* WhatsApp */}
              <Link
                href="https://wa.me/919386738937"
                target="_blank"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 text-white font-semibold rounded-xl"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </Link>

              {/* Auth — mobile */}
              {!loading && (
                user ? (
                  <div className="space-y-2">
                    {isAdmin() && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-brand-light text-brand font-semibold rounded-xl"
                      >
                        <LayoutDashboard size={18} />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-500 font-semibold rounded-xl"
                    >
                      <LogOut size={18} />
                      Logout ({user.name.split(' ')[0]})
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 gradient-brand text-white font-semibold rounded-xl shadow-md"
                  >
                    <LogIn size={18} />
                    Login / Sign Up
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
