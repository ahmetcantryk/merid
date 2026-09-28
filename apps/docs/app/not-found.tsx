import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <p className="not-found__code">404</p>
        <h1>This page is off the map.</h1>
        <p>The address may have changed when the documentation was reorganised. Search with ⌘K or start from the introduction.</p>
        <div className="not-found__actions">
          <Link href="/docs/introduction" className="btn" data-variant="primary">
            Read the docs
          </Link>
          <Link href="/" className="btn" data-variant="secondary">
            Go to the home page
          </Link>
        </div>
      </div>
    </section>
  );
}
