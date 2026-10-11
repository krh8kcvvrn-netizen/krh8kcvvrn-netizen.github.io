import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import { wallets } from "../data";
import { useGifts } from "../gift-context";
import { apiUrl } from "../lib/api";
import { makeReference } from "../lib/money";
import { usePublishedWallets } from "../lib/usePublishedWallets";

const payWallets = wallets.filter((wallet) => wallet.id === "btc" || wallet.id === "usdt");

function cleanAmount(value) {
  const cleaned = String(value ?? "").replace(/[^\d.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  return rest.length ? `${whole}.${rest.join("").slice(0, 2)}` : whole;
}

function WalletQr({ value, image, label }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (image || !value) {
      setSrc("");
      return;
    }
    let active = true;
    QRCode.toDataURL(value, {
      margin: 1,
      width: 180,
      color: { dark: "#0D7377", light: "#F7F9F8" },
    }).then((url) => {
      if (active) setSrc(url);
    });
    return () => {
      active = false;
    };
  }, [value, image]);

  if (image) {
    return <img className="qr" src={image} alt={`${label} QR code`} width={180} height={180} />;
  }

  if (!src) {
    return (
      <div className="qr-placeholder" role="img" aria-label={`${label} code is not available yet`} />
    );
  }

  return <img className="qr" src={src} alt={`${label} QR code`} width={180} height={180} />;
}

export default function DonateForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addGift } = useGifts();
  const published = usePublishedWallets();
  const queryAmount = params.get("amount") || "";
  const [amount, setAmount] = useState(() => cleanAmount(queryAmount));
  const [asset, setAsset] = useState("");
  const [reportError, setReportError] = useState("");
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (queryAmount) setAmount(cleanAmount(queryAmount));
  }, [queryAmount]);

  function onAmount(event) {
    setAmount(cleanAmount(event.target.value));
  }

  async function onReport(event) {
    event.preventDefault();
    setReportError("");
    if (!amount || Number(amount) <= 0) {
      setReportError("Enter an amount greater than zero.");
      return;
    }
    if (asset !== "btc" && asset !== "usdt") {
      setReportError("Choose Bitcoin or USDT.");
      return;
    }
    setReporting(true);
    try {
      const response = await fetch(apiUrl("/api/donations"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, asset }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setReportError(data?.error || "The donation could not be recorded.");
        return;
      }
      const wallet = payWallets.find((item) => item.id === asset);
      const address = (published[asset] || "").trim();
      const gift = addGift({
        ref: makeReference(),
        amount: Number(amount),
        asset,
        network: wallet?.network || "",
        address,
        createdAt: new Date().toISOString(),
      });
      navigate(`/receipt/${gift.ref}`);
    } catch {
      setReportError("The donation could not be recorded.");
    } finally {
      setReporting(false);
    }
  }

  return (
    <div className="donate-block">
      <form onSubmit={onReport}>
        <label className="field gift-amount" htmlFor="gift-amount">
          Amount (USD)
          <input
            id="gift-amount"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={onAmount}
          />
        </label>
        <p className="lede slim">
          Type any amount in US dollars, then send that value in Bitcoin or USDT (ERC-20) from your own wallet to the matching address.
        </p>
        <fieldset className="asset-choice">
          <legend>Crypto type</legend>
          <label htmlFor="asset-btc">
            <input
              id="asset-btc"
              type="radio"
              name="asset"
              value="btc"
              checked={asset === "btc"}
              onChange={() => setAsset("btc")}
            />
            Bitcoin
          </label>
          <label htmlFor="asset-usdt">
            <input
              id="asset-usdt"
              type="radio"
              name="asset"
              value="usdt"
              checked={asset === "usdt"}
              onChange={() => setAsset("usdt")}
            />
            USDT
          </label>
        </fieldset>
        {reportError ? <p className="error" role="alert">{reportError}</p> : null}
        <div className="admin-actions">
          <button className="btn" type="submit" disabled={reporting}>Submit donation</button>
        </div>
      </form>
      <div className="pay-grid">
        {payWallets.map((wallet) => {
          const address = (published[wallet.id] || "").trim();
          return (
            <article className="pay-card" key={wallet.id}>
              <h3>{wallet.id === "usdt" ? "USDT" : "Bitcoin"}</h3>
              <p className="hint">{wallet.id === "usdt" ? "ERC-20 on Ethereum" : "Bitcoin network"}</p>
              <WalletQr
                value={address}
                image={published[`${wallet.id}Qr`] || ""}
                label={wallet.id === "usdt" ? "USDT" : "Bitcoin"}
              />
              <p className="address">
                {address || "Address coming soon."}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
