/** Compare product cash prices only; shipping and installment interest are excluded. */
export function productSavings(singleCashPrice: string, kitCashPrice: string, quantity: number): string | null {
  const cents = (price: string) => {
    const match = /^R\$ (\d+),(\d{2})$/.exec(price);
    return match ? Number(match[1]) * 100 + Number(match[2]) : NaN;
  };
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 3) return null;
  const difference = cents(singleCashPrice) * quantity - cents(kitCashPrice);
  if (!Number.isSafeInteger(difference) || difference <= 0) return null;
  return `R$ ${(difference / 100).toFixed(2).replace(".", ",")}`;
}
