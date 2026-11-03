export type StoreDetails = {
  company_name: string
  slug: string
  contact_name: string
  email: string
  phone: string
  tagline: string
  brand_color: string
  activate: boolean
}

export type StoreTemplateSetting = {
  template_id: number
  price: number
  sale_type: 'none' | 'percentage' | 'fixed'
  sale_value: number
  is_premium: boolean
}

const reserved = new Set(['www', 'api', 'admin', 'app', 'auth', 'assets', 'client', 'dashboard', 'login', 'mail', 'smtp', 'ftp', 'support', 'templates', 'static', 'cdn', 'account'])

export function slugProblem(slug: string): string | null {
  if (!/^[a-z][a-z0-9-]{1,60}$/.test(slug) || slug.endsWith('-')) return 'Use 2–61 lowercase letters, numbers or hyphens. Start with a letter and end with a letter or number.'
  return reserved.has(slug) ? 'This store address is reserved. Choose another.' : null
}

export function validateStoreDetails(value: unknown): StoreDetails {
  if (!value || typeof value !== 'object') throw new Error('Enter the store details.')
  const source = value as Record<string, unknown>
  function text(key: string, label: string, max: number, required = true) {
    const result = typeof source[key] === 'string' ? source[key].trim() : ''
    if ((required && !result) || result.length > max) throw new Error(`${label} must contain ${required ? '1' : '0'}–${max} characters.`)
    return result
  }
  const slug = text('slug', 'Store address', 61).toLowerCase()
  const problem = slugProblem(slug)
  if (problem) throw new Error(problem)
  const email = text('email', 'Login email', 254).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid login email.')
  const phone = text('phone', 'WhatsApp number', 24).replace(/[\s()-]/g, '')
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error('Include the country code in the WhatsApp number, for example +917975948093.')
  const brand_color = text('brand_color', 'Brand colour', 7)
  if (!/^#[0-9a-f]{6}$/i.test(brand_color)) throw new Error('Choose a valid brand colour.')
  if (typeof source.activate !== 'boolean') throw new Error('Choose whether to publish the storefront.')
  return { company_name: text('company_name', 'Store name', 120), slug, contact_name: text('contact_name', 'Contact name', 100), email, phone, tagline: text('tagline', 'Tagline', 180, false), brand_color, activate: source.activate }
}

export function validateStoreTemplates(value: unknown): StoreTemplateSetting[] {
  if (!Array.isArray(value) || !value.length || value.length > 100) throw new Error('Select between one and 100 templates.')
  const ids = new Set<number>()
  return value.map(item => {
    if (!item || typeof item !== 'object' || !Number.isInteger(item.template_id) || item.template_id <= 0 || ids.has(item.template_id)) throw new Error('Choose each template once.')
    ids.add(item.template_id)
    const money = (amount: unknown) => typeof amount === 'number' && Number.isFinite(amount) && amount >= 0 && amount <= 1000000 && Math.abs(amount * 100 - Math.round(amount * 100)) < 0.000001
    if (!money(item.price) || !money(item.sale_value)) throw new Error('Prices and discounts must be between ₹0 and ₹10,00,000, with at most two decimal places.')
    if (!['none', 'percentage', 'fixed'].includes(item.sale_type) || (item.sale_type === 'none' && item.sale_value !== 0) || (item.sale_type === 'percentage' && item.sale_value > 100) || (item.sale_type === 'fixed' && item.sale_value > item.price)) throw new Error('Check each template’s discount; it cannot exceed its price or 100%.')
    if (typeof item.is_premium !== 'boolean') throw new Error('Choose a valid premium setting.')
    return { template_id: item.template_id, price: item.price, sale_type: item.sale_type, sale_value: item.sale_value, is_premium: item.is_premium }
  })
}
