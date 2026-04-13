import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Zap, Flame, Trophy, Quote } from 'lucide-react';

// --- SHARED ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const MATH_SYMBOLS = ['∫', 'π', '∞', 'Σ', '√', 'Δ', 'θ', 'λ', 'Ω', '∂', '≈', '≠', '±', '≡', '∀', '∃', '∇', '∈', '∉', '⊂', '⊃'];

const FloatingMathParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      char: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: 18 + Math.random() * 35,
      duration: 20 + Math.random() * 30,
      delay: Math.random() * -20 
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          animate={{ 
            y: [0, -80, 0],
            opacity: [0.05, 0.15, 0.05], 
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
          className="absolute font-serif text-emerald-500/20 select-none"
          style={{ top: p.top, left: p.left, fontSize: p.size }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
};

const Motivation = () => {
  const navigate = useNavigate();

  const cards = [
    {
      icon: <Target className="text-emerald-500" size={32} />,
      title: "THE VISION",
      text: "Mathematics isn't just about solving for X; it's about the logic that governs the universe. We built this vault to turn academic struggle into architectural mastery."
    },
    {
      icon: <Flame className="text-orange-500" size={32} />,
      title: "THE GRIND",
      text: "Real progress happens in the late hours when the theorems finally start to click. Every PYQ you solve is a step toward mental dominance."
    },
    {
      icon: <Zap className="text-yellow-400" size={32} />,
      title: "THE IMPACT",
      text: "We aren't just passing exams; we are building a legacy for Rajdhani College. Excellence is a habit, not an act. Stay consistent."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      <FloatingMathParticles />
      
      {/* Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[120px] rounded-full z-[-1]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full z-[-1]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-8">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:text-emerald-400 transition-all"
        >
          <div className="p-2 bg-white/5 border border-white/10 rounded-lg group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          Return to Vault
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-32">
        {/* Header Section */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="text-center mb-32"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.3em] text-emerald-400 uppercase bg-emerald-500/5 border border-emerald-500/20 rounded-full">
            <Trophy size={14} /> Academic Excellence
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-[9rem] font-black leading-[0.85] tracking-tighter uppercase mb-12">
            STAY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-emerald-400 to-emerald-700">HUNGRY.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-stone-500 max-w-2xl mx-auto text-sm md:text-lg font-medium leading-relaxed uppercase tracking-widest">
            "Pure mathematics is, in its way, the poetry of logical ideas." <br /> 
            <span className="text-white">— Albert Einstein</span>
          </motion.p>
        </motion.div>

        {/* Motivational Bento Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32"
        >
          {cards.map((card, idx) => (
            <motion.div 
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-emerald-500/30 transition-all backdrop-blur-xl group"
            >
              <div className="mb-8 p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">{card.title}</h3>
              <p className="text-stone-400 leading-relaxed font-medium text-sm md:text-base">
                {card.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Big Quote / CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-16 md:p-24 bg-emerald-500 rounded-[5rem] text-black relative overflow-hidden group shadow-[0_0_80px_rgba(16,185,129,0.2)]"
        >
          <Quote size={200} className="absolute -top-20 -left-20 text-black/5 rotate-12" />
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-none">
              Your hard work <br className="hidden md:block"/> has no substitute.
            </h2>
            <p className="text-emerald-950 font-black text-xs md:text-sm uppercase tracking-[0.4em] mb-12">
              The Vault is ready. Are you?
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-black text-white px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95"
            >
              Access Resources Now
            </button>
          </div>
        </motion.div>
      </main>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-white/5 text-center relative z-10">
        <p className="text-[9px] font-black text-stone-600 uppercase tracking-[0.6em]">
          Fueling the Rajdhani Mathematics Collective
        </p>
      </footer>
    </div>
  );
};

export default Motivation;