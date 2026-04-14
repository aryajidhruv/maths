import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowUpRight, AlertTriangle, Upload, GitBranch,
  Lightbulb, RefreshCw, Building2, Mail, MessageCircle, Star
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const MATH_SYMBOLS = ['∫', 'π', '∞', 'Σ', '√', 'Δ', 'θ', 'λ', 'Ω', '∂'];

const FloatingMathParticles = () => {
  const particles = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    char: MATH_SYMBOLS[Math.floor(Math.random() * MATH_SYMBOLS.length)],
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: 16 + Math.random() * 30,
    duration: 22 + Math.random() * 28,
    delay: Math.random() * -20
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map(p => (
        <motion.span
          key={p.id}
          animate={{ y: [0, -70, 0], opacity: [0.04, 0.12, 0.04] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'linear', delay: p.delay }}
          className="absolute font-serif text-emerald-500/20 select-none"
          style={{ top: p.top, left: p.left, fontSize: p.size }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  );
};

/* ── all contact reasons ── */
const REASONS = [
  {
    id: 'broken',
    icon: AlertTriangle,
    label: 'Something is broken',
    detail: 'Wrong file, dead link, corrupted PDF, resource that opens the wrong content.',
    urgency: 'HIGH',
    channel: 'email',
    channelNote: 'Email us with the subject name, semester, and what exactly is wrong. We fix reported issues fast.',
  },
  {
    id: 'submit',
    icon: Upload,
    label: 'I have resources to share',
    detail: 'Notes, PYQs, playlists, solved papers — anything that could help the next student.',
    urgency: 'WELCOME',
    channel: 'email',
    channelNote: 'Send us the files or links over email. Credit goes to you. Everything is reviewed before it goes live.',
  },
  {
    id: 'team',
    icon: GitBranch,
    label: 'I want to join the team',
    detail: 'Contribute to the codebase, manage resource updates, or coordinate across semesters.',
    urgency: 'OPEN',
    channel: 'email',
    channelNote: 'Tell us what you can do and how much time you have. We work lean — no bloat, no bureaucracy.',
  },
  {
    id: 'outdated',
    icon: RefreshCw,
    label: 'Content feels outdated',
    detail: 'Syllabus mismatch, playlist that skips topics, PYQ from a revised pattern.',
    urgency: 'IMPORTANT',
    channel: 'community',
    channelNote: 'Raise it in the WhatsApp community so others can weigh in too. Collective flags get prioritised.',
  },
  {
    id: 'suggest',
    icon: Lightbulb,
    label: 'I have a suggestion',
    detail: 'A feature idea, a better way to organise things, or something that would make studying easier.',
    urgency: 'LOVED',
    channel: 'community',
    channelNote: 'Drop it in the community — good ideas get picked up and built. Some of the best ones came from students.',
  },
  {
    id: 'review',
    icon: Star,
    label: 'I want to leave a review',
    detail: 'Tell us what worked, what did not, and how honest feedback helps future students.',
    urgency: 'MATTERS',
    channel: 'reviews',
    channelNote: 'The reviews page is built for exactly this. Takes less than a minute and it genuinely helps.',
  },
];

const URGENCY_STYLE = {
  HIGH:      'bg-red-500/10 text-red-400 border border-red-500/20',
  IMPORTANT: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  OPEN:      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  WELCOME:   'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  LOVED:     'bg-violet-500/10 text-violet-400 border border-violet-500/20',
  MATTERS:   'bg-sky-500/10 text-sky-400 border border-sky-500/20',
  EXCITING:  'bg-amber-500/10 text-amber-400 border border-amber-500/20',
};

/* ── channel action blocks ── */
const CHANNELS = {
  email: {
    icon: Mail,
    label: 'Send us an email',
    href: 'aryajiidhruv@gmail.com',
    cta: 'Open Email',
    sub: 'aryajiidhruv@gmail',
  },
  community: {
    icon: MessageCircle,
    label: 'Join the community',
    href: 'https://chat.whatsapp.com/HbuIF5IrOQWKdCjOwRPkLJ',
    cta: 'Open WhatsApp',
    sub: 'MathVault Community Group',
  },
  reviews: {
    icon: Star,
    label: 'Leave a review',
    href: '/reviews',
    cta: 'Go to Reviews',
    sub: 'Visible to all students',
    internal: true,
  },
};

const ContactPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const reason = REASONS.find(r => r.id === selected);
  const channel = reason ? CHANNELS[reason.channel] : null;

  const handleChannelAction = () => {
    if (!channel) return;
    if (channel.internal) { navigate('/reviews'); return; }
    window.open(channel.href, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      <FloatingMathParticles />

      {/* ambient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/8 blur-[140px] rounded-full" />
      </div>

      {/* ── NAV ── */}
      <nav className="relative z-50 p-8">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:text-emerald-400 transition-all"
        >
          <div className="p-2 bg-white/5 border border-white/10 rounded-lg group-hover:border-emerald-500/40 transition-all">
            <ArrowLeft size={16} />
          </div>
          Return to Vault
        </button>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-40">

        {/* ── HERO ── */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="pt-12 pb-24 space-y-6"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 text-[9px] font-black tracking-[0.3em] uppercase text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
            Real people. Fast responses.
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-[7rem] font-black uppercase tracking-tighter leading-[0.82] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/25"
          >
            REACH<br />
            <span className="text-emerald-400 italic">THE VAULT.</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-stone-400 text-base leading-relaxed max-w-xl">
            We're students, not a support team. But we do respond — and we take
            every report, submission, and suggestion seriously. Pick why you're here.
          </motion.p>
        </motion.section>

        {/* ── REASON SELECTOR ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mb-12"
        >
          <motion.p variants={fadeInUp} className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600 mb-8">
            Why are you here?
          </motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {REASONS.map(r => {
              const Icon = r.icon;
              const isActive = selected === r.id;
              return (
                <motion.button
                  key={r.id}
                  variants={fadeInUp}
                  whileHover={{ y: -4, scale: 1.01 }}
                  onClick={() => setSelected(isActive ? null : r.id)}
                  className={`relative text-left p-7 rounded-[2rem] border transition-all duration-400 overflow-hidden group
                    ${isActive
                      ? 'bg-emerald-500/10 border-emerald-500/50'
                      : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/25 hover:bg-[#0f0f0f]'
                    }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-emerald-500/5 rounded-[2rem]" />
                  )}
                  <div className="relative z-10 space-y-4">
                    <div className={`flex items-start justify-between`}>
                      <Icon size={22} className={isActive ? 'text-emerald-400' : 'text-stone-500 group-hover:text-emerald-500 transition-colors'} />
                      <span className={`text-[8px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-full ${URGENCY_STYLE[r.urgency]}`}>
                        {r.urgency}
                      </span>
                    </div>
                    <div>
                      <p className={`font-black text-sm uppercase tracking-tight leading-tight mb-2 ${isActive ? 'text-white' : 'text-stone-300'}`}>
                        {r.label}
                      </p>
                      <p className="text-stone-600 text-[11px] leading-relaxed">{r.detail}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* ── CHANNEL RESULT ── */}
        <AnimatePresence mode="wait">
          {reason && channel && (
            <motion.section
              key={reason.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-20"
            >
              <div className="relative rounded-[3rem] border border-emerald-500/25 bg-emerald-500/[0.04] overflow-hidden">
                <div className="absolute top-0 right-0 w-[35%] h-full bg-emerald-500/5 blur-[60px] pointer-events-none" />

                <div className="relative z-10 p-12 md:p-16 flex flex-col md:flex-row items-start md:items-center gap-10 justify-between">
                  <div className="space-y-4 max-w-xl">
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-500">
                      Best way to reach us for this
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.88]">
                      {channel.label}
                    </h2>
                    <p className="text-stone-400 leading-relaxed text-sm">
                      {reason.channelNote}
                    </p>
                    <p className="text-stone-600 text-[11px] font-black uppercase tracking-widest">
                      {channel.sub}
                    </p>
                  </div>

                  <button
                    onClick={handleChannelAction}
                    className="shrink-0 flex items-center gap-3 px-10 py-5 bg-emerald-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-400 active:scale-95 transition-all"
                  >
                    {channel.cta} <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── DIVIDER ── */}
        <div className="w-full h-[1px] bg-white/5 mb-20" />

        {/* ── ALL CHANNELS ALWAYS VISIBLE ── */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-10"
        >
          <motion.div variants={fadeInUp} className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-600">Direct Access</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter">ALL CHANNELS</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Email */}
            <motion.a
              variants={fadeInUp}
              href="mailto:aryajiidhruv@gmail.com,mr.balotra4@gmail.com"
              whileHover={{ y: -5, scale: 1.01 }}
              className="group p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-emerald-500/35 hover:bg-[#0f0f0f] transition-all block"
            >
              <Mail size={28} className="text-emerald-500 mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Email</h3>
              <p className="text-stone-600 text-[11px] font-black uppercase tracking-widest mb-4">
                For reports, submissions, team
              </p>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Best for anything that needs context — broken resources, files to add, or joining the team.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 group-hover:text-emerald-300 transition-colors">
                MathVaultemail.com <ArrowUpRight size={13} />
              </div>
            </motion.a>

            {/* Community */}
            <motion.a
              variants={fadeInUp}
              href="https://chat.whatsapp.com/HbuIF5IrOQWKdCjOwRPkLJ"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.01 }}
              className="group p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-emerald-500/35 hover:bg-[#0f0f0f] transition-all block"
            >
              <MessageCircle size={28} className="text-emerald-500 mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Community</h3>
              <p className="text-stone-600 text-[11px] font-black uppercase tracking-widest mb-4">
                For suggestions, discussions
              </p>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                The fastest place to flag something, share an idea, or connect with others building the vault.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 group-hover:text-emerald-300 transition-colors">
                Join on WhatsApp <ArrowUpRight size={13} />
              </div>
            </motion.a>

            {/* Reviews */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.01 }}
              onClick={() => navigate('/reviews')}
              className="group p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-emerald-500/35 hover:bg-[#0f0f0f] transition-all cursor-pointer"
            >
              <Star size={28} className="text-emerald-500 mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Reviews</h3>
              <p className="text-stone-600 text-[11px] font-black uppercase tracking-widest mb-4">
                For feedback on what we built
              </p>
              <p className="text-stone-400 text-sm leading-relaxed mb-6">
                Leave an honest review. Future students read them. Honest criticism helps more than silence.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 group-hover:text-emerald-300 transition-colors">
                Open Reviews Page <ArrowUpRight size={13} />
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ── CLOSING NOTE ── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 text-center space-y-4"
        >
          <p className="text-stone-700 font-black text-[10px] uppercase tracking-[0.5em]">
            We're students too. We get it.
          </p>
          <p className="text-stone-600 text-sm max-w-lg mx-auto leading-relaxed">
            No ticket systems. No bots. If something's wrong, we want to know —
            and if you have something that helps, we want to add it.
          </p>
        </motion.section>

      </main>
    </div>
  );
};

export default ContactPage;