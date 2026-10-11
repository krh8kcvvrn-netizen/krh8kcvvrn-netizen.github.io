import { useEffect, useState } from "react";
import { wallets } from "../data";

function seedAddress(id) {
  return wallets.find((wallet) => wallet.id === id)?.address?.trim() || "";
}

export function usePublishedWallets() {
  const [addresses, setAddresses] = useState({
    btc: seedAddress("btc"),
    usdt: seedAddress("usdt"),
    btcQr: "",
    usdtQr: "",
  });

  useEffect(() => {
    let active = true;
    let request = 0;

    async function load() {
      const id = ++request;
      try {
        const response = await fetch("/api/wallets", { cache: "no-store" });
        if (!response.ok) return;
        const data = await response.json();
        if (!active || id !== request || !data) return;
        const next = {
          btc: typeof data.btc === "string" ? data.btc.trim() : "",
          usdt: typeof data.usdt === "string" ? data.usdt.trim() : "",
          btcQr: typeof data.btcQr === "string" ? data.btcQr : "",
          usdtQr: typeof data.usdtQr === "string" ? data.usdtQr : "",
        };
        setAddresses((current) => (
          current.btc === next.btc
          && current.usdt === next.usdt
          && current.btcQr === next.btcQr
          && current.usdtQr === next.usdtQr
            ? current
            : next
        ));
      } catch {
        // Keep the last addresses if the admin service is briefly unavailable.
      }
    }

    load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, 2000);
    window.addEventListener("focus", load);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("focus", load);
    };
  }, []);

  return addresses;
}
