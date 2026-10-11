import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { isBitcoinAddress, isUsdtAddress } from "../lib/addresses";
import { contentProblems, nextImpactValue, readContent, submittedContent } from "../lib/content";
import { formatWhen } from "../lib/money";
import { useTitle } from "../useTitle";

const toolTitles = {
  wallets: "Wallet management",
  content: "Content editing",
  donations: "Donation log",
};

function adminSection(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "admin" || parts.length === 1) return "overview";
  if (parts.length === 2 && toolTitles[parts[1]]) return parts[1];
  return "unknown";
}

function formatReported(amount) {
  return Number(amount).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const qrFileTypes = ["image/png", "image/jpeg", "image/webp"];

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("That image could not be read."));
    reader.readAsDataURL(file);
  });
}

function replaceLocalQr(current, next) {
  if (current.startsWith("blob:")) URL.revokeObjectURL(current);
  return next;
}

function PasswordField({ id, label, value, onChange, autoComplete, visible, onToggle }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <span className="password-line">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          required
        />
        <button
          className="password-toggle"
          type="button"
          aria-controls={id}
          aria-pressed={visible}
          onClick={onToggle}
        >
          {visible ? "Hide" : "Unhide"}
        </button>
      </span>
    </div>
  );
}

function QrPicker({ id, label, alt, choice, local, published, onChoose, onRemove }) {
  const shown = choice === "remove" ? "" : (local || published || "");
  return (
    <div className="qr-pick">
      <label className="field" htmlFor={id}>
        {label}
        <input
          id={id}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => {
            onChoose(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </label>
      {shown ? (
        <img className="qr" src={shown} alt={alt} width={180} height={180} />
      ) : (
        <p className="hint">No QR code saved.</p>
      )}
      {shown ? (
        <button className="btn ghost" type="button" onClick={onRemove}>Remove QR code</button>
      ) : null}
    </div>
  );
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();
  const section = adminSection(location.pathname);
  const [status, setStatus] = useState(null);
  const [offline, setOffline] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [btc, setBtc] = useState("");
  const [usdt, setUsdt] = useState("");
  const [published, setPublished] = useState({ btc: "", usdt: "", btcQr: "", usdtQr: "" });
  const [btcQrChoice, setBtcQrChoice] = useState(null);
  const [usdtQrChoice, setUsdtQrChoice] = useState(null);
  const [btcQrLocal, setBtcQrLocal] = useState("");
  const [usdtQrLocal, setUsdtQrLocal] = useState("");
  const [content, setContent] = useState(() => readContent(null));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [contentError, setContentError] = useState("");
  const [contentNotice, setContentNotice] = useState("");
  const [statAdds, setStatAdds] = useState({});
  const [donations, setDonations] = useState([]);
  const [donationTotal, setDonationTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const signedIn = Boolean(status && !status.needsSetup && status.signedIn);

  useTitle(
    !status || !signedIn
      ? "Admin login"
      : section === "overview"
        ? "Dashboard"
        : toolTitles[section] || "Admin"
  );

  async function loadWallets() {
    const result = await api("/api/wallets");
    if (!result.data) return;
    const next = {
      btc: result.data.btc || "",
      usdt: result.data.usdt || "",
      btcQr: result.data.btcQr || "",
      usdtQr: result.data.usdtQr || "",
    };
    setPublished(next);
    setBtc(next.btc);
    setUsdt(next.usdt);
  }

  async function loadContent() {
    const result = await api("/api/content");
    if (!result.data) return;
    setContent(readContent(result.data));
  }

  async function loadDonations() {
    const result = await api("/api/admin/donations");
    if (!result.ok || !result.data) return;
    setDonations(Array.isArray(result.data.donations) ? result.data.donations : []);
    setDonationTotal(Number(result.data.total) || 0);
  }

  useEffect(() => {
    let active = true;
    api("/api/admin/status").then((result) => {
      if (!active) return;
      if (!result.data || typeof result.data.needsSetup !== "boolean") {
        setOffline(true);
        return;
      }
      setStatus(result.data);
      if (result.data.signedIn) {
        loadWallets();
        loadContent();
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!signedIn) return;
    if (section === "overview" || section === "donations") loadDonations();
  }, [signedIn, section]);

  async function onSetup(event) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords do not match.");
      return;
    }
    setBusy(true);
    const result = await api("/api/admin/setup", {
      method: "POST",
      body: JSON.stringify({ password, confirm }),
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.data?.error || "The password could not be saved.");
      return;
    }
    setPassword("");
    setConfirm("");
    setPasswordVisible(false);
    setConfirmVisible(false);
    setStatus({ needsSetup: false, signedIn: true });
    await loadWallets();
    await loadContent();
  }

  async function onLogin(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    const result = await api("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.data?.error || "That password is not correct.");
      return;
    }
    setPassword("");
    setStatus({ needsSetup: false, signedIn: true });
    await loadWallets();
    await loadContent();
  }

  async function onSave(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!isBitcoinAddress(btc)) {
      setError("Enter a Bitcoin address, or leave the field blank.");
      return;
    }
    if (!isUsdtAddress(usdt)) {
      setError("Enter a USDT (ERC-20) Ethereum address, or leave the field blank.");
      return;
    }
    const body = { btc, usdt };
    try {
      if (btcQrChoice === "remove") body.btcQr = "";
      else if (btcQrChoice instanceof File) body.btcQr = await fileToDataUrl(btcQrChoice);
      if (usdtQrChoice === "remove") body.usdtQr = "";
      else if (usdtQrChoice instanceof File) body.usdtQr = await fileToDataUrl(usdtQrChoice);
    } catch {
      setError("That image could not be read.");
      return;
    }
    setBusy(true);
    const result = await api("/api/admin/wallets", {
      method: "PUT",
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.data?.error || "The wallet details could not be saved.");
      if (result.status === 401) setStatus({ needsSetup: false, signedIn: false });
      return;
    }
    const next = {
      btc: result.data.btc || "",
      usdt: result.data.usdt || "",
      btcQr: result.data.btcQr || "",
      usdtQr: result.data.usdtQr || "",
    };
    setPublished(next);
    setBtc(next.btc);
    setUsdt(next.usdt);
    setBtcQrChoice(null);
    setUsdtQrChoice(null);
    setBtcQrLocal((current) => replaceLocalQr(current, ""));
    setUsdtQrLocal((current) => replaceLocalQr(current, ""));
    setNotice("Saved. The donation page uses these addresses and QR codes.");
  }

  function chooseQr(asset, file) {
    const setChoice = asset === "btc" ? setBtcQrChoice : setUsdtQrChoice;
    const setLocal = asset === "btc" ? setBtcQrLocal : setUsdtQrLocal;
    if (!file) return;
    if (!qrFileTypes.includes(file.type) || file.size > 1_500_000) {
      setError("Use a PNG, JPEG, or WebP image under 1.5 MB.");
      return;
    }
    setError("");
    setChoice(file);
    setLocal((current) => replaceLocalQr(current, URL.createObjectURL(file)));
  }

  function updateContent(section, index, field, value) {
    setContent((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    }));
  }

  async function persistContent(next, notice) {
    setContentError("");
    setContentNotice("");
    const problem = contentProblems(next);
    if (problem) {
      setContentError(problem);
      return false;
    }
    setBusy(true);
    const result = await api("/api/admin/content", {
      method: "PUT",
      body: JSON.stringify(next),
    });
    setBusy(false);
    if (!result.ok) {
      setContentError(result.data?.error || "The text could not be saved.");
      if (result.status === 401) setStatus({ needsSetup: false, signedIn: false });
      return false;
    }
    setContent(readContent(result.data));
    setContentNotice(notice);
    return true;
  }

  async function onSaveContent(event) {
    event.preventDefault();
    await persistContent(submittedContent(content), "Saved. The public site uses this text.");
  }

  async function changeStat(index, direction) {
    const item = content.impactStats[index];
    const amount = Number(String(statAdds[item.label] || "").replace(/[^\d]/g, ""));
    if (!amount) {
      setContentError("Enter an amount.");
      setContentNotice("");
      return;
    }
    const value = nextImpactValue(item.label, item.value, amount, direction);
    if (!value) {
      setContentError("That amount is larger than the current figure.");
      setContentNotice("");
      return;
    }
    const saved = await persistContent(submittedContent({
      ...content,
      impactStats: content.impactStats.map((stat, statIndex) => (
        statIndex === index ? { ...stat, value } : stat
      )),
    }), `${item.label} is now ${value}.`);
    if (saved) setStatAdds((current) => ({ ...current, [item.label]: "" }));
  }

  async function saveTargets() {
    await persistContent(submittedContent(content), "Saved. The Impact page uses these amounts.");
  }

  async function onLogout() {
    setError("");
    const result = await api("/api/admin/logout", { method: "POST", body: "{}" });
    if (!result.ok) {
      setError("The session could not be cleared.");
      return;
    }
    setNotice("");
    setContentNotice("");
    setPassword("");
    setConfirm("");
    setPasswordVisible(false);
    setConfirmVisible(false);
    setDonations([]);
    setDonationTotal(0);
    setStatus({ needsSetup: false, signedIn: false });
    navigate("/admin", { replace: true });
  }

  if (section === "unknown") return <Navigate to="/admin" replace />;

  const heading = !signedIn
    ? "Admin login"
    : section === "overview"
      ? "Dashboard"
      : toolTitles[section];

  return (
    <section className="admin wrap page">
      <header className="page-intro admin-intro">
        <p className="kicker">Admin</p>
        <h1 id="admin-heading">{heading}</h1>
      </header>

      {signedIn ? (
        <nav className="admin-nav" aria-label="Admin">
          <Link to="/admin" aria-current={section === "overview" ? "page" : undefined}>Dashboard</Link>
          <Link to="/admin/wallets" aria-current={section === "wallets" ? "page" : undefined}>Wallets</Link>
          <Link to="/admin/content" aria-current={section === "content" ? "page" : undefined}>Content</Link>
          <Link to="/admin/donations" aria-current={section === "donations" ? "page" : undefined}>Donations</Link>
          <button className="btn ghost" type="button" onClick={onLogout}>Log out</button>
        </nav>
      ) : null}

      {signedIn && error && section !== "overview" && section !== "wallets" ? (
        <p className="error" role="alert">{error}</p>
      ) : null}

      {offline ? (
        <p className="lede slim">The admin service is not running. Start this site with the Vite dev server, then open this page again.</p>
      ) : null}

      {!offline && !status ? <p className="hint">Loading.</p> : null}

      {status?.needsSetup ? (
        <form className="admin-form admin-panel" onSubmit={onSetup}>
          <p className="lede slim">Create the admin password. It is stored as a hash.</p>
          <PasswordField
            id="admin-password"
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            visible={passwordVisible}
            onToggle={() => setPasswordVisible((current) => !current)}
          />
          <PasswordField
            id="admin-confirm"
            label="Confirm password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            autoComplete="new-password"
            visible={confirmVisible}
            onToggle={() => setConfirmVisible((current) => !current)}
          />
          {error ? <p className="error" role="alert">{error}</p> : null}
          <button className="btn" type="submit" disabled={busy}>Create password</button>
        </form>
      ) : null}

      {status && !status.needsSetup && !status.signedIn ? (
        <form className="admin-form admin-panel" onSubmit={onLogin}>
          <PasswordField
            id="admin-password"
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            visible={passwordVisible}
            onToggle={() => setPasswordVisible((current) => !current)}
          />
          {error ? <p className="error" role="alert">{error}</p> : null}
          <button className="btn" type="submit" disabled={busy}>Log in</button>
        </form>
      ) : null}

      {signedIn && section === "overview" ? (
        <div className="admin-home">
          <ul className="admin-stats">
            <li>
              <strong>{formatReported(donationTotal)}</strong>
              <span>Total donations raised</span>
            </li>
            <li>
              <strong>{donations.length.toLocaleString("en-US")}</strong>
              <span>Number of donations logged</span>
            </li>
          </ul>
          <nav className="admin-tools" aria-label="Admin tools">
            <Link className="admin-tool" to="/admin/wallets">
              <strong>Wallet management</strong>
              <span>Bitcoin and USDT addresses, and the QR codes donors see.</span>
            </Link>
            <Link className="admin-tool" to="/admin/content">
              <strong>Content editing</strong>
              <span>Hero, Who We Help, Our Work, and the impact numbers.</span>
            </Link>
            <Link className="admin-tool" to="/admin/donations">
              <strong>Donation log</strong>
              <span>Amounts donors reported.</span>
            </Link>
          </nav>
          {error ? <p className="error" role="alert">{error}</p> : null}
        </div>
      ) : null}

      {signedIn && section === "wallets" ? (
        <form className="admin-form admin-wide" onSubmit={onSave}>
          <p className="lede slim">These Bitcoin and USDT (ERC-20) addresses are what the donation page shows. Add the wallet QR code under each address.</p>
          <div className="admin-wallet-grid">
            <section className="admin-card">
              <h2>Bitcoin</h2>
              <label className="field" htmlFor="btc-address">
                Bitcoin address
                <input
                  id="btc-address"
                  value={btc}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(event) => setBtc(event.target.value)}
                />
              </label>
              <p className="admin-published">Published now: {published.btc || "not set"}</p>
              <QrPicker
                id="btc-qr"
                label="Bitcoin QR code"
                alt="Bitcoin QR code preview"
                choice={btcQrChoice}
                local={btcQrLocal}
                published={published.btcQr}
                onChoose={(file) => chooseQr("btc", file)}
                onRemove={() => {
                  setBtcQrChoice("remove");
                  setBtcQrLocal((current) => replaceLocalQr(current, ""));
                }}
              />
            </section>
            <section className="admin-card">
              <h2>USDT (ERC-20)</h2>
              <label className="field" htmlFor="usdt-address">
                USDT address (ERC-20)
                <input
                  id="usdt-address"
                  value={usdt}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(event) => setUsdt(event.target.value)}
                />
              </label>
              <p className="admin-published">Published now: {published.usdt || "not set"}</p>
              <QrPicker
                id="usdt-qr"
                label="USDT QR code"
                alt="USDT QR code preview"
                choice={usdtQrChoice}
                local={usdtQrLocal}
                published={published.usdtQr}
                onChoose={(file) => chooseQr("usdt", file)}
                onRemove={() => {
                  setUsdtQrChoice("remove");
                  setUsdtQrLocal((current) => replaceLocalQr(current, ""));
                }}
              />
            </section>
          </div>
          <p className="hint">PNG, JPEG, or WebP. If you leave a QR code empty, the donation page builds one from the address.</p>
          {error ? <p className="error" role="alert">{error}</p> : null}
          {notice ? <p className="hint" role="status">{notice}</p> : null}
          <div className="admin-actions">
            <button className="btn" type="submit" disabled={busy}>Save</button>
          </div>
        </form>
      ) : null}

      {signedIn && section === "content" ? (
        <form className="admin-form" onSubmit={onSaveContent}>
          <p className="lede slim">These fields are the hero, the Who We Help paragraphs, the Our Work descriptions, the impact numbers, and the donation amounts on the Impact page.</p>
          <section className="admin-card">
            <h2>Hero</h2>
            <label className="field" htmlFor="hero-headline">
              Hero headline
              <input
                id="hero-headline"
                value={content.heroHeadline}
                onChange={(event) => setContent((current) => ({ ...current, heroHeadline: event.target.value }))}
              />
            </label>
            <label className="field" htmlFor="hero-subtext">
              Hero subtext
              <textarea
                id="hero-subtext"
                value={content.heroSubtext}
                onChange={(event) => setContent((current) => ({ ...current, heroSubtext: event.target.value }))}
              />
            </label>
          </section>
          <section className="admin-card">
            <h2>Who We Help</h2>
            {content.whoWeHelp.map((item, index) => (
              <label className="field" htmlFor={`help-text-${index}`} key={item.title}>
                {item.title} paragraph
                <textarea
                  id={`help-text-${index}`}
                  value={item.text}
                  onChange={(event) => updateContent("whoWeHelp", index, "text", event.target.value)}
                />
              </label>
            ))}
          </section>
          <section className="admin-card">
            <h2>Our Work</h2>
            {content.ourWork.map((item, index) => (
              <label className="field" htmlFor={`work-text-${index}`} key={item.slug}>
                {item.title} description
                <textarea
                  id={`work-text-${index}`}
                  value={item.summary}
                  onChange={(event) => updateContent("ourWork", index, "summary", event.target.value)}
                />
              </label>
            ))}
          </section>
          <section className="admin-card">
            <h2>Impact numbers</h2>
            <p className="hint">Enter an amount, then increase or decrease the homepage figure. A figure cannot go below zero.</p>
            {content.impactStats.map((item, index) => (
              <div className="admin-increase" key={item.label}>
                <p className="admin-figure">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </p>
                <label className="field" htmlFor={`stat-add-${index}`}>
                  Amount
                  <input
                    id={`stat-add-${index}`}
                    inputMode="numeric"
                    value={statAdds[item.label] || ""}
                    onChange={(event) => setStatAdds((current) => ({
                      ...current,
                      [item.label]: event.target.value.replace(/[^\d]/g, ""),
                    }))}
                  />
                </label>
                <button className="btn" type="button" disabled={busy} onClick={() => changeStat(index, "increase")}>Increase</button>
                <button className="btn ghost" type="button" disabled={busy} onClick={() => changeStat(index, "decrease")}>Decrease</button>
              </div>
            ))}
          </section>
          <section className="admin-card">
            <h2>Donation amounts</h2>
            <p className="hint">These are the figures on the Impact page. Raised is the amount already counted. Target is the aim. Either one can be set higher or lower.</p>
            <div className="admin-amounts">
              {content.goals.map((item, index) => (
                <div className="admin-amount-pair" key={item.slug}>
                  <label className="field" htmlFor={`raised-${item.slug}`}>
                    {item.title} raised (USD)
                    <input
                      id={`raised-${item.slug}`}
                      inputMode="numeric"
                      value={item.raised}
                      onChange={(event) => updateContent("goals", index, "raised", event.target.value.replace(/[^\d]/g, ""))}
                    />
                  </label>
                  <label className="field" htmlFor={`goal-${item.slug}`}>
                    {item.title} target (USD)
                    <input
                      id={`goal-${item.slug}`}
                      inputMode="numeric"
                      value={item.goal}
                      onChange={(event) => updateContent("goals", index, "goal", event.target.value.replace(/[^\d]/g, ""))}
                    />
                  </label>
                </div>
              ))}
            </div>
            <div className="admin-actions">
              <button className="btn" type="button" disabled={busy} onClick={saveTargets}>Save amounts</button>
            </div>
          </section>
          {contentError ? <p className="error" role="alert">{contentError}</p> : null}
          {contentNotice ? <p className="hint" role="status">{contentNotice}</p> : null}
          <div className="admin-actions">
            <button className="btn" type="submit" disabled={busy}>Save site text</button>
          </div>
        </form>
      ) : null}

      {signedIn && section === "donations" ? (
        <section className="admin-form admin-wide" aria-labelledby="admin-heading">
          <p className="lede slim">These are amounts donors reported. They are not a check of the transfer.</p>
          <p className="admin-total">Reported total <strong>{formatReported(donationTotal)}</strong></p>
          {donations.length ? (
            <div className="admin-table">
              <table className="ledger">
                <caption className="sr-only">Reported donations</caption>
                <thead>
                  <tr>
                    <th scope="col">When</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Crypto</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((item, index) => (
                    <tr key={`${item.at}-${index}`}>
                      <td>{formatWhen(item.at)}</td>
                      <td>{formatReported(item.amount)}</td>
                      <td>{item.asset === "usdt" ? "USDT" : "Bitcoin"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-empty">No donations reported yet.</p>
          )}
        </section>
      ) : null}
    </section>
  );
}
