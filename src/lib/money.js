export const MIN_GIFT = 5;
export const MAX_GIFT = 100000;

export function formatUsd(amount) {
  const n = Math.round(Number(amount) || 0);
  return `$${n.toLocaleString("en-US")}`;
}

export function amountError(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return "Enter an amount in dollars.";
  if (amount < MIN_GIFT) return `The smallest gift is ${formatUsd(MIN_GIFT)}.`;
  if (amount > MAX_GIFT) return `The largest gift is ${formatUsd(MAX_GIFT)}.`;
  return "";
}

export function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function describeGift(amount, campaign) {
  if (!campaign || !amount) return "";
  const whole = Math.floor(amount / campaign.unit);
  const remainder = amount % campaign.unit;
  const one = campaign.unitNoun;
  const many = campaign.unitNounPlural;
  if (whole >= 1 && remainder === 0) {
    return whole === 1 ? `This covers 1 ${one}.` : `This covers ${whole} ${many}.`;
  }
  if (whole >= 1) {
    const noun = whole === 1 ? one : many;
    return `This covers ${whole} ${noun}, plus ${formatUsd(remainder)} toward the next.`;
  }
  const pct = Math.max(1, Math.round((amount / campaign.unit) * 100));
  return `This covers ${pct}% of 1 ${one}.`;
}

export function makeReference(date = new Date()) {
  const stamp = date.getTime().toString(36).toUpperCase().slice(-5);
  const salt = Math.floor(Math.random() * 36).toString(36).toUpperCase();
  return `HB-${stamp}${salt}`;
}

export function formatWhen(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
