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

// Eine Flyer-Zeile pro Span; auf breiten Screens harte Umbrüche wie im Flyer,
// auf schmalen fließt der Text (siehe CSS .lf-line).
const Lines = ({ lines }: { lines: readonly string[] }) =>
  lines.map((line) => (
    <span className="lf-line" key={line}>
      {line}
    </span>
  ));

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
          onClick={(e) => {
            e.stopPropagation();
            setPage(2);
          }}
        >
          <div className="lf-art">
            <img src={frontArt} alt="" />
          </div>
          {/* Textlayer als SVG im Koordinatensystem des Flyers (A5 in pt):
              x/y sind die Grundlinien-Koordinaten direkt aus dem PDF
              (CropBox beginnt bei y=8.58pt, ist hier schon eingerechnet). */}
          <svg
            className="lf-front-text"
            viewBox="0 0 419.25 595.5"
            aria-hidden="false"
          >
            <g className="lf-display" fontSize="21.08" letterSpacing="0.63">
              <text x="227.6" y="56.7">
                {front.day1}
              </text>
              <text x="263.6" y="55.7">
                {front.day2}
              </text>
              <text x="319.2" y="53.9" transform="rotate(-3.4 319.2 53.9)">
                {front.month}
              </text>
            </g>
            <g className="lf-display" fontSize="37.96" letterSpacing="1.14">
              <text x="120.2" y="229.4">
                {front.titleEn}
              </text>
              <text x="101.3" y="269.5">
                {front.titleDe}
              </text>
            </g>
            <g className="lf-body" fontSize="13.03" letterSpacing="1.11">
              <text x="107.5" y="296.3">
                {front.tagline1}
              </text>
              <text x="118.6" y="312.0">
                {front.tagline2}
              </text>
              <text x="186.9" y="343.5">
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
                y="582.2"
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
            className="lf-round lf-close"
            aria-label="Schließen"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            ×
          </button>
          <button
            className="lf-round lf-nav-front"
            aria-label="Weiter zur Rückseite"
            onClick={(e) => {
              e.stopPropagation();
              setPage(2);
            }}
          >
            →
          </button>
        </div>
      ) : (
        <div
          className="lf-card lf-back lf-body"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="lf-art">
            <img src={backBg} alt="" />
          </div>
          <div className="lf-back-inner">
            <div className="lf-intro">
              {back.intro.map((lines) => (
                <p key={lines[0]}>
                  <Lines lines={lines} />
                </p>
              ))}
            </div>

            <div className="lf-info">
              {back.info.map((lines, i) => (
                <p key={lines[0]}>
                  <Lines lines={lines} />
                  {i === back.info.length - 1 && (
                    <span className="lf-line">
                      {back.contact}{" "}
                      <a href={`mailto:${back.email}`}>{back.email}</a>
                    </span>
                  )}
                </p>
              ))}
            </div>

            <p className="lf-share">
              <Lines lines={back.share} />
            </p>

            <p className="lf-signup">
              <Lines lines={back.signup} />
              <span className="lf-line">
                <a
                  href={back.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {back.signupUrl}
                </a>
              </span>
            </p>
          </div>

          <button
            className="lf-round lf-close"
            aria-label="Schließen"
            onClick={close}
          >
            ×
          </button>
          <button
            className="lf-round lf-nav-back"
            aria-label="Zurück zur Vorderseite"
            onClick={() => setPage(1)}
          >
            ←
          </button>
        </div>
      )}
    </div>
  );
};

export default LittleFuturePopup;
