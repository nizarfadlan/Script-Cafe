export function formatRupiah(price: number): string {
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    currency: 'IDR',
    minimumFractionDigits: 0
  });

  return formatter.format(price);
}
