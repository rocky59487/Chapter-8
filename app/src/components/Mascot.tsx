import { motion } from 'framer-motion';

export type Mood = 'idle' | 'happy' | 'celebrate' | 'sad' | 'think' | 'wave';

interface MascotProps {
  mood?: Mood;
  size?: number;
  className?: string;
}

/**
 * "Lumi" — the platform mascot. A friendly luminous creature drawn entirely in
 * SVG so it scales crisply and themes with CSS. Moods drive eyes + mouth.
 */
export function Mascot({ mood = 'idle', size = 120, className }: MascotProps) {
  const bob =
    mood === 'celebrate'
      ? { y: [0, -10, 0], rotate: [0, -4, 4, 0] }
      : mood === 'wave'
        ? { rotate: [0, 6, -6, 0] }
        : { y: [0, -5, 0] };

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={bob}
      transition={{ duration: mood === 'celebrate' ? 0.7 : 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
        <defs>
          <radialGradient id="lumiBody" cx="38%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#9bffd8" />
            <stop offset="55%" stopColor="#2fd49d" />
            <stop offset="100%" stopColor="#13b884" />
          </radialGradient>
          <radialGradient id="lumiGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(47,212,157,.55)" />
            <stop offset="100%" stopColor="rgba(47,212,157,0)" />
          </radialGradient>
          <linearGradient id="lumiBelly" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,.05)" />
          </linearGradient>
        </defs>

        {/* glow */}
        <circle cx="60" cy="62" r="54" fill="url(#lumiGlow)" />

        {/* ears / sparks */}
        <motion.g
          animate={mood === 'celebrate' ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <path d="M34 22 L42 40 L26 38 Z" fill="url(#lumiBody)" />
          <path d="M86 22 L78 40 L94 38 Z" fill="url(#lumiBody)" />
        </motion.g>

        {/* body */}
        <ellipse cx="60" cy="66" rx="40" ry="38" fill="url(#lumiBody)" />
        <ellipse cx="60" cy="74" rx="24" ry="24" fill="url(#lumiBelly)" />

        {/* cheeks */}
        <circle cx="38" cy="72" r="6" fill="rgba(255,122,152,.5)" />
        <circle cx="82" cy="72" r="6" fill="rgba(255,122,152,.5)" />

        {/* eyes */}
        <Eyes mood={mood} />

        {/* mouth */}
        <Mouth mood={mood} />
      </svg>
    </motion.div>
  );
}

function Eyes({ mood }: { mood: Mood }) {
  if (mood === 'happy' || mood === 'celebrate') {
    return (
      <g stroke="#0c4d3d" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M40 58 q6 -8 12 0" />
        <path d="M68 58 q6 -8 12 0" />
      </g>
    );
  }
  if (mood === 'sad') {
    return (
      <g fill="#0c4d3d">
        <circle cx="46" cy="60" r="4.5" />
        <circle cx="74" cy="60" r="4.5" />
        <path d="M40 52 q6 3 12 1" stroke="#0c4d3d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M68 53 q6 -2 12 -1" stroke="#0c4d3d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    );
  }
  if (mood === 'think') {
    return (
      <g fill="#0c4d3d">
        <circle cx="48" cy="58" r="5" />
        <circle cx="76" cy="58" r="5" />
        <circle cx="49.5" cy="56.5" r="1.6" fill="#fff" />
        <circle cx="77.5" cy="56.5" r="1.6" fill="#fff" />
      </g>
    );
  }
  // idle / wave
  return (
    <g fill="#0c4d3d">
      <circle cx="46" cy="58" r="5.5" />
      <circle cx="74" cy="58" r="5.5" />
      <circle cx="47.8" cy="56" r="1.8" fill="#fff" />
      <circle cx="75.8" cy="56" r="1.8" fill="#fff" />
    </g>
  );
}

function Mouth({ mood }: { mood: Mood }) {
  if (mood === 'celebrate')
    return <ellipse cx="60" cy="78" rx="9" ry="11" fill="#0c4d3d" />;
  if (mood === 'happy' || mood === 'wave')
    return <path d="M50 76 q10 12 20 0" stroke="#0c4d3d" strokeWidth="3.5" fill="none" strokeLinecap="round" />;
  if (mood === 'sad')
    return <path d="M50 82 q10 -10 20 0" stroke="#0c4d3d" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
  if (mood === 'think')
    return <path d="M52 80 h14" stroke="#0c4d3d" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
  return <path d="M53 77 q7 7 14 0" stroke="#0c4d3d" strokeWidth="3.2" fill="none" strokeLinecap="round" />;
}

/** Speech bubble + mascot combo for teaching screens. */
export function MascotSay({ mood = 'idle', text, size = 96 }: { mood?: Mood; text: string; size?: number }) {
  return (
    <div className="flex items-end gap-3">
      <Mascot mood={mood} size={size} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 6 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative card px-4 py-3 max-w-[78%]"
        style={{ borderRadius: '1.1rem' }}
      >
        <span className="ink leading-7">{text}</span>
        <span
          className="absolute left-[-9px] bottom-4 w-0 h-0"
          style={{
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '10px solid var(--surface)',
          }}
        />
      </motion.div>
    </div>
  );
}
