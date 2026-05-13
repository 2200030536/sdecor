import { Shield, Clock, BadgeDollarSign, Users, Smile, Star } from 'lucide-react';

const stats = [
  { icon: Users,          value: '10,000+', label: 'Happy Customers',      color: 'text-brand'   },
  { icon: Star,           value: '4.9 ★',   label: 'Average Rating',       color: 'text-gold'    },
  { icon: Clock,          value: 'Same Day', label: 'Service Guarantee',    color: 'text-violet'  },
  { icon: BadgeDollarSign,value: 'Lowest',   label: 'Price Promise',        color: 'text-emerald' },
  { icon: Shield,         value: '100%',     label: 'Safe & Trusted',       color: 'text-brand'   },
  { icon: Smile,          value: '5 Years',  label: 'Of Excellence',        color: 'text-gold'    },
];

export default function TrustBadges() {
  return (
    <section id="trust" className="gradient-dark py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 gradient-brand text-white text-xs font-bold rounded-full uppercase tracking-widest mb-3 shadow">
            Why SDecor
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Patna&apos;s Most{' '}
            <span className="gradient-brand-text">Trusted</span> Decorator
          </h2>
          <p className="text-gray-400 mt-3 text-sm max-w-xl mx-auto">
            Thousands of families in Patna trust us for their most important celebrations.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(({ icon: Icon, value, label, color }) => (
            <div
              key={label}
              className="glass rounded-2xl p-5 text-center hover:scale-105 transition-transform duration-300 cursor-default"
            >
              <div className={`flex justify-center mb-3 ${color}`}>
                <Icon size={26} />
              </div>
              <div className={`text-2xl font-black mb-1 ${color}`}>{value}</div>
              <div className="text-gray-400 text-xs font-medium leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Bottom guarantee strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { emoji: '⚡', title: 'Same-Day Booking',    desc: 'Book before 2 PM for same-day decoration' },
            { emoji: '💰', title: 'Lowest Price',         desc: 'Best price guaranteed or we match it' },
            { emoji: '✨', title: 'Premium Quality',      desc: 'Only high-grade balloons & fresh flowers' },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="flex items-start gap-4 glass rounded-2xl p-5">
              <span className="text-3xl flex-shrink-0">{emoji}</span>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
