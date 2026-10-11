import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { contact, org } from "../data";
import Mark from "./Mark";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/our-work", label: "Our Work" },
  { to: "/impact", label: "Impact" },
  { to: "/donate", label: "Donate" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    function sizeMenu() {
      const top = document.querySelector(".top");
      if (top) document.documentElement.style.setProperty("--menu-top", `${top.offsetHeight}px`);
    }
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    function onResize() {
      sizeMenu();
      if (window.innerWidth > 760) setOpen(false);
    }
    sizeMenu();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <div className="top">
        <header className="site-header">
          <div className="wrap header-row">
            <Link to="/" className="brand" aria-label={`${org.name}, home`}>
              <Mark />
              <span>
                <strong>{org.name}</strong>
                <em>Healthcare, food, education, and shelter</em>
              </span>
            </Link>
            <nav id="site-nav" className={open ? "nav open" : "nav"} aria-label="Primary">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    link.to === "/donate"
                      ? "btn nav-donate"
                      : isActive
                        ? "nav-link on"
                        : "nav-link"
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <button
              className="menu-btn"
              type="button"
              aria-expanded={open}
              aria-controls="site-nav"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span className={open ? "burger open" : "burger"} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </header>
      </div>
      <main id="content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <p className="brand footer-brand">
              <Mark size={26} />
              <span>
                <strong>{org.name}</strong>
              </span>
            </p>
            <p className="footer-note">{org.line}</p>
            {contact.email ? (
              <a className="footer-mail" href={`mailto:${contact.email}`}>{contact.email}</a>
            ) : null}
          </div>
          <nav className="footer-links" aria-label="Footer">
            {links.map((link) => (
              <Link key={link.to} to={link.to}>{link.label}</Link>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
