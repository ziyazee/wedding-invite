# Shared UI Components

## Framework & CSS
- **Framework**: React 18 + react-router-dom
- **Build**: Vite
- **CSS**: Vanilla CSS files (no Tailwind in dashboard), with CSS custom properties
- **Component library**: None — dashboard uses inline JSX with CSS class names from `Workspaces.css` and `ClientDashboard.css`

## Legacy UI Primitives (`src/components/ui/`)

These use Tailwind classes and are part of the original creation flow — NOT used in the active client dashboard.

### Button (`src/components/ui/Button.tsx`)
```tsx
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-gray-900 text-white hover:bg-gray-800',
  secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
  ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
```

### Card (`src/components/ui/Card.tsx`)
```tsx
import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
}

export default function Card({ selected, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border-2 p-6 transition-all cursor-pointer ${
        selected
          ? 'border-gray-900 shadow-lg'
          : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
```

### Input (`src/components/ui/Input.tsx`)
```tsx
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={inputId}
        className={`px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-shadow ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
```

### LoadingSpinner (`src/components/ui/LoadingSpinner.tsx`)
```tsx
export default function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
    </div>
  )
}
```

## Active Dashboard UI Patterns (CSS class-based)

The client dashboard (`ClientDashboard.tsx`) uses CSS classes from `Workspaces.css` and `ClientDashboard.css` — no React component primitives.

### Button Variants (from Workspaces.css)
- `.primary-action` — sage green bg (#3b523f), white text, min-height 42px
- `.secondary-action` — white bg, sage border, sage text
- `.danger-action` — light red bg, red text
- `.back-action` — transparent, text link style
- `.text-action` — transparent, smaller link style

### Status Pills
- `.status-pill` — inline-flex, rounded, 10px font
- `.status-created` — warm yellow bg, dark yellow text
- `.status-in_progress` — light green/blue bg, teal text
- `.status-ready` — green bg, dark green text
- `.status-rejected` — light red bg, red text

### Cards
- `.metric-card` — min-height 123px, border, padding 20px. Used in overview.
- `.template-tile` — overflow hidden, border, image + text. Used in template grid.
- `.settings-card` — max-width 600px, padding 25px, border.
- `.client-selected-card` — template card in browse mode. Has hover lift effect.
- `.client-template-setting` — settings tab per-template pricing card. Two-column interior (image | controls).

### Tables
- `.table-wrap` — overflow auto, border, bg
- `.orders-table` — full width, collapse, min-width 760px
- `.orders-table th` — 44px height, uppercase, letter-spacing
- `.orders-table td` — 12–13px, border-top

### Forms
- `.order-form` — grid, gap 15px
- `.order-form fieldset` — bordered sections
- `.order-form label` — 11px, font-weight 600
- `.order-form input/select/textarea` — 13px, border, 3px radius (legacy) / 8px radius (refined)
- `.form-grid` — 2-column grid for field pairs

### Alerts
- `.workspace-alert` — red border, warning
- `.workspace-success` — green border, success

## Auth Guard (`src/pages/DashboardAccess.tsx`)
```tsx
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

export function DashboardAccess({ role, children }: { role: 'CLIENT' | 'ADMIN'; children: ReactNode }) {
  const [state, setState] = useState<'loading' | 'allowed' | 'denied'>('loading')
  useEffect(() => {
    let alive = true
    async function check() {
      if (!supabase || !isSupabaseConfigured) { if (alive) setState('denied'); return }
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) { if (alive) setState('denied'); return }
      const isAdmin = String(user.app_metadata?.role || '').toUpperCase() === 'ADMIN'
      let isClient = false
      if (role === 'CLIENT' && user.email) {
        const { data: company } = await supabase.from('companies').select('id').ilike('email', user.email).maybeSingle()
        isClient = Boolean(company)
      }
      if (alive) setState(role === 'ADMIN' ? isAdmin ? 'allowed' : 'denied' : isClient ? 'allowed' : 'denied')
    }
    void check()
    return () => { alive = false }
  }, [role])
  if (state === 'loading') return <main className="dash-loading">Verifying your secure access…</main>
  if (state === 'denied') return <Navigate to="/login" replace />
  return <>{children}</>
}

export async function signOutToLogin() {
  if (supabase) await supabase.auth.signOut()
  window.location.assign('/login')
}
```
