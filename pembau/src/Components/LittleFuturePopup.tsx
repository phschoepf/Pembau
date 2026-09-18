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
          {/* Textlayer als SVG im Koordinatensystem des Flyers (A5 in pt):
              x/y sind die Grundlinien-Koordinaten direkt aus dem PDF. */}
          <svg
            className="lf-front-text"
            viewBox="0 0 419.25 595.5"
            aria-hidden="false"
          >
            <g className="lf-display" fontSize="21.08" letterSpacing="0.63">
              <text x="227.6" y="48.1">
                {front.day1}
              </text>
              <text x="263.6" y="47.1">
                {front.day2}
              </text>
              <text x="319.2" y="45.3" transform="rotate(-3.4 319.2 45.3)">
                {front.month}
              </text>
            </g>
            <g className="lf-display" fontSize="37.96" letterSpacing="1.14">
              <text x="120.2" y="220.8">
                {front.titleEn}
              </text>
              <text x="101.3" y="260.9">
                {front.titleDe}
              </text>
            </g>
            <g className="lf-body" fontSize="13.03" letterSpacing="1.11">
              <text x="107.5" y="287.7">
                {front.tagline1}
              </text>
              <text x="118.6" y="303.4">
                {front.tagline2}
              </text>
              <text x="186.9" y="334.9">
                {front.forAll}
              </text>
            </g>
            <a
              href={`mailto:${front.email}`}
              onClick={(e) => e.stopPropagation()}
            >
              <text
                className="lf-body"
                x="300"
                y="573.6"
                fontSize="9.05"
                style={{ letterSpacing: "0.129em" }}
              >
                {front.email}
              </text>
            </a>
          </svg>

          <img className="lf-logo" src={logo} alt="Pembau" />
          <img
            className="lf-eu"
            src={euBadge}
            alt="Co-funded by the European Union"
          />

          <button
            className="lf-close"
            aria-label="Schließen"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <div
          className="lf-card lf-back lf-body"
          style={{ backgroundImage: `url(${backBg})` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="lf-back-inner">
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
              <a
                href={back.signupUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {back.signupUrl}
              </a>
            </p>
          </div>

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
