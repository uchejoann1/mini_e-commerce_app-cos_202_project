const USD_TO_NGN_RATE = 1358;

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export function formatNairaFromUsd(usdAmount: number): string {
  return nairaFormatter.format(Math.round(usdAmount * USD_TO_NGN_RATE));
}
