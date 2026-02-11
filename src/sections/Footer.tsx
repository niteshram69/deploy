export default function Footer() {
  return (
    <footer className="relative py-8 bg-[#070a1a] border-t border-indigo-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-slate-500">
          <span>© 2026 <span className="text-white">mind</span><span className="text-sky-400">AI</span><span className="text-white">thon</span>. All rights reserved.</span>
          <span className="hidden sm:inline">|</span>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="hover:text-cyan-400 transition-colors duration-200 underline underline-offset-2"
            >
              Terms & Conditions
            </a>
            <span>|</span>
            <a
              href="#"
              className="hover:text-cyan-400 transition-colors duration-200 underline underline-offset-2"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
