import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Changed Github to GithubIcon for better compatibility with recent lucide versions
import { ArrowLeft, Mail, MessageCircle,  Globe, Send, Sparkles } from 'lucide-react';

// --- SHARED ANIMATION VARIANTS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

const MATH_SYMBOLS = ['∫', 'π', '∞', 'Σ', '√', 'Δ', 'θ', 'λ', 'Ω', '∂', '≈', '≠'];

const FloatingMathParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      char: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: 20 + Math.random() * 20,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.03, 0.1, 0.03], y: [0, -40, 0] }}
          transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
          className="absolute font-serif text-emerald-500/20"
          style={{ top: p.top, left: p.left, fontSize: p.size }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
};

const Contact = () => {
  const navigate = useNavigate();
  const COMMUNITY_LINK = "https://chat.whatsapp.com/HbuIF5IrOQWKdCjOwRPkLJ";

  const contactMethods = [
    {
      icon: <Mail className="text-emerald-500" size={24} />,
      label: "Email Support",
      value: "support@mathvault.com",
      action: () => window.location.href = "mailto:support@mathvault.com"
    },
    {
      icon: <MessageCircle className="text-emerald-500" size={24} />,
      label: "WhatsApp Community",
      value: "Join 500+ Students",
      action: () => window.open(COMMUNITY_LINK, '_blank')
    },
    {
      icon: <GithubIcon className="text-emerald-500" size={24} />,
      label: "Open Source",
      value: "Contribute on GitHub",
      action: () => window.open('https://github.com/aryajidhruv', '_blank')
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-hidden relative">
      <FloatingMathParticles />
      
      <nav className="relative z-50 p-8">
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:text-emerald-400 transition-all"
        >
          <div className="p-2 bg-white/5 border border-white/10 rounded-lg group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          Exit to Vault
        </button>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[9px] font-black tracking-[0.2em] text-emerald-400 uppercase bg-emerald-500/5 border border-emerald-500/20 rounded-full">
            <Sparkles size={12} /> Get in Touch
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] mb-8">
            LET'S <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-200">CONNECT.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-stone-400 text-lg font-medium max-w-md leading-relaxed mb-12 uppercase tracking-tight">
            Have a suggestion for the vault? Or found a bug in the matrix? Our team is always ready to listen.
          </motion.p>

          <div className="space-y-4">
            {contactMethods.map((method, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                onClick={method.action}
                className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all cursor-pointer group"
              >
                <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
                  {method.icon}
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest">{method.label}</p>
                  <p className="text-white font-bold tracking-tight">{method.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full"></div>
          <div className="relative p-10 bg-white/[0.03] border border-white/10 backdrop-blur-2xl rounded-[3rem] shadow-2xl">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Quick Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500 block mb-2">Your Name</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-emerald-500/50 outline-none transition-all text-sm" placeholder="e.g. Dhruv Arya" />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500 block mb-2">Message</label>
                <textarea rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:border-emerald-500/50 outline-none transition-all text-sm resize-none" placeholder="What's on your mind?"></textarea>
              </div>
              <button className="w-full bg-emerald-500 text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all active:scale-95 shadow-xl shadow-emerald-500/10">
                <Send size={14} /> Transmit Message
              </button>
            </form>
          </div>
        </motion.div>
      </main>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
    </div>
  );
};

export default Contact;