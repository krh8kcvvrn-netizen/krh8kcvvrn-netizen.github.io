const KEY = "open-relief-gifts";

export function loadGifts() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistGifts(gifts) {
  try {
    localStorage.setItem(KEY, JSON.stringify(gifts.slice(0, 50)));
  } catch {
    // Storage can be blocked. The in-memory receipt still works for this visit.
  }
}

export function raisedFor(campaign, gifts) {
  const extra = gifts
    .filter((gift) => gift.campaignSlug === campaign.slug)
    .reduce((sum, gift) => sum + Number(gift.amount || 0), 0);
  return campaign.raised + extra;
}

export function percentFunded(raised, goal) {
  if (!goal) return 0;
  return Math.round((raised / goal) * 100);
}
