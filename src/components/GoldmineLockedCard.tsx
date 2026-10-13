/**
 * A held-back Goldmine result.
 *
 * Businesses that belong to the paid scan are drawn on a full-strength violet
 * gradient with a padlock, so they read as part of the list while staying
 * visibly shut. No figure for a locked business is shown, because none of them
 * reach the browser until the scan is paid for.
 */

function Padlock({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="3" />
      <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" />
      <path d="M12 14.3v2.7" />
    </svg>
  );
}

export function GoldmineLockedCard({
  rank,
  total,
  blur,
}: {
  rank: number;
  total: number;
  /** Details the browser already holds, shown blurred rather than hidden. */
  blur?: { name: string; meta: string };
}) {
  return (
    <li className="goldmine-locked rounded-[20px] p-5 soft-shadow">
      <div className="flex flex-wrap items-start justify-between gap-3">
        {blur ? (
          <div aria-hidden="true" className="select-none blur-[6px]">
            <h3 className="text-[1.1rem] font-extrabold text-paper">{blur.name}</h3>
            <p className="mt-1 text-[14px] text-muted-on-violet">{blur.meta}</p>
          </div>
        ) : (
          <div>
            <h3 className="text-[1.1rem] font-extrabold text-paper">Prospect {rank}</h3>
            <p className="mt-1 text-[14px] text-muted-on-violet">
              The name is revealed with the full scan
            </p>
          </div>
        )}
        <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-paper/12 px-3 py-1 text-[12px] font-semibold text-peach">
          <Padlock size={13} />
          Locked
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-[16px] bg-paper/10 p-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-peach text-violet-deeper">
          <Padlock size={19} />
        </span>
        <p className="text-[14px] text-muted-on-violet">
          <span className="font-semibold text-paper">
            Prospect {rank} of {total}.
          </span>{" "}
          Its reputation figures, each assistant check and its outreach draft come with the full
          scan.
        </p>
      </div>
    </li>
  );
}
