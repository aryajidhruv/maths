import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, MessageCircle, Mail, GitBranch, Users, Zap, BookMarked, RefreshCw } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const MATH_SYMBOLS = ['∫', 'π', '∞', 'Σ', '√', 'Δ', 'θ', 'λ', 'Ω', '∂', '≈', '≠', '±', '≡', '∀', '∃'];

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
          animate={{ y: [0, -80, 0], opacity: [0.05, 0.15, 0.05] }}
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

/* ── thin horizontal rule ── */
const Rule = () => <div className="w-full h-[1px] bg-white/5" />;

/* ── large stat block ── */
const StatBlock = ({ value, label }) => (
  <motion.div variants={fadeInUp} className="flex flex-col gap-1">
    <span className="text-5xl md:text-7xl font-black tracking-tighter text-emerald-400">{value}</span>
    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-500">{label}</span>
  </motion.div>
);

/* ── contribution tier card ── */
const TierCard = ({ icon: Icon, tier, title, description, cta, ctaAction, accent }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -6, scale: 1.01 }}
    className={`group relative p-10 rounded-[2.5rem] border transition-all duration-500 cursor-pointer overflow-hidden
      ${accent
        ? 'bg-emerald-500 border-emerald-400 text-black'
        : 'bg-white/[0.02] border-white/8 hover:border-emerald-500/40 hover:bg-[#0f0f0f]'
      }`}
    onClick={ctaAction}
  >
    {!accent && (
      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]" />
    )}
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.4em] mb-8
      ${accent ? 'bg-black/20 text-black' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
      {tier}
    </div>
    <Icon size={32} className={`mb-6 ${accent ? 'text-black/70' : 'text-emerald-500'}`} />
    <h3 className={`text-3xl font-black tracking-tighter uppercase mb-3 ${accent ? 'text-black' : ''}`}>{title}</h3>
    <p className={`text-sm leading-relaxed mb-8 font-medium ${accent ? 'text-black/70' : 'text-stone-500'}`}>{description}</p>
    <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest
      ${accent ? 'text-black' : 'text-emerald-400 group-hover:text-emerald-300'} transition-colors`}>
      {cta} <ArrowUpRight size={14} />
    </div>
  </motion.div>
);

const Motivation = () => {
  const navigate = useNavigate();

  const COMMUNITY_LINK = "https://chat.whatsapp.com/HbuIF5IrOQWKdCjOwRPkLJ";

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      <FloatingMathParticles />

      {/* ambient glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[140px] rounded-full" />
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

        {/* ══════════════════════════════════════
            HERO — THE MANIFESTO OPENING
        ══════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="pt-16 pb-32 text-center space-y-8"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 text-[9px] font-black tracking-[0.3em] uppercase text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
            <Zap size={11} /> Non-Profit · Student Built · Always Free
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl md:text-[7.5rem] font-black uppercase tracking-tighter leading-[0.82] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/30"
          >
            THIS IS NOT<br />
            <span className="text-emerald-400 italic">JUST A WEBSITE.</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-stone-400 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            It's a statement. That students deserve better than scattered links,
            expired files, and the same confused search — every single semester.
          </motion.p>
        </motion.section>

        <Rule />

        {/* ══════════════════════════════════════
            STATS — SOCIAL PROOF + WEIGHT
        ══════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-28 grid grid-cols-2 md:grid-cols-4 gap-12"
        >
          <StatBlock value="6" label="Semesters Covered" />
          <StatBlock value="NEP" label="2026 Aligned" />
          <StatBlock value="100%" label="Free. Always." />
          <StatBlock value="∞" label="Room to Grow" />
        </motion.section>

        <Rule />

        {/* ══════════════════════════════════════
            THE REAL STORY
        ══════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-28 grid md:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeInUp} className="space-y-6">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">The Problem We Saw</p>
            <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.88]">
              EVERY SEMESTER,<br />THE SAME<br />
              <span className="text-stone-600">CHAOS.</span>
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="space-y-6 text-stone-400 leading-relaxed">
            <p>
              You've been there. Asking seniors. Getting links that don't open.
              Finding notes that belong to a different syllabus. Downloading PDFs
              that turn out to be the wrong year.
            </p>
            <p className="text-stone-500">
              The knowledge existed. Students had it. But it was buried — in phone
              storage, in expired chats, in drives only one person remembered to check.
              And then the next batch started from zero. Again.
            </p>
            <p className="text-stone-600">
              That cycle ends here.
            </p>
          </motion.div>
        </motion.section>

        <Rule />

        {/* ══════════════════════════════════════
            NEP FRESHNESS BLOCK
        ══════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-28"
        >
          <div className="relative rounded-[3.5rem] border border-emerald-500/20 bg-emerald-500/[0.03] p-14 md:p-20 overflow-hidden">
            {/* decorative */}
            <div className="absolute top-0 right-0 w-[40%] h-full bg-emerald-500/5 blur-[80px] pointer-events-none" />

            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <RefreshCw size={16} className="text-emerald-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-emerald-400">Freshly Rebuilt</span>
            </motion.div>

            <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.88] mb-8">
              UPDATED FOR<br />
              <span className="text-emerald-400">NEP 2026.</span><br />
              <span className="text-stone-600">Not 2019. Not 2022.</span>
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-stone-400 max-w-2xl leading-relaxed text-base">
              The curriculum changed. So we rebuilt from scratch. Every playlist
              was curated this April — chapter by chapter, topic by topic — mapped
              directly to the new structure your professors are actually following.
              No leftovers. No shortcuts.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
              {['Aligned to Latest Syllabus', 'Fresh Playlists — April 2026', 'Chapter-wise Structure', 'PYQs Organised by Year'].map(tag => (
                <span key={tag} className="px-4 py-2 text-[9px] font-black uppercase tracking-widest border border-emerald-500/25 text-emerald-400 rounded-full">
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.section>

        <Rule />

        {/* ══════════════════════════════════════
            WHAT'S INSIDE
        ══════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-28 space-y-12"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">What Lives Here</p>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.88]">
              ONE VAULT.<br />EVERYTHING<br />
              <span className="text-emerald-400">IN ITS PLACE.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: BookMarked, title: 'Notes', desc: 'Unit-wise, clean, and actually readable. Written to help you understand, not just survive the exam.' },
              { icon: GitBranch, title: 'PYQs', desc: 'Previous year papers sorted by year and subject. No more hunting. Download and go.' },
              { icon: Zap, title: 'Playlists', desc: 'Handpicked YouTube playlists for every chapter of every subject. NEP-aligned. April 2026.' },
              { icon: BookMarked, title: 'Syllabus', desc: 'The official structure for every subject, always available. Know exactly what you are studying and why.' },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeInUp}
                className="group p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-emerald-500/30 hover:bg-[#0f0f0f] transition-all"
              >
                <Icon size={28} className="text-emerald-500 mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3">{title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <Rule />

        {/* ══════════════════════════════════════
            COMMUNITY MANIFESTO
        ══════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-28 space-y-10"
        >
          <motion.div variants={fadeInUp} className="space-y-4 max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">The Bigger Picture</p>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.88]">
              BUILT BY STUDENTS.<br />
              <span className="text-emerald-400">MEANT TO OUTLAST</span><br />
              ANY ONE BATCH.
            </h2>
          </motion.div>

          <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6 text-stone-400 text-sm leading-relaxed">
            <p>
              This started at Rajdhani College — not because the ambition is small,
              but because every movement needs a starting point. The vision is Delhi
              University. The destination is every maths student who deserves better.
            </p>
            <p>
              We are non-profit. No ads. No paywalls. No one is getting paid to do this.
              It exists because some students decided the cycle of confusion was worth
              breaking — and that building something proper was easier than complaining.
            </p>
            <p className="text-stone-600">
              The only way this keeps growing is if you make it yours. Review what we
              have. Correct what's wrong. Share what's missing. Tell us what the next
              semester needs. That's the deal.
            </p>
          </motion.div>
        </motion.section>

        <Rule />

        {/* ══════════════════════════════════════
            THREE TIERS OF PARTICIPATION
        ══════════════════════════════════════ */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="py-28 space-y-12"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">How You Can Contribute</p>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.88]">
              PICK YOUR<br />
              <span className="text-emerald-400">LEVEL.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <TierCard
              icon={MessageCircle}
              tier="Level 01 — Community"
              title="Use It. Talk About It."
              description="Join the community. Share the vault with your batchmates. Leave a review. Flag a wrong link. Point out an outdated note. This is the most important contribution — it keeps things accurate."
              cta="Join the Community"
              ctaAction={() => window.open('https://chat.whatsapp.com/HbuIF5IrOQWKdCjOwRPkLJ', '_blank')}
            />
            <TierCard
              icon={Users}
              tier="Level 02 — Resources"
              title="Feed the Vault."
              description="Have notes from a great professor? A better playlist? A PYQ we're missing? Reach out. We'll review it and add it under your credit. The vault grows only if people bring things in."
              cta="Send Resources"
              ctaAction={() => navigate('/contact')}
            />
            <TierCard
              icon={GitBranch}
              tier="Level 03 — Core Team"
              title="Own a Part of This."
              description="If you can write code, manage content pipelines, or coordinate resource updates across semesters — we want you on the team. This is how you leave something behind for the batches that come after."
              cta="Get in Touch"
              ctaAction={() => navigate('/contact')}
              accent
            />
          </div>
        </motion.section>

        {/* ══════════════════════════════════════
            CLOSING STRIKE — THE CALL
        ══════════════════════════════════════ */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="pt-12 pb-4"
        >
          <div className="relative rounded-[4rem] bg-[#0A0A0A] border border-white/10 p-16 md:p-24 text-center overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/[0.03] pointer-events-none" />
            <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[60%] h-[60%] bg-emerald-500/8 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-emerald-500">The Question</p>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
                DO YOU JUST<br />
                USE IT —<br />
                <span className="text-emerald-400">OR HELP BUILD IT?</span>
              </h2>
              <p className="text-stone-500 max-w-xl mx-auto leading-relaxed">
                Either answer is fine. But if you've ever struggled to find what
                you needed, you already know what this is about. And you know it matters.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={() => navigate('/')}
                  className="px-10 py-5 bg-emerald-500 text-black font-black rounded-xl hover:bg-emerald-400 transition-all text-[10px] tracking-widest uppercase active:scale-95"
                >
                  Explore the Vault
                </button>
                <a
                  href={COMMUNITY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-all text-[10px] tracking-widest uppercase flex items-center justify-center gap-2"
                >
                  <MessageCircle size={14} /> Join Community
                </a>
              </div>
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
};

export default Motivation;