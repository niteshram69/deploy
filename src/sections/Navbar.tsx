import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'TRACKS', href: '#tracks' },
  { name: 'TIMELINE', href: '#timeline' },
  { name: 'PRIZES', href: '#prizes' },
  { name: 'FAQ', href: '#faq' },
  { name: 'LOGIN', href: '#login' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#0a0e27]/90 backdrop-blur-xl border-b border-indigo-500/10'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 no-underline">
            <img src="/logo.png" alt="Mindteck" className="h-10 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href === '#login' ? '/login' : `/${link.href}`}
                className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-200 tracking-wide"
              >
                {link.name}
              </a>
            ))}
            <Link
              to="/register"
              className="px-6 py-2.5 bg-gradient-primary text-white text-sm font-semibold rounded-full hover:scale-105 transition-transform duration-200 pulse-glow"
            >
              REGISTER
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#0a0e27]/95 backdrop-blur-xl border-t border-indigo-500/10 py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href === '#login' ? '/login' : `/${link.href}`}
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-200 px-4 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Link
                to="/register"
                className="mx-4 px-6 py-2.5 bg-gradient-primary text-white text-sm font-semibold rounded-full text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                REGISTER
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
