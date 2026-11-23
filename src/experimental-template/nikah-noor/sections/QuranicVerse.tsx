import { OrnamentDividerSvg } from '../assets/svg'

interface Props {
  arabic: string
  translation: string
  reference: string
}

export default function QuranicVerse({ arabic, translation, reference }: Props) {
  return (
    <section className="nn-section nn-section-verse">
      <div className="nn-section-inner">
        <p className="nn-verse-ref">{reference}</p>
        <p className="nn-verse-arabic">{arabic}</p>

        <div className="nn-ornament">
          <OrnamentDividerSvg width={100} />
        </div>

        <p className="nn-verse-translation">{translation}</p>
      </div>
    </section>
  )
}
