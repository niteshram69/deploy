import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Bot, Trophy } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // Parallax effect for floating cards
    const handleMouseMove = (e: MouseEvent) => {
      const cards = hero.querySelectorAll('.floating-card');
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      cards.forEach((card, index) => {
        const factor = index === 0 ? 1 : -1;
        (card as HTMLElement).style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center pt-[72px] overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a0e27 0%, #0f1535 100%)',
      }}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/50 via-transparent to-[#0a0e27]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f1535]/80 border border-indigo-500/30 backdrop-blur-sm">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">
                Driving AI-led Innovation Across Mindteck
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
                <span className="text-white">mind</span><span className="text-sky-400">AI</span><span className="text-white">thon</span>
              </h1>
              <p className="text-xl sm:text-2xl text-slate-400 font-light">
                Innovate. Build. Transform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-3.5 bg-gradient-primary text-white font-semibold rounded-full hover:scale-105 transition-all duration-200 glow-border"
              >
                REGISTER NOW
              </Link>
              <Link
                to="/login"
                className="px-8 py-3.5 border border-cyan-500/50 text-cyan-400 font-semibold rounded-full hover:bg-cyan-500/10 hover:scale-105 transition-all duration-200"
              >
                EMPLOYEE LOGIN
              </Link>
            </div>
          </div>

          {/* Right Column - Floating Cards */}
          <div className="relative h-[400px] lg:h-[500px]">
            {/* AI Theme Card */}
            <div className="floating-card absolute top-8 left-4 lg:left-8 glass-card rounded-2xl p-6 w-[280px] float-animation">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Theme</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                Explore Generative AI, Automation, and Machine Learning to solve real-world problems.
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full">
                  #GenAI
                </span>
                <span className="px-3 py-1 text-xs font-medium text-purple-400 bg-purple-500/10 rounded-full">
                  #ML
                </span>
              </div>
            </div>

            {/* Grand Prize Card */}
            <div className="floating-card absolute bottom-8 right-4 lg:right-0 glass-card rounded-2xl p-6 w-[260px] float-animation-delayed border-purple-500/30">
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Grand Prize</h3>
              </div>
              <p className="text-4xl font-bold text-cyan-400 glow-text mb-2">
                ₹ 2,15,000
              </p>
              <p className="text-sm text-slate-400">
                Total pool prize for top 3 teams
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0e27] to-transparent" />
    </section>
  );
}
