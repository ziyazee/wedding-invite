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
