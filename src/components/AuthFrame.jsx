export default function AuthFrame({ children }) {
  return (
    <div className="authShell">
      <aside className="authBrand">
        <div>
          <div className="authBrandMark" aria-hidden="true">SH</div>
          <h1>SchoolHub</h1>
          <p>
            Viena sakārtota vieta stundām, mājasdarbiem, paziņojumiem un sarunām.
          </p>
        </div>

        <div className="authVisual" aria-hidden="true">
          <div className="authVisualRow"><span /><span /><span /></div>
          <div className="authVisualRow"><span /><span /><span /></div>
          <div className="authVisualRow"><span /><span /><span /></div>
        </div>
      </aside>

      <main className="authPanel">
        {children}
      </main>
    </div>
  );
}
