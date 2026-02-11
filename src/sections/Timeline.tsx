import { useEffect, useRef, useState } from 'react';

const events = [
  {
    date: 'Feb 15, 2026',
    title: 'Registration Opens',
    description: 'Team formation and idea submission begins.',
    color: '#6366f1',
  },
  {
    date: 'Feb 25, 2026',
    title: 'Idea Freeze',
    description: 'Final date to submit project abstracts.',
    color: '#8b5cf6',
  },
  {
    date: 'Mar 10, 2026',
    title: 'AI-Thon Kickoff',
    description: '48-hour coding marathon begins!',
    color: '#06b6d4',
  },
  {
    date: 'Mar 12, 2026',
    title: 'Demo Day & Awards',
    description: 'Presentations to judges and winner announcement.',
    color: '#10b981',
  },
];

export default function Timeline() {
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
      id="timeline"
      ref={sectionRef}
      className="relative py-24 bg-[#0a0e27]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Event Timeline
          </h2>
          <div
            className={`w-24 h-1 bg-gradient-primary mx-auto rounded-full transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
          />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-cyan-500 sm:-translate-x-1/2" />

          {/* Events */}
          <div className="space-y-12">
            {events.map((event, index) => (
              <div
                key={event.date}
                className={`relative flex items-start gap-8 sm:gap-0 ${
                  index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                } ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                }`}
                style={{
                  transitionDelay: isVisible ? `${200 + index * 150}ms` : '0ms',
                  transitionDuration: '700ms',
                }}
              >
                {/* Dot */}
                <div
                  className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full border-2 border-white sm:-translate-x-1/2 z-10"
                  style={{
                    backgroundColor: event.color,
                    boxShadow: `0 0 20px ${event.color}80`,
                  }}
                />

                {/* Content Card */}
                <div
                  className={`ml-12 sm:ml-0 sm:w-5/12 ${
                    index % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'
                  }`}
                >
                  <div className="glass-card rounded-xl p-5 hover:-translate-y-1 transition-transform duration-300">
                    <span
                      className="text-lg font-bold block mb-2"
                      style={{ color: event.color }}
                    >
                      {event.date}
                    </span>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-400">{event.description}</p>
                  </div>
                </div>

                {/* Empty space for alternating layout */}
                <div className="hidden sm:block sm:w-5/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
