// Bilerek server component: React kullanmayan bir sayfa da tam olarak bu markup'ı gönderir. @meridui/react JS'i kullanılmaz.

export function PlainHtmlPreview() {
  return (
    <form style={{ display: "grid", gap: 20, width: "100%", maxWidth: 380 }} action="#">
      <div className="mrd-alert" data-tone="info" role="status">
        <div className="mrd-alert__content">
          <div className="mrd-alert__title">React state'i olmadan render'landı</div>
          <div className="mrd-alert__body">Yalnızca sınıflar ve data attribute'ları.</div>
        </div>
      </div>
      <div className="mrd-field">
        <label className="mrd-label" htmlFor="html-email">
          E-posta
        </label>
        <input id="html-email" className="mrd-input" data-size="md" type="email" placeholder="sen@sirket.com" />
        <p className="mrd-field__description">Yalnızca makbuzlar için kullanıyoruz.</p>
      </div>
      <div className="mrd-field" data-invalid="">
        <label className="mrd-label" htmlFor="html-user">
          Kullanıcı adı
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
          Bu kullanıcı adı alınmış.
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button type="submit" className="mrd-button" data-variant="primary" data-size="md">
          <span className="mrd-button__content">Hesap oluştur</span>
        </button>
        <button type="button" className="mrd-button" data-variant="ghost" data-size="md">
          <span className="mrd-button__content">Vazgeç</span>
        </button>
        <span className="mrd-badge" data-tone="success">
          <span className="mrd-badge__dot" aria-hidden="true" />
          Beta
        </span>
      </div>
    </form>
  );
}
