// Server component on purpose: this markup is what a non-React page would ship. No @meridui/react JS is used.

export function PlainHtmlPreview() {
  return (
    <form style={{ display: "grid", gap: 20, width: "100%", maxWidth: 380 }} action="#">
      <div className="mrd-alert" data-tone="info" role="status">
        <div className="mrd-alert__content">
          <div className="mrd-alert__title">Rendered without React state</div>
          <div className="mrd-alert__body">Classes and data attributes only.</div>
        </div>
      </div>
      <div className="mrd-field">
        <label className="mrd-label" htmlFor="html-email">
          Email
        </label>
        <input id="html-email" className="mrd-input" data-size="md" type="email" placeholder="you@company.com" />
        <p className="mrd-field__description">We only use it for receipts.</p>
      </div>
      <div className="mrd-field" data-invalid="">
        <label className="mrd-label" htmlFor="html-user">
          Username
        </label>
        <input
          id="html-user"
          className="mrd-input"
          data-size="md"
          data-invalid=""
          aria-invalid="true"
          aria-describedby="html-user-error"
          defaultValue="ahmet"
        />
        <p id="html-user-error" className="mrd-field__error">
          That username is taken.
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button type="submit" className="mrd-button" data-variant="primary" data-size="md">
          <span className="mrd-button__content">Create account</span>
        </button>
        <button type="button" className="mrd-button" data-variant="ghost" data-size="md">
          <span className="mrd-button__content">Cancel</span>
        </button>
        <span className="mrd-badge" data-tone="success">
          <span className="mrd-badge__dot" aria-hidden="true" />
          Beta
        </span>
      </div>
    </form>
  );
}
