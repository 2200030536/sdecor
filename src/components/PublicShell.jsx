'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * PublicShell — renders the public site Navbar + Footer only on
 * non-admin, non-login routes. Admin panel has its own layout.
 */
export default function PublicShell({ children }) {
  const path = usePathname();
  const isAdminRoute = path?.startsWith('/admin');
  const isLoginRoute = path?.startsWith('/login');
  const hideChrome = isAdminRoute || isLoginRoute;

  return (
    <>
      {!hideChrome && <Navbar />}
      {children}
      {!hideChrome && <Footer />}
    </>
  );
}
