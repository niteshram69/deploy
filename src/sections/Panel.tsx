import { useEffect, useRef, useState } from 'react';

const judges = [
  {
    name: 'Elon Musk',
    title: 'Richest Man',
    image: '/judge-1.jpg',
  },
  {
    name: 'Mark Zuckerberg',
    title: 'CEO of META',
    image: '/judge-2.jpg',
  },
  {
    name: ' BIll Gates',
    title: 'Founder of Microsoft',
    image: '/judge-3.jpg',
  },
  {
    name: 'Jenseng Huang',
    title: 'CEO of NVIDIA',
    image: '/judge-4.jpg',
  },
];

export default function Panel() {
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
      id="panel"
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
            Meet the Panel
          </h2>
          <div
            className={`w-24 h-1 bg-gradient-primary mx-auto rounded-full transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
          />
        </div>

        {/* Judges Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {judges.map((judge, index) => (
            <div
              key={judge.name}
              className={`group text-center ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
                }`}
              style={{
                transitionDelay: isVisible ? `${150 + index * 100}ms` : '0ms',
                transitionDuration: '700ms',
              }}
            >
              {/* Avatar */}
              <div className="relative mb-5 mx-auto w-32 h-32">
                {/* Gradient Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 p-1 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0e27]">
                    <img
                      src={judge.image}
                      alt={judge.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-cyan-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>

              {/* Info */}
              <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors duration-300">
                {judge.name}
              </h3>
              <p className="text-sm text-slate-400">{judge.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
