import { useEffect, useRef, useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'Who can participate?',
    answer:
      'The AI-Thon is open to all Mindteck employees across all departments and locations. Whether you are a developer, designer, product manager, or business analyst, everyone is welcome to participate and contribute their unique skills.',
  },
  {
    question: 'Do I need to know AI to participate?',
    answer:
      'Not at all! While AI knowledge is helpful, we encourage participants from all backgrounds. We will have mentors and resources available to help teams learn and implement AI solutions during the hackathon.',
  },
  {
    question: 'Can I participate remotely?',
    answer:
      'Yes! The AI-Thon is fully remote-friendly. You can participate from any location and collaborate with your team using our online platforms and communication tools.',
  },
  {
    question: 'What if I don\'t have a team?',
    answer:
      'No worries! We will have a team formation session before the event where you can meet other participants and form teams based on complementary skills and interests. Solo participants are also welcome to join existing teams.',
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-24 bg-[#0a0e27]"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Frequently Asked Questions
          </h2>
          <div
            className={`w-24 h-1 bg-gradient-primary mx-auto rounded-full transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`glass-card rounded-xl overflow-hidden transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
              style={{
                transitionDelay: isVisible ? `${150 + index * 100}ms` : '0ms',
              }}
            >
              {/* Question */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors duration-200"
              >
                <span className="text-lg font-medium text-white pr-4">
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? 'bg-indigo-500 rotate-180'
                      : 'hover:bg-indigo-500/30'
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-white" />
                  ) : (
                    <Plus className="w-4 h-4 text-indigo-400" />
                  )}
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-5">
                  <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
