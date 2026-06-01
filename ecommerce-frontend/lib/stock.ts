export function getStockCount(stock: number | undefined | null): number {
  return Math.max(0, Number(stock ?? 0));
}

export function getStockLabel(stock: number | undefined | null): string {
  const count = getStockCount(stock);
  if (count === 0) return "Out of stock";
  if (count === 1) return "1 in stock";
  return `${count} in stock`;
}

export function isInStock(stock: number | undefined | null): boolean {
  return getStockCount(stock) > 0;
}
