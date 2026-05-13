import Link from 'next/link';
import { MessageCircle, Camera, Globe, Play, Sparkles, Phone, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  'Categories': [
    { label: 'Birthday Decoration', href: '/category/birthday' },
    { label: 'Anniversary Setup',   href: '/category/anniversary' },
    { label: 'Baby Shower',         href: '/category/baby-shower' },
    { label: 'Wedding Decor',       href: '/category/wedding' },
    { label: 'Engagement Decor',    href: '/category/engagement' },
  ],
  'Quick Links': [
    { label: 'All Packages',  href: '/' },
    { label: 'How It Works',  href: '/#trust' },
    { label: 'Reviews',       href: '/#reviews' },
    { label: 'WhatsApp Us',   href: 'https://wa.me/919999999999' },
  ],
};

const trustStats = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '5 Years', label: 'Of Excellence' },
  { value: '100%',    label: 'Same-Day Service' },
  { value: '✓',       label: 'Lowest Price' },
];

export default function Footer() {
  return (
    <footer className="gradient-dark text-white">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black gradient-brand-text">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-xl font-black">SDecor</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Patna&apos;s most trusted event decoration service. We make every moment magical — birthdays, anniversaries, weddings and beyond.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Camera, href: '#', color: 'hover:bg-pink-600' },
                { icon: Globe,  href: '#', color: 'hover:bg-blue-600' },
                { icon: Play,   href: '#', color: 'hover:bg-red-600' },
              ].map(({ icon: Icon, href, color }) => (
                <a
                  key={href + color}
                  href={href}
                  className={`w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center ${color} transition-colors`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">{heading}</h4>
              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-gray-400 text-sm hover:text-brand transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3">
              <a href="tel:+919999999999" className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors">
                <Phone size={15} className="text-brand flex-shrink-0" />
                +91 99999 99999
              </a>
              <a href="mailto:hello@sdecor.in" className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors">
                <Mail size={15} className="text-brand flex-shrink-0" />
                hello@sdecor.in
              </a>
              <div className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={15} className="text-brand flex-shrink-0 mt-0.5" />
                Serving all of Patna, Bihar
              </div>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-4 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">© 2025 SDecor, Patna. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Made with ❤️ for Patna</p>
        </div>
      </div>
    </footer>
  );
}
