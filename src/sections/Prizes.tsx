import { useEffect, useRef, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';

const prizes = [
  {
    icon: Medal,
    place: 'Runner Up',
    amount: '₹ 75,000',
    description: 'Split among team members',
    color: 'from-slate-400 to-slate-500',
    borderColor: 'border-slate-400/30',
    size: 'normal',
  },
  {
    icon: Trophy,
    place: 'Grand Winner',
    amount: '₹ 1,00,000',
    description: '+ Opportunity to incubate idea',
    color: 'from-yellow-400 to-amber-500',
    borderColor: 'border-yellow-400/50',
    size: 'large',
  },
  {
    icon: Award,
    place: 'Third Place',
    amount: '₹ 50,000',
    description: 'Split among team members',
    color: 'from-orange-400 to-amber-600',
    borderColor: 'border-orange-400/30',
    size: 'normal',
  },
];

export default function Prizes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="prizes"
      ref={sectionRef}
      className="relative py-24 bg-[#0a0e27]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            Prizes & Awards
          </h2>
          <div
            className={`w-24 h-1 bg-gradient-primary mx-auto rounded-full transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
          />
        </div>

        {/* Prizes Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {prizes.map((prize, index) => (
            <div
              key={prize.place}
              className={`relative group ${prize.size === 'large' ? 'md:scale-110 md:-my-4 z-10' : ''
                } ${isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
                }`}
              style={{
                transitionDelay: isVisible ? `${200 + index * 150}ms` : '0ms',
                transitionDuration: '700ms',
              }}
            >
              <div
                className={`glass-card rounded-2xl p-8 text-center border-2 ${prize.borderColor} hover:-translate-y-2 transition-all duration-300 ${prize.size === 'large' ? 'glow-border' : ''
                  }`}
              >
                {/* Icon */}
                <div
                  className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${prize.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <prize.icon className="w-10 h-10 text-white" />
                </div>

                {/* Place */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {prize.place}
                </h3>

                {/* Amount */}
                <p
                  className={`font-bold mb-3 ${prize.size === 'large'
                      ? 'text-5xl text-yellow-400 glow-text'
                      : 'text-4xl text-white'
                    }`}
                >
                  {prize.amount}
                </p>

                {/* Description */}
                <p className="text-sm text-slate-400">{prize.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
