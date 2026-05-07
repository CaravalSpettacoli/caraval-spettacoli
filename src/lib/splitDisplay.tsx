import { Fragment, type ReactNode } from "react";

/**
 * Wrappa in <span class="font-sans"> tutti i caratteri che non sono A-Z, 0-9 o spazio,
 * così il font display Stonehead viene usato solo dove rende correttamente.
 *
 * Why: Stonehead Demo ha glyph alternati su lettere minuscole + caratteri speciali
 * che mostrano un watermark "@misterchek". Anche con font-feature-settings off,
 * minuscole/punteggiatura rendono male — usiamo Inter per quei caratteri.
 *
 * Trasforma anche le minuscole in MAIUSCOLE (Stonehead è solo uppercase).
 *
 * Esempio: "Caraval — Soncino" →
 *   <>CARAVAL<span class="font-sans"> — </span>SONCINO</>
 */
export function splitDisplay(text: string | undefined | null): ReactNode {
  if (!text) return null;

  const upper = text.toUpperCase();
  const tokens: { text: string; display: boolean }[] = [];
  let buffer = "";
  let bufferIsDisplay: boolean | null = null;

  const isDisplayChar = (ch: string) => /[A-Z0-9 ]/.test(ch);

  for (const ch of upper) {
    const display = isDisplayChar(ch);
    if (bufferIsDisplay === null) {
      bufferIsDisplay = display;
      buffer = ch;
    } else if (display === bufferIsDisplay) {
      buffer += ch;
    } else {
      tokens.push({ text: buffer, display: bufferIsDisplay });
      buffer = ch;
      bufferIsDisplay = display;
    }
  }
  if (buffer && bufferIsDisplay !== null) {
    tokens.push({ text: buffer, display: bufferIsDisplay });
  }

  return tokens.map((tk, i) =>
    tk.display ? (
      <Fragment key={i}>{tk.text}</Fragment>
    ) : (
      <span key={i} className="font-sans">
        {tk.text}
      </span>
    )
  );
}
