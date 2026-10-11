import { Link } from "react-router-dom";
import { useTitle } from "../useTitle";

export default function NotFound() {
  useTitle("Page not found");

  return (
    <section className="wrap page-intro">
      <p className="kicker">Page not found</p>
      <h1>That page is not here.</h1>
      <p className="lede slim">The link may be old, or the address was typed wrong.</p>
      <Link className="btn" to="/">Back home</Link>
    </section>
  );
}
