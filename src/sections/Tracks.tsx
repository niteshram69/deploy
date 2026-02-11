import { useEffect, useRef, useState } from 'react';
import { Brain, Eye, MessageSquare, Cog } from 'lucide-react';

const tracks = [
  {
    icon: Brain,
    title: 'Generative AI',
    description:
      'Build solutions using LLMs, image generation, and creative AI tools to solve business problems.',
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Eye,
    title: 'Computer Vision',
    description:
      'Develop applications that can see and interpret the world using image and video analysis.',
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: MessageSquare,
    title: 'Ideation',
    description:
      'Create intelligent conversational interfaces and text analysis tools for customer support.',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: Cog,
    title: 'Process Automation',
    description:
      'Leverage AI to automate repetitive tasks and streamline workflows within mindAIthon.',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
  },
];

export default function Tracks() {
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
      id="tracks"
      ref={sectionRef}
      className="relative py-24 bg-[#0a0e27]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            AI-Thon Tracks
          </h2>
          <div
            className={`w-24 h-1 bg-gradient-primary mx-auto rounded-full transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
          />
        </div>

        {/* Tracks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track, index) => (
            <div
              key={track.title}
              className={`group relative glass-card rounded-2xl p-6 hover:-translate-y-2 transition-all duration-300 ${isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
                }`}
              style={{
                transitionDelay: isVisible ? `${150 + index * 100}ms` : '0ms',
              }}
            >
              {/* Hover Glow Effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${track.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <track.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-3">
                {track.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {track.description}
              </p>

              {/* Bottom Border Glow */}
              <div
                className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r ${track.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
