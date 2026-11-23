/* Golden — split text into word spans so sections can stagger them. */

export function Words({ text, className = '' }: { text: string; className?: string }) {
  return (
    <>
      {text.split(/\s+/).filter(Boolean).map((w, i, arr) => (
        <span key={`${w}-${i}`} className={`ph-word ${className}`}>
          {w}
          {i < arr.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  )
}
