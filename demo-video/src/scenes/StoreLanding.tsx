import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, CanvasImage, staticFile } from 'remotion';
import { theme } from '../theme';

const templates = [
  { name: 'Majestic', color: '#e9dfca', cat: 'Royal Hindu', img: 'royal-grace.webp' },
  { name: 'Embroidered Garden', color: '#dce2cd', cat: 'Classic', img: 'embroidered-garden.webp' },
  { name: 'Raabta', color: '#1b2838', cat: 'Muslim' },
  { name: 'Qubool', color: '#2a1f1a', cat: 'Muslim' },
  { name: 'Secret Garden', color: '#d6d8c3', cat: 'Garden', img: 'secret-garden.jpg' },
  { name: 'Mangal', color: '#8B1A1A', cat: 'Hindu' },
];

export const StoreLanding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ivory }}>
      {/* Browser chrome */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 44,
        backgroundColor: '#f0ede8', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8,
        borderBottom: '1px solid #ddd',
        opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57', '#FFBD2E', '#28C840'].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c }} />
          ))}
        </div>
        <div style={{
          flex: 1, marginLeft: 12, padding: '5px 14px', borderRadius: 6, backgroundColor: '#fff',
          fontSize: 12, fontFamily: 'Inter, sans-serif', color: theme.warmBrown,
          border: '1px solid #e0dcd5',
        }}>
          elegantcards.shaadiinvites.in
        </div>
      </div>

      {/* Page content */}
      <div style={{
        position: 'absolute', top: 44, left: 0, right: 0, bottom: 0, padding: '30px 60px',
        opacity: interpolate(frame, [0.2 * fps, 0.6 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        {/* Store header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            fontSize: 32, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: theme.sage,
            opacity: interpolate(frame, [0.3 * fps, 0.7 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            Elegant Cards
          </div>
          <div style={{ fontSize: 14, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', color: theme.warmBrown, marginTop: 4 }}>
            Crafting beautiful moments since 2005
          </div>
        </div>

        {/* Section title */}
        <div style={{
          fontSize: 13, fontFamily: 'Inter, sans-serif', letterSpacing: 2, color: theme.champagne, textTransform: 'uppercase', textAlign: 'center', marginBottom: 6,
          opacity: interpolate(frame, [0.5 * fps, 0.9 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          Our Invitation Collections
        </div>

        {/* Category filters */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24,
          opacity: interpolate(frame, [0.7 * fps, 1.1 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {['All', 'Royal Hindu', 'Muslim', 'Garden', 'Classic'].map((c, i) => (
            <div key={c} style={{
              padding: '6px 16px', borderRadius: 16, fontSize: 12, fontFamily: 'Inter, sans-serif',
              backgroundColor: i === 0 ? theme.sage : 'transparent',
              color: i === 0 ? '#fff' : theme.warmBrown,
              border: i === 0 ? 'none' : `1px solid ${theme.warmBrown}25`,
            }}>{c}</div>
          ))}
        </div>

        {/* Template grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, maxWidth: 900, margin: '0 auto' }}>
          {templates.map((t, i) => {
            const stagger = i * 0.12;
            const isLight = ['#e9dfca', '#dce2cd', '#d6d8c3'].includes(t.color);
            return (
              <div key={t.name} style={{
                borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff',
                boxShadow: '0 2px 16px #00000010',
                opacity: interpolate(frame, [(0.9 + stagger) * fps, (1.3 + stagger) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                translate: `0px ${interpolate(frame, [(0.9 + stagger) * fps, (1.3 + stagger) * fps], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
              }}>
                <div style={{ height: 160, backgroundColor: t.color, position: 'relative', overflow: 'hidden' }}>
                  {t.img ? (
                    <CanvasImage src={staticFile(`templates/${t.img}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: isLight ? '#00000015' : '#ffffff20', fontFamily: 'Playfair Display, serif' }}>✦</div>
                  )}
                  <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: isLight ? '#00000055' : '#ffffff77' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                </div>
                <div style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', color: theme.champagne, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{t.cat}</div>
                  <div style={{ fontSize: 14, fontFamily: 'Playfair Display, serif', fontWeight: 600, color: theme.darkText }}>{t.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating label */}
      <div style={{
        position: 'absolute', bottom: 20, left: '50%', translate: '-50% 0',
        padding: '8px 20px', borderRadius: 20, backgroundColor: theme.sage, boxShadow: '0 4px 16px #354C4340',
        fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#fff', fontWeight: 500,
        display: 'flex', alignItems: 'center', gap: 8,
        opacity: interpolate(frame, [2 * fps, 2.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <span>🔗</span> Share this page with your customers
      </div>
    </AbsoluteFill>
  );
};
