type PriceSetting = { price: number; sale_type: 'none' | 'percentage' | 'fixed'; sale_value: number }

export function templateSellingPrice(setting?: PriceSetting): number | null {
  if (!setting) return null
  const amount = setting.sale_type === 'percentage'
    ? setting.price * (1 - setting.sale_value / 100)
    : setting.sale_type === 'fixed' ? setting.price - setting.sale_value : setting.price
  return Number.isFinite(amount) && amount >= 0 ? Math.round(amount * 100) / 100 : null
}

export function parseSellingPrice(value: string): number | null {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return null
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 && amount <= 9999999999.99 ? amount : null
}

export function formatSellingPrice(amount?: number | null): string {
  if (amount == null || !Number.isFinite(amount) || amount < 0) return 'Not recorded'
  if (amount === 0) return 'Complimentary'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(amount)
}
