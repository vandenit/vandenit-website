import React from "react";

/**
 * Score progression visual — accessible chart with exact values as text.
 * Desktop: 5.0 → 6.4 → 7.2 → 8.8 (iterations Start, 1, 2-3, 4-5)
 * Content: 6.8 → 7.6 → 9.0 (iterations 1, 2, 3)
 * Series distinguishable without colour alone: Desktop uses solid bars, Content uses hatched/dashed bars.
 * Replaces the ASCII score progression diagram in the article.
 */

const desktopData = [
  { label: "Start", score: 5.0 },
  { label: "Iter 1", score: 6.4 },
  { label: "Iter 2-3", score: 7.2 },
  { label: "Iter 4-5", score: 8.8 },
];

const contentData = [
  { label: "Iter 1", score: 6.8 },
  { label: "Iter 2", score: 7.6 },
  { label: "Iter 3", score: 9.0 },
];

const MAX_SCORE = 10;

export function ScoreVisual() {
  return (
    <figure className="vdit-score-visual">
      <figcaption className="vdit-score-caption">
        Review score progression across five design iterations and three content iterations.
        Scores are Claude's review scores, not objective quality measurements.
      </figcaption>

      {/* Desktop series */}
      <div className="vdit-score-series" data-series="desktop">
        <h4 className="vdit-score-series-title">
          <span className="vdit-score-series-label">Desktop score</span>
          <span className="vdit-score-series-pattern-key">solid bars</span>
        </h4>
        <div className="vdit-score-bars">
          {desktopData.map((point) => {
            const widthPct = (point.score / MAX_SCORE) * 100;
            return (
              <div key={point.label} className="vdit-score-bar-row">
                <span className="vdit-score-bar-label">{point.label}</span>
                <div className="vdit-score-bar-track">
                  <div
                    className="vdit-score-bar vdit-score-bar--desktop"
                    style={{ width: `${widthPct}%` }}
                    role="img"
                    aria-label={`${point.label}: ${point.score} out of 10`}
                  />
                </div>
                <span className="vdit-score-bar-value">{point.score.toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content series */}
      <div className="vdit-score-series" data-series="content">
        <h4 className="vdit-score-series-title">
          <span className="vdit-score-series-label">Content score</span>
          <span className="vdit-score-series-pattern-key">dashed bars</span>
        </h4>
        <div className="vdit-score-bars">
          {contentData.map((point) => {
            const widthPct = (point.score / MAX_SCORE) * 100;
            return (
              <div key={point.label} className="vdit-score-bar-row">
                <span className="vdit-score-bar-label">{point.label}</span>
                <div className="vdit-score-bar-track">
                  <div
                    className="vdit-score-bar vdit-score-bar--content"
                    style={{ width: `${widthPct}%` }}
                    role="img"
                    aria-label={`${point.label}: ${point.score} out of 10`}
                  />
                </div>
                <span className="vdit-score-bar-value">{point.score.toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible data table */}
      <div className="vdit-score-table-wrap">
        <table className="vdit-score-table">
          <caption className="vdit-score-table-caption">
            Complete score data — all values are Claude's review scores out of 10.
          </caption>
          <thead>
            <tr>
              <th scope="col">Iteration</th>
              <th scope="col">Desktop score</th>
              <th scope="col">Content score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Start</th>
              <td>5.0</td>
              <td>—</td>
            </tr>
            <tr>
              <th scope="row">Design 1</th>
              <td>6.4</td>
              <td>—</td>
            </tr>
            <tr>
              <th scope="row">Design 2</th>
              <td>7.2</td>
              <td>—</td>
            </tr>
            <tr>
              <th scope="row">Design 3</th>
              <td>7.2</td>
              <td>—</td>
            </tr>
            <tr>
              <th scope="row">Design 4</th>
              <td>8.8</td>
              <td>—</td>
            </tr>
            <tr>
              <th scope="row">Design 5</th>
              <td>8.8</td>
              <td>—</td>
            </tr>
            <tr>
              <th scope="row">Content 1</th>
              <td>—</td>
              <td>6.8</td>
            </tr>
            <tr>
              <th scope="row">Content 2</th>
              <td>—</td>
              <td>7.6</td>
            </tr>
            <tr>
              <th scope="row">Content 3</th>
              <td>—</td>
              <td>9.0</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="vdit-score-note">
        Notice the plateau at 7.2 for two straight iterations — that is the escalation trigger.
      </p>
    </figure>
  );
}