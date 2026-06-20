import { useEffect, useRef, useState } from "react";
import { Clock, Wine, Volume2, VolumeX } from "lucide-react";

// ── Palette tokens ──────────────────────────────────────────────
const C = {
  cream: "#FAF7F0",
  sage: "#8A9A7E",
  sageDark: "#5F6E54",
  terracotta: "#B8835A",
  darkText: "#3A3528",
  white: "#FFFFFF",
};

// ── Reveal ────────────────────────────────────────────────────────
// Wraps any element; animates fade-up when it enters the viewport.
// `delay` staggers siblings within the same section.
function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  style: extraStyle,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const El = Tag as any;

  return (
    <El
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.75s ease-out ${delay}ms, transform 0.75s ease-out ${delay}ms`,
        ...extraStyle,
      }}
    >
      {children}
    </El>
  );
}

// ── Eyebrow ──────────────────────────────────────────────────────
function Eyebrow({
  children,
  light = false,
  delay = 0,
}: {
  children: string;
  light?: boolean;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} as="p" style={{ marginBottom: "16px" }}>
      <span
        style={{
          display: "block",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 500,
          fontSize: "12px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: light ? "#FFFFFF" : C.sageDark,
        }}
      >
        {children}
      </span>
    </Reveal>
  );
}

// ── Section title ─────────────────────────────────────────────────
function SectionTitle({
  children,
  light = false,
  delay = 0,
}: {
  children: string;
  light?: boolean;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} as="h2" style={{ marginBottom: "24px" }}>
      <span
        style={{
          display: "block",
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(32px, 6vw, 48px)",
          color: light ? "#FFFFFF" : C.sageDark,
          lineHeight: 1.1,
        }}
      >
        {children}
      </span>
    </Reveal>
  );
}

// ── Divider ───────────────────────────────────────────────────────
function Divider({ delay = 0, light = false }: { delay?: number; light?: boolean }) {
  return (
    <Reveal delay={delay}>
      <div
        style={{
          width: "40px",
          height: "1px",
          backgroundColor: light ? "rgba(255,255,255,0.6)" : C.terracotta,
          opacity: light ? 1 : 0.5,
          margin: "0 auto",
        }}
      />
    </Reveal>
  );
}

// ── Countdown ─────────────────────────────────────────────────────
function useCountdown() {
  const target = new Date("2026-11-14T18:30:00-03:00").getTime();

  const calc = () => {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return [d, h, m, s].map((n) => String(n).padStart(2, "0"));
  };

  const [parts, setParts] = useState(calc);

  useEffect(() => {
    const id = setInterval(() => setParts(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return parts;
}

// ── WhatsApp icon (outline) ───────────────────────────────────────
function WhatsAppIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

// ── Hero internal reveal (on mount, not scroll) ───────────────────
function HeroReveal({
  children,
  delay = 0,
  style: extraStyle,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
}


// ── HERO BORDER DECORATION ────────────────────────────────────────
function HeroBorder() {
  return (
    <div
      aria-hidden
      style={{ position: "absolute", inset: "20px", pointerEvents: "none" }}
    >
      {/* Outer border */}
      <div style={{
        position: "absolute", inset: 0,
        border: `2px solid ${C.sage}`,
        borderRadius: "8px",
        opacity: 0.65,
      }} />
      {/* Inner border */}
      <div style={{
        position: "absolute", inset: "10px",
        border: `1.5px solid ${C.sage}`,
        borderRadius: "6px",
        opacity: 0.4,
      }} />
      {/* Corner dots — terracotta */}
      {[
        { top: -6, left: -6 },
        { top: -6, right: -6 },
        { bottom: -6, left: -6 },
        { bottom: -6, right: -6 },
      ].map((pos, i) => (
        <div key={i} style={{
          position: "absolute", ...pos,
          width: 12, height: 12,
          borderRadius: "50%",
          backgroundColor: C.terracotta,
          opacity: 1,
        }} />
      ))}
    </div>
  );
}

// ── SECTION 1 — HERO ──────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        backgroundColor: C.cream,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <HeroBorder />

      <HeroReveal delay={200}>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
            fontSize: "12px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: C.sageDark,
            marginBottom: "24px",
          }}
        >
          NOS CASAMOS
        </p>
      </HeroReveal>

      <HeroReveal delay={450}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(48px, 12vw, 96px)",
            color: C.sageDark,
            lineHeight: 1.1,
            marginBottom: "32px",
          }}
        >
          Carolina
          <br />
          &amp; Nicolás
        </h1>
      </HeroReveal>

      <HeroReveal delay={700}>
        <div
          style={{
            width: "40px",
            height: "1px",
            backgroundColor: C.terracotta,
            opacity: 0.5,
            margin: "0 auto 16px",
          }}
        />
      </HeroReveal>

      <HeroReveal delay={850}>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
            fontSize: "14px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: C.darkText,
          }}
        >
          Sábado 14 de Noviembre de 2026
        </p>
      </HeroReveal>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1px",
          height: "32px",
          backgroundColor: C.terracotta,
          animation: "pulse-line 2s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes pulse-line {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}

// ── SECTION 2 — MENSAJE ───────────────────────────────────────────
function Mensaje() {
  return (
    <section style={{ backgroundColor: C.white, padding: "80px 24px" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <Eyebrow delay={0}>UNA HISTORIA DE AMOR</Eyebrow>
        <SectionTitle delay={120}>Llegó el día</SectionTitle>
        <Reveal delay={260}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "16px",
              lineHeight: 1.8,
              color: "rgba(58,53,40,0.72)",
            }}
          >
            Después de tantos años juntos, llegó el momento de decir que sí frente a las personas que más queremos. Tu presencia en este día significa el mundo para nosotros.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ── SECTION 3 — CUENTA REGRESIVA ─────────────────────────────────
function CuentaRegresiva() {
  const [d, h, m, s] = useCountdown();
  const blocks = [
    { value: d, label: "DÍAS" },
    { value: h, label: "HORAS" },
    { value: m, label: "MINUTOS" },
    { value: s, label: "SEGUNDOS" },
  ];

  return (
    <section
      style={{ backgroundColor: C.sage, padding: "80px 24px", textAlign: "center" }}
    >
      <Eyebrow light delay={0}>FALTAN</Eyebrow>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
          maxWidth: "400px",
          margin: "0 auto",
        }}
        className="sm:grid-cols-4"
      >
        {blocks.map(({ value, label }, i) => (
          <Reveal key={label} delay={i * 100}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
                fontSize: "clamp(40px, 10vw, 64px)",
                color: "#FFFFFF",
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              {value}
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "12px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.92)",
              }}
            >
              {label}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── SECTION 4 — DETALLES ──────────────────────────────────────────
function Detalles() {
  return (
    <section style={{ backgroundColor: C.cream, padding: "80px 24px" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <Eyebrow delay={0}>EL DÍA ESPECIAL</Eyebrow>
        <SectionTitle delay={120}>Detalles</SectionTitle>

        <Reveal delay={240}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {[
              { Icon: Clock, title: "CEREMONIA", text: "18:30 hs" },
              { Icon: Wine, title: "FIESTA", text: "A continuación" },
            ].map(({ Icon, title, text }) => (
              <div
                key={title}
                style={{
                  backgroundColor: C.white,
                  border: `1px solid rgba(138,154,126,0.3)`,
                  borderRadius: "8px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <Icon size={22} strokeWidth={1.4} color={C.sageDark} />
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                    fontSize: "13px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: C.sageDark,
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 300,
                    fontSize: "14px",
                    color: C.darkText,
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={380}>
          <div
            style={{
              display: "inline-block",
              border: `1px solid ${C.terracotta}`,
              borderRadius: "8px",
              padding: "8px 16px",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.terracotta,
              }}
            >
              DRESSCODE FORMAL · EVITAR EL BLANCO
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── SECTION 5 — UBICACIÓN ─────────────────────────────────────────
function Ubicacion() {
  return (
    <section style={{ backgroundColor: C.white, padding: "80px 24px" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <Eyebrow delay={0}>¿DÓNDE?</Eyebrow>
        <SectionTitle delay={120}>El lugar</SectionTitle>

        <Reveal delay={240}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "18px",
              color: C.sageDark,
              marginBottom: "4px",
            }}
          >
            Salones del Puerto
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "14px",
              color: "rgba(58,53,40,0.65)",
              marginBottom: "24px",
            }}
          >
            Santa Fe, Argentina
          </p>
        </Reveal>

<Reveal delay={440}>
          <a
            href="https://maps.google.com/?q=Salones+El+Puerto+Santa+Fe+Argentina"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              border: `1px solid ${C.sageDark}`,
              borderRadius: "8px",
              padding: "12px 24px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.sageDark,
              textDecoration: "none",
            }}
          >
            VER EN GOOGLE MAPS
          </a>
        </Reveal>
      </div>
    </section>
  );
}


// ── SECTION 7 — RSVP ─────────────────────────────────────────────
function RSVP() {
  return (
    <section style={{ backgroundColor: C.sage, padding: "80px 24px" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
        <Eyebrow light delay={0}>CONFIRMÁ TU ASISTENCIA</Eyebrow>
        <SectionTitle light delay={120}>¿Vas a estar?</SectionTitle>
        <Divider delay={240} light />

        <Reveal delay={340}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "14px",
              color: "rgba(255,255,255,0.95)",
              margin: "12px 0 28px",
            }}
          >
            Confirmá antes del <strong style={{ fontWeight: 400, color: C.white }}>1 de noviembre</strong>
          </p>
        </Reveal>

        <Reveal delay={460}>
          <a
            href="https://wa.me/5493XXXXXXXXX?text=Hola%20Carolina%20y%20Nicol%C3%A1s%2C%20confirmo%20mi%20asistencia%20a%20su%20casamiento%20el%2014%20de%20noviembre"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: C.white,
              borderRadius: "8px",
              padding: "14px 28px",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: C.sageDark,
              textDecoration: "none",
            }}
          >
            <WhatsAppIcon />
            CONFIRMAR POR WHATSAPP
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ── SECTION 8 — FOOTER ────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{ backgroundColor: C.sageDark, padding: "32px 24px", textAlign: "center" }}
    >
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "12px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.75)",
        }}
      >
        DISEÑADO POR SOFT SPARKS
      </p>
    </footer>
  );
}

// ── MUSIC TOGGLE ──────────────────────────────────────────────────
// Replace [URL_MUSICA] with a direct link to an .mp3 or .ogg file.
const MUSIC_URL = "[URL_MUSICA]";

function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  // Fade button in after a short delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Create audio element once
  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audio.volume = 0;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const fadeTo = (target: number, duration = 1200) => {
    const audio = audioRef.current;
    if (!audio) return;
    const start = audio.volume;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      audio.volume = Math.min(1, Math.max(0, start + (target - start) * t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!playing) {
      await audio.play().catch(() => {});
      fadeTo(0.5);
      setPlaying(true);
    } else {
      fadeTo(0, 800);
      setTimeout(() => audio.pause(), 800);
      setPlaying(false);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Pausar música" : "Reproducir música"}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 100,
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: `1px solid ${C.sageDark}`,
        backgroundColor: C.cream,
        color: C.sageDark,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.8)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      }}
    >
      {playing
        ? <Volume2 size={16} strokeWidth={1.5} />
        : <VolumeX size={16} strokeWidth={1.5} />
      }
    </button>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Hero />
      <Mensaje />
      <CuentaRegresiva />
      <Detalles />
      <Ubicacion />
      <RSVP />
      <Footer />
      <MusicToggle />
    </div>
  );
}
