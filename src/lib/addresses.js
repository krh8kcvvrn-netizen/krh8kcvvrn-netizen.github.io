const BTC_BASE58 = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
const BTC_BECH32 = /^bc1[ac-hj-np-z02-9]{11,87}$/;
const ETH_ADDRESS = /^0x[a-fA-F0-9]{40}$/;

export function cleanWalletAddress(value) {
  return String(value ?? "").trim();
}

export function isBitcoinAddress(value) {
  const address = cleanWalletAddress(value);
  if (!address) return true;
  if (address.toLowerCase().startsWith("bc1")) {
    if (address !== address.toLowerCase() && address !== address.toUpperCase()) return false;
    return BTC_BECH32.test(address.toLowerCase());
  }
  return BTC_BASE58.test(address);
}

export function isUsdtAddress(value) {
  const address = cleanWalletAddress(value);
  if (!address) return true;
  return ETH_ADDRESS.test(address);
}
