import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Code2,
  Brain,
  Bug,
  Zap,
  BarChart3,
  MessageSquare,
  Shield,
  Play,
  Pause,
  Menu,
  X,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Logic Teacher",
    description:
      "Learn coding concepts step-by-step with a mentor that adapts to your level.",
  },
  {
    icon: Bug,
    title: "Smart Debugger",
    description:
      "Get intelligent error explanations that teach you to debug independently.",
  },
  {
    icon: Code2,
    title: "Live Code Editor",
    description: "Write and run code in 7+ languages with instant AI feedback.",
  },
  {
    icon: MessageSquare,
    title: "Socratic Mode",
    description:
      "The AI asks you questions, forcing you to think through problems yourself.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Visualize your growth with detailed analytics and skill graphs.",
  },
  {
    icon: Zap,
    title: "Interview Prep",
    description: "Practice DSA problems with realistic interview simulations.",
  },
];

function VideoCard({ src, autoPlay = true, loop = true, muted = true }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="video-card">
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
      />
      <button
        onClick={togglePlay}
        className="video-play-btn"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;

  return (
    <div className="landing-page">
      {/* ============ NAVIGATION ============ */}
      <nav className="landing-nav">
        <div className="landing-nav-left">
          <img src="/favicon.png" alt="logo" height={50} width={50} />

          <span className="landing-logo-text">MentorAI</span>
        </div>

        {/* Desktop Nav */}
        <div className="landing-nav-right desktop-only">
          <button onClick={() => navigate("/login")} className="nav-link">
            Sign In
          </button>
          <button onClick={() => navigate("/register")} className="nav-cta">
            Get Started <ArrowRight size={18} />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-only hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X size={24} color="#1A1A2E" />
          ) : (
            <Menu size={24} color="#1A1A2E" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mobile-menu"
        >
          <button
            onClick={() => {
              navigate("/login");
              setMobileMenuOpen(false);
            }}
            className="mobile-menu-link"
          >
            Sign In
          </button>
          <button
            onClick={() => {
              navigate("/register");
              setMobileMenuOpen(false);
            }}
            className="mobile-menu-cta"
          >
            Get Started <ArrowRight size={18} />
          </button>
        </motion.div>
      )}

      {/* ============ HERO SECTION ============ */}
      <section className="hero-section">
        {/* Background illustrations */}
        <div className="hero-bg-circle hero-bg-circle-1" />
        <div className="hero-bg-circle hero-bg-circle-2" />
        <div className="hero-bg-dots" />
        <div className="hero-bg-grid" />

        <div className="hero-content">
          {/* LEFT: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="hero-text"
          >
            <h1>
              Your AI Mentor That{" "}
              <span className="text-primary">Actually Teaches</span> You to Code
            </h1>

            <p className="hero-subtitle">
              Not another answer bot. A real mentor that guides your thinking,
              debugs your logic, and builds your independence as a developer.
            </p>

            <div className="hero-buttons">
              <button
                onClick={() => navigate("/register")}
                className="btn-primary-lg"
              >
                Start Learning Free <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn-secondary-lg"
              >
                View Demo
              </button>
            </div>

            <div className="hero-stats">
              {[
                { number: "10K+", label: "Developers" },
                { number: "50K+", label: "Problems Solved" },
                { number: "4.9", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label} className="hero-stat">
                  <p className="hero-stat-number">{stat.number}</p>
                  <p className="hero-stat-label">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Video */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hero-video"
          >
            <VideoCard src="/public/robot-coding.mp4" />
            {/* Decorative element behind video */}
            <div className="hero-video-glow" />
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURES GRID ============ */}
      <section className="features-section">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="features-header"
        >
          <h2>Everything You Need to Grow</h2>
          <p>A complete mentorship platform, not just another chatbot</p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="feature-card"
            >
              <div className="feature-icon">
                <feature.icon size={24} color="#FF6B35" />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ SHOWCASE 1: Video Left + Text Right ============ */}
      <section className="showcase-section showcase-alt">
        {/* Background decoration */}
        <div className="showcase-bg-blob" />

        <div className="showcase-content">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="showcase-video"
          >
            <VideoCard src="/header-1.mp4" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="showcase-text"
          >
            <h2>
              Write, Run & Debug in{" "}
              <span className="text-primary">Real-Time</span>
            </h2>
            <p>
              Our powerful code editor supports 7+ languages with instant
              execution. Get AI feedback on every run — not just what's wrong,
              but why it's wrong and how to think about fixing it.
            </p>
            <ul className="checklist checklist-green">
              {[
                "JavaScript, Python, Java, C++, Go, Rust & more",
                "Instant output with execution time",
                "AI-powered error explanation",
                "Save and share your code snippets",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ============ SHOWCASE 2: Text Left + Video Right ============ */}
      <section className="showcase-section">
        <div className="showcase-content">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="showcase-text"
          >
            <h2>
              A Mentor That <span className="text-primary">Never Gives Up</span>{" "}
              On You
            </h2>
            <p>
              Unlike other AI tools that just spit out answers, MentorAI uses a
              5-level hint system and Socratic questioning to make sure you
              truly understand. You'll learn to think like a developer, not just
              copy code.
            </p>
            <ul className="checklist checklist-orange">
              {[
                "5 progressive hint levels",
                "Socratic mode: AI only asks questions",
                "Frustration detection adapts to you",
                "Never gives direct code solutions",
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="showcase-video"
          >
            <VideoCard src="/MentorAI-header.mp4" />
          </motion.div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="cta-section">
        <div className="cta-bg-pattern" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="cta-content"
        >
          <h2>Ready to Become an Independent Developer?</h2>
          <p>
            Join thousands of developers who stopped copying answers and started
            understanding code.
          </p>
          <button onClick={() => navigate("/register")} className="cta-btn">
            <Shield size={20} />
            Create Free Account
          </button>
        </motion.div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="landing-footer">
        <div className="footer-left">
          <img src="/favicon.png" alt="logo" height={50} width={50} />

          <span className="footer-logo-text">MentorAI</span>
        </div>
        <p>Built to teach, not to answer. © 2025</p>
      </footer>

      {/* ============ STYLES ============ */}
      <style>{`
        /* ===== BASE ===== */
        .landing-page {
          background-color: #FFFBF5;
          overflow-x: hidden;
        }

        /* ===== NAVIGATION ===== */
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background-color: #FFFFFF;
          border-bottom: 1px solid #E8D5C4;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .landing-nav-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .landing-logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background-color: #FF6B35;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .landing-logo-icon.small {
          width: 32px;
          height: 32px;
          border-radius: 10px;
        }
        .landing-logo-text {
          font-size: 22px;
          font-weight: 800;
          font-family: 'Cabinet Grotesk', sans-serif;
          color: #1A1A2E;
        }
        .landing-nav-right {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .nav-link {
          background: transparent;
          color: #1A1A2E;
          border: none;
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: color 0.2s;
        }
        .nav-link:hover { color: #FF6B35; }
        .nav-cta {
          background-color: #FF6B35;
          color: #FFFFFF;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
          transition: background-color 0.2s;
          white-space: nowrap;
        }
        .nav-cta:hover { background-color: #E55A2B; }

        /* Mobile */
        .desktop-only { display: flex; }
        .mobile-only { display: none; }
        .hamburger-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 12px;
          padding: 20px 24px;
          background: #FFFFFF;
          border-bottom: 1px solid #E8D5C4;
        }
        .mobile-menu-link {
          background: none;
          border: none;
          color: #1A1A2E;
          font-size: 16px;
          font-weight: 600;
          padding: 12px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          text-align: left;
          border-radius: 10px;
        }
        .mobile-menu-link:hover { background: #FFFBF5; }
        .mobile-menu-cta {
          background-color: #FF6B35;
          color: #FFFFFF;
          border: none;
          padding: 14px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: 'Inter', sans-serif;
        }

        /* ===== HERO ===== */
        .hero-section {
          padding: 40px 24px;
          position: relative;
          overflow: hidden;
          min-height: auto;
        }
        .hero-content {
          display: flex;
          align-items: center;
          gap: 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hero-text {
          flex: 1;
          max-width: 550px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: #FFF3E8;
          border: 1px solid #E8D5C4;
          border-radius: 50px;
          padding: 8px 20px;
          margin-bottom: 24px;
          font-size: 13px;
          font-weight: 600;
          color: #FF6B35;
          font-family: 'Inter', sans-serif;
        }
        .hero-text h1 {
          font-size: clamp(36px, 5vw, 58px);
          font-weight: 800;
          font-family: 'Cabinet Grotesk', sans-serif;
          color: #1A1A2E;
          line-height: 1.1;
          margin: 0 0 20px 0;
        }
        .text-primary { color: #FF6B35; }
        .hero-subtitle {
          font-size: 16px;
          color: #5C5C6E;
          line-height: 1.7;
          margin: 0 0 32px 0;
        }
        .hero-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .btn-primary-lg {
          background-color: #FF6B35;
          color: #FFFFFF;
          border: none;
          padding: 16px 32px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Inter', sans-serif;
          transition: background-color 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .btn-primary-lg:hover { background-color: #E55A2B; }
        .btn-primary-lg:active { transform: scale(0.97); }
        .btn-secondary-lg {
          background-color: #FFFFFF;
          color: #004E64;
          border: 2px solid #004E64;
          padding: 16px 32px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: background-color 0.2s;
          white-space: nowrap;
        }
        .btn-secondary-lg:hover { background-color: #FFF3E8; }
        .hero-stats {
          display: flex;
          gap: 32px;
          margin-top: 40px;
          flex-wrap: wrap;
        }
        .hero-stat-number {
          font-size: 24px;
          font-weight: 800;
          color: #1A1A2E;
          margin: 0 0 4px 0;
          font-family: 'Cabinet Grotesk', sans-serif;
        }
        .hero-stat-label {
          font-size: 13px;
          color: #8B8B9E;
          margin: 0;
          font-weight: 500;
        }
        .hero-video {
          flex: 1;
          position: relative;
        }
        .hero-video-glow {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: -1;
        }

        /* Hero Background Illustrations */
        .hero-bg-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .hero-bg-circle-1 {
          top: -60px;
          left: -60px;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255,107,53,0.04) 0%, transparent 70%);
        }
        .hero-bg-circle-2 {
          bottom: -80px;
          right: 5%;
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(0,78,100,0.04) 0%, transparent 70%);
        }
        .hero-bg-dots {
          position: absolute;
          top: 20%;
          right: 45%;
          width: 80px;
          height: 80px;
          background-image: radial-gradient(#E8D5C4 1.5px, transparent 1.5px);
          background-size: 12px 12px;
          opacity: 0.5;
          pointer-events: none;
        }
        .hero-bg-grid {
          position: absolute;
          bottom: 10%;
          left: 5%;
          width: 100px;
          height: 100px;
          background-image: 
            linear-gradient(#E8D5C4 1px, transparent 1px),
            linear-gradient(90deg, #E8D5C4 1px, transparent 1px);
          background-size: 20px 20px;
          opacity: 0.3;
          pointer-events: none;
        }

        /* ===== VIDEO CARD ===== */
        .video-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 80px rgba(0,0,0,0.12);
        }
        .video-card video {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 20px;
        }
        .video-play-btn {
          position: absolute;
          bottom: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .video-play-btn:hover { background-color: rgba(0,0,0,0.7); }

        /* ===== FEATURES ===== */
        .features-section {
          padding: 60px 24px;
          background-color: #FFFFFF;
        }
        .features-header {
          text-align: center;
          margin-bottom: 48px;
        }
        .features-header h2 {
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 800;
          font-family: 'Cabinet Grotesk', sans-serif;
          color: #1A1A2E;
          margin: 0 0 8px 0;
        }
        .features-header p {
          font-size: 16px;
          color: #5C5C6E;
          margin: 0;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .feature-card {
          background-color: #FFFBF5;
          border: 1px solid #E8D5C4;
          border-radius: 16px;
          padding: 24px;
          transition: border-color 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .feature-card:hover {
          border-color: #FF6B35;
          box-shadow: 0 8px 30px rgba(255,107,53,0.08);
        }
        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background-color: #FFF3E8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }
        .feature-card h3 {
          font-size: 17px;
          font-weight: 700;
          color: #1A1A2E;
          margin: 0 0 6px 0;
          font-family: 'Cabinet Grotesk', sans-serif;
        }
        .feature-card p {
          font-size: 14px;
          color: #5C5C6E;
          line-height: 1.6;
          margin: 0;
        }

        /* ===== SHOWCASE ===== */
        .showcase-section {
          padding: 60px 24px;
          background-color: #FFFFFF;
          position: relative;
          overflow: hidden;
        }
        .showcase-section.showcase-alt {
          background-color: #FFFBF5;
        }
        .showcase-content {
          display: flex;
          align-items: center;
          gap: 48px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .showcase-video { flex: 1; }
        .showcase-text { flex: 1; max-width: 500px; }
        .showcase-text h2 {
          font-size: clamp(28px, 4vw, 38px);
          font-weight: 800;
          font-family: 'Cabinet Grotesk', sans-serif;
          color: #1A1A2E;
          line-height: 1.2;
          margin: 0 0 16px 0;
        }
        .showcase-text p {
          font-size: 15px;
          color: #5C5C6E;
          line-height: 1.7;
          margin: 0 0 24px 0;
        }
        .showcase-bg-blob {
          position: absolute;
          top: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,107,53,0.03) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Checklists */
        .checklist {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .checklist li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: #1A1A2E;
          font-weight: 500;
        }
        .checklist li::before {
          content: '';
          width: 20px;
          height: 20px;
          border-radius: 50%;
          flex-shrink: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: center;
        }
        .checklist-green li::before { background-color: #2ECC71; }
        .checklist-orange li::before { background-color: #FF6B35; }

        /* ===== CTA ===== */
        .cta-section {
          padding: 80px 24px;
          text-align: center;
          background-color: #1A1A2E;
          position: relative;
          overflow: hidden;
        }
        .cta-bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 24px 24px;
          pointer-events: none;
        }
        .cta-content {
          position: relative;
          z-index: 1;
        }
        .cta-section h2 {
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          font-family: 'Cabinet Grotesk', sans-serif;
          color: #FFFFFF;
          margin: 0 0 12px 0;
        }
        .cta-section p {
          font-size: 16px;
          color: #8B8B9E;
          max-width: 500px;
          margin: 0 auto 32px auto;
        }
        .cta-btn {
          background-color: #FF6B35;
          color: #FFFFFF;
          border: none;
          padding: 18px 40px;
          border-radius: 14px;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Inter', sans-serif;
          transition: background-color 0.2s;
        }
        .cta-btn:hover { background-color: #E55A2B; }

        /* ===== FOOTER ===== */
        .landing-footer {
          padding: 24px;
          background-color: #1A1A2E;
          border-top: 1px solid #2C2C3A;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .footer-logo-text {
          color: #FFFFFF;
          font-weight: 700;
          font-family: 'Cabinet Grotesk', sans-serif;
        }
        .landing-footer p {
          color: #5C5C6E;
          font-size: 13px;
          margin: 0;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1023px) {
          .hero-content {
            flex-direction: column;
            gap: 36px;
          }
          .hero-text {
            max-width: 100%;
            order: 1;
          }
          .hero-video {
            order: 2;
            max-width: 500px;
            width: 100%;
          }
          .hero-section {
            padding: 32px 20px;
          }
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .showcase-content {
            flex-direction: column;
            gap: 36px;
          }
          .showcase-text {
            max-width: 100%;
          }
          .showcase-video {
            max-width: 500px;
            width: 100%;
          }
          .landing-nav {
            padding: 12px 20px;
          }
          .features-section,
          .showcase-section {
            padding: 48px 20px;
          }
        }

        @media (max-width: 767px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          .mobile-menu { display: flex; }

          .hero-section {
            padding: 24px 16px;
          }
          .hero-text h1 {
            font-size: 30px;
          }
          .hero-badge {
            font-size: 12px;
            padding: 6px 14px;
            margin-bottom: 16px;
          }
          .hero-subtitle {
            font-size: 14px;
          }
          .hero-buttons {
            flex-direction: column;
            width: 100%;
          }
          .btn-primary-lg,
          .btn-secondary-lg {
            width: 100%;
            justify-content: center;
            padding: 14px 24px;
            font-size: 15px;
          }
          .hero-stats {
            gap: 20px;
            margin-top: 28px;
          }
          .hero-stat-number {
            font-size: 20px;
          }
          .features-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .features-header h2 {
            font-size: 26px;
          }
          .features-section,
          .showcase-section {
            padding: 36px 16px;
          }
          .showcase-text h2 {
            font-size: 24px;
          }
          .cta-section {
            padding: 56px 16px;
          }
          .cta-section h2 {
            font-size: 26px;
          }
          .cta-btn {
            width: 100%;
            justify-content: center;
          }
          .landing-footer {
            flex-direction: column;
            text-align: center;
          }
          .hero-bg-dots,
          .hero-bg-grid {
            display: none;
          }
        }

        @media (min-width: 1440px) {
          .hero-content,
          .showcase-content {
            max-width: 1300px;
          }
          .features-grid {
            max-width: 1200px;
          }
        }
      `}</style>
    </div>
  );
}
