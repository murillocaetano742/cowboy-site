/** COWBOY Energia wordmark, set in Oswald like the bottle label. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`cb-logo ${className}`} role="img" aria-label="COWBOY Energia">
      <b aria-hidden="true">COWBOY</b>
      <small aria-hidden="true">ENERGIA</small>
    </span>
  );
}
