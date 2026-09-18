import { useEffect, useState } from "react";
import { littleFutureFlyer as flyer } from "../content/littleFuture";
import frontArt from "../assets/littlefuture/flyer-front-art.webp";
import backBg from "../assets/littlefuture/flyer-back-bg.webp";
import logo from "../assets/littlefuture/pembau-logo-flyer.png";
import euBadge from "../assets/littlefuture/eu-cofunded.png";
import "../assets/littlefuture/fonts/fonts.css";
import "./LittleFuturePopup.css";

// Temporäre Kampagne: nach dem Festival wird das Popup gar nicht mehr gerendert.
const CAMPAIGN_END = new Date("2026-10-05T00:00:00");
const DISMISSED_KEY = "lf-popup-dismissed";

export const isLittleFutureActive = () => {
  if (new Date() >= CAMPAIGN_END) return false;
  try {
    return sessionStorage.getItem(DISMISSED_KEY) !== "1";
  } catch {
    return true;
  }
};

interface LittleFuturePopupProps {
  onClose: () => void;
}

const LittleFuturePopup = ({ onClose }: LittleFuturePopupProps) => {
  const [page, setPage] = useState<1 | 2>(1);

  const close = () => {
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      /* private mode etc. – dann kommt das Popup halt nochmal */
    }
    onClose();
  };

  // Escape schließt, Pfeiltasten blättern, Seite dahinter scrollt nicht
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") setPage(2);
      else if (e.key === "ArrowLeft") setPage(1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { front, back } = flyer;

  return (
    <div
      className="lf-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Little future – kleine Zukunft"
      onClick={close}
    >
      {page === 1 ? (
        <div
          className="lf-card lf-front"
          style={{ backgroundImage: `url(${frontArt})` }}
          onClick={(e) => {
            e.stopPropagation();
            setPage(2);
          }}
        >
          <span className="lf-display lf-day1">{front.day1}</span>
          <span className="lf-display lf-day2">{front.day2}</span>
          <span className="lf-display lf-month">{front.month}</span>

          <span className="lf-display lf-title-en">{front.titleEn}</span>
          <span className="lf-display lf-title-de">{front.titleDe}</span>

          <span className="lf-body lf-tagline1">{front.tagline1}</span>
          <span className="lf-body lf-tagline2">{front.tagline2}</span>
          <span className="lf-body lf-forall">{front.forAll}</span>

          <img className="lf-logo" src={logo} alt="Pembau" />
          <img className="lf-eu" src={euBadge} alt="Co-funded by the European Union" />
          <a
            className="lf-body lf-email-front"
            href={`mailto:${front.email}`}
            onClick={(e) => e.stopPropagation()}
          >
            {front.email}
          </a>

          <button className="lf-close" aria-label="Schließen" onClick={(e) => { e.stopPropagation(); close(); }}>
            ×
          </button>
        </div>
      ) : (
        <div
          className="lf-card lf-back lf-body"
          style={{ backgroundImage: `url(${backBg})` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="lf-intro">
            <p>
              {back.heading}
              <br />
              {back.paragraphs[0]}
            </p>
            {back.paragraphs.slice(1).map((p) => (
              <p key={p.slice(0, 20)}>{p}</p>
            ))}
          </div>

          <div className="lf-info">
            {back.info.map((i) => (
              <p key={i.label}>
                {i.label} {i.text}
              </p>
            ))}
            <p>
              {back.contact} <a href={`mailto:${back.email}`}>{back.email}</a>
            </p>
          </div>

          <p className="lf-share">{back.share}</p>

          <p className="lf-signup">
            {back.signupHint}
            <br />
            <a href={back.signupUrl} target="_blank" rel="noopener noreferrer">
              {back.signupUrl}
            </a>
          </p>

          <button className="lf-close" aria-label="Schließen" onClick={close}>
            ×
          </button>
        </div>
      )}

      <div className="lf-nav" onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setPage(1)} disabled={page === 1}>
          ← ZURÜCK
        </button>
        <div className="lf-dots" aria-hidden="true">
          <span className={page === 1 ? "active" : ""} />
          <span className={page === 2 ? "active" : ""} />
        </div>
        <button onClick={() => (page === 1 ? setPage(2) : close())}>
          {page === 1 ? "WEITER →" : "SCHLIESSEN"}
        </button>
      </div>
    </div>
  );
};

export default LittleFuturePopup;
