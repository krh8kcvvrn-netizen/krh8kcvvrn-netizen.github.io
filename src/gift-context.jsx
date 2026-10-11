import { createContext, useContext, useState } from "react";
import { campaigns } from "./data";
import { loadGifts, persistGifts, raisedFor } from "./lib/gifts";

const GiftContext = createContext(null);

export function GiftProvider({ children }) {
  const [gifts, setGifts] = useState(() => loadGifts());

  function addGift(gift) {
    const next = [gift, ...gifts].slice(0, 50);
    persistGifts(next);
    setGifts(next);
    return gift;
  }

  function clearGifts() {
    persistGifts([]);
    setGifts([]);
  }

  return (
    <GiftContext.Provider value={{ gifts, addGift, clearGifts }}>
      {children}
    </GiftContext.Provider>
  );
}

export function useGifts() {
  const ctx = useContext(GiftContext);
  if (!ctx) throw new Error("useGifts must be used within GiftProvider");
  return ctx;
}

export function useCampaigns() {
  const { gifts } = useGifts();
  return campaigns.map((campaign) => ({
    ...campaign,
    raisedNow: raisedFor(campaign, gifts),
  }));
}
