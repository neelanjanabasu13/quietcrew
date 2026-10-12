import { useEffect, useRef, useState } from "react";

/**
 * Copy button for an outreach draft.
 *
 * It always copies the text currently in the field, so edits made by the
 * reader are copied rather than the original wording. Where the browser
 * refuses clipboard access, the draft is selected instead so the keyboard
 * shortcut still works, and the reader is told what to do.
 */

type CopyState = "idle" | "copied" | "manual";

/** Older and non secure browsing contexts have no clipboard permission. */
function legacyCopy(text: string): boolean {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-1000px";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  field.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(field);
  return ok;
}

export function CopyDraftButton({
  text,
  describes,
  targetId,
  className = "",
}: {
  /** The exact text placed on the clipboard. */
  text: string;
  /** Which draft this is, so screen readers announce something useful. */
  describes: string;
  /** The field to focus and select if clipboard access is refused. */
  targetId?: string;
  className?: string;
}) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const flash = (next: CopyState) => {
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2400);
  };

  const copy = async () => {
    let done = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        done = true;
      }
    } catch {
      done = false;
    }
    if (!done) done = legacyCopy(text);

    if (done) {
      flash("copied");
      return;
    }

    if (targetId) {
      const field = document.getElementById(targetId);
      if (field instanceof HTMLTextAreaElement) {
        field.focus();
        field.select();
      }
    }
    flash("manual");
  };

  const label = state === "copied" ? "Copied" : state === "manual" ? "Select and copy" : "Copy";

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={`inline-flex items-center gap-2 rounded-full bg-violet-tint px-3.5 py-2 text-[13px] font-semibold text-violet transition-colors duration-150 hover:bg-violet hover:text-white ${className}`}
      >
        {state === "copied" ? (
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="11" height="11" rx="2.5" />
            <path d="M15 5.5A2.5 2.5 0 0 0 12.5 3H6.5A2.5 2.5 0 0 0 4 5.5v6A2.5 2.5 0 0 0 6.5 14" />
          </svg>
        )}
        <span>{label}</span>
        <span className="sr-only"> the {describes} outreach draft</span>
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied"
          ? `The ${describes} outreach draft is on your clipboard.`
          : state === "manual"
            ? `The ${describes} outreach draft is selected. Press Ctrl C or Command C to copy it.`
            : ""}
      </span>
    </>
  );
}
