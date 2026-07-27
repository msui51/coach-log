export function MobileHeader() {
  return (
    <header className="mobile-head">
      <button className="brand" type="button" aria-label="CoachLog home">
        <span className="mark" aria-hidden="true">
          C
        </span>
        <span>CoachLog</span>
      </button>

      <button className="avatar" type="button" aria-label="Open profile">
        MS
      </button>
    </header>
  );
}
