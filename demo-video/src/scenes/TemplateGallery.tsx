import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, CanvasImage, staticFile } from 'remotion';
import { theme } from '../theme';

const templates = [
  { name: 'Majestic', color: '#e9dfca', category: 'Royal Hindu' },
  { name: 'Embroidered Garden', color: '#dce2cd', category: 'Classic' },
  { name: 'Raabta', color: '#1b2838', category: 'Muslim' },
  { name: 'Qubool', color: '#2a1f1a', category: 'Muslim' },
  { name: 'Bloom', color: '#e9c9bd', category: 'Garden' },
  { name: 'Secret Garden', color: '#d6d8c3', category: 'Garden' },
  { name: 'Royal Grace', color: '#8b9274', category: 'Classic' },
  { name: 'A Timeless Union', color: '#f8f2e9', category: 'Hindu' },
];

const templateImages: Record<string, string> = {
  'Royal Grace': 'royal-grace.webp',
  'Embroidered Garden': 'embroidered-garden.webp',
  'Secret Garden': 'secret-garden.jpg',
  'Mandap at Dusk': 'mandap-at-dusk.jpg',
  'Maroon Letter': 'maroon-letter.webp',
  'Emerald Parchment': 'emerald-parchment.webp',
};

export const TemplateGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const highlightIndex = Math.floor(interpolate(frame, [2 * fps, 6 * fps], [0, templates.length - 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ivory }}>
      {/* Section header */}
      <div style={{
        position: 'absolute',
        top: 60,
        left: 80,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <div style={{
          fontSize: 14,
          fontFamily: 'Inter, sans-serif',
          letterSpacing: 4,
          color: theme.champagne,
          textTransform: 'uppercase',
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          Step 1
        </div>
        <div style={{
          fontSize: 42,
          fontFamily: 'Playfair Display, serif',
          fontWeight: 700,
          color: theme.sage,
          opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [0.2 * fps, 0.8 * fps], [15, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          Choose a Template
        </div>
        <div style={{
          fontSize: 17,
          fontFamily: 'Inter, sans-serif',
          color: theme.warmBrown,
          opacity: interpolate(frame, [0.5 * fps, 1 * fps], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          maxWidth: 380,
          lineHeight: 1.5,
        }}>
          18 curated designs across Hindu, Muslim, Christian, and destination wedding styles
        </div>
      </div>

      {/* Category filter chips */}
      <div style={{
        position: 'absolute',
        top: 200,
        left: 80,
        display: 'flex',
        gap: 10,
        opacity: interpolate(frame, [0.8 * fps, 1.3 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        {['All', 'Royal Hindu', 'Muslim', 'Garden', 'Classic'].map((cat, i) => (
          <div key={cat} style={{
            padding: '8px 18px',
            borderRadius: 20,
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            backgroundColor: i === 0 ? theme.sage : 'transparent',
            color: i === 0 ? '#fff' : theme.warmBrown,
            border: i === 0 ? 'none' : `1px solid ${theme.warmBrown}33`,
          }}>
            {cat}
          </div>
        ))}
      </div>

      {/* Template grid */}
      <div style={{
        position: 'absolute',
        top: 260,
        left: 80,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 170px)',
        gap: 18,
      }}>
        {templates.map((t, i) => {
          const isHighlighted = i === highlightIndex;
          const stagger = i * 0.12;
          const img = templateImages[t.name];
          const isLight = ['#e9dfca', '#dce2cd', '#e9c9bd', '#d6d8c3', '#f8f2e9'].includes(t.color);
          return (
            <div key={t.name} style={{
              width: 170,
              borderRadius: 10,
              overflow: 'hidden',
              opacity: interpolate(frame, [(1 + stagger) * fps, (1.5 + stagger) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              translate: `0px ${interpolate(frame, [(1 + stagger) * fps, (1.5 + stagger) * fps], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
              boxShadow: isHighlighted ? `0 0 0 3px ${theme.sage}` : '0 2px 12px #00000012',
              transition: 'box-shadow 0.3s',
            }}>
              <div style={{
                height: 200,
                backgroundColor: t.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {img ? (
                  <CanvasImage src={staticFile(`templates/${img}`)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    fontSize: 40,
                    fontFamily: 'Playfair Display, serif',
                    color: isLight ? '#00000030' : '#ffffff30',
                  }}>
                    ✦
                  </div>
                )}
                {/* Number badge */}
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  fontSize: 11,
                  fontFamily: 'Inter, sans-serif',
                  color: isLight ? '#00000066' : '#ffffff88',
                  fontWeight: 600,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
              <div style={{
                padding: '10px 12px',
                backgroundColor: '#fff',
              }}>
                <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.champagne, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
                  {t.category}
                </div>
                <div style={{ fontSize: 14, fontFamily: 'Playfair Display, serif', color: theme.darkText, fontWeight: 600 }}>
                  {t.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Phone preview on right */}
      <div style={{
        position: 'absolute',
        right: 80,
        top: 80,
        width: 260,
        height: 520,
        borderRadius: 32,
        backgroundColor: '#000',
        padding: 8,
        boxShadow: '0 20px 60px #00000025',
        opacity: interpolate(frame, [1.5 * fps, 2.2 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        scale: String(interpolate(frame, [1.5 * fps, 2.2 * fps], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })),
      }}>
        {/* Phone notch */}
        <div style={{
          position: 'absolute',
          top: 8,
          left: '50%',
          translate: '-50% 0',
          width: 80,
          height: 24,
          backgroundColor: '#000',
          borderRadius: '0 0 14px 14px',
          zIndex: 10,
        }} />
        {/* Screen content - shows highlighted template */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: templates[highlightIndex].color,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}>
          {templateImages[templates[highlightIndex].name] ? (
            <CanvasImage
              src={staticFile(`templates/${templateImages[templates[highlightIndex].name]}`)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <>
              <div style={{
                fontSize: 48,
                fontFamily: 'Playfair Display, serif',
                color: ['#1b2838', '#2a1f1a', '#31090e'].includes(templates[highlightIndex].color) ? '#ffffff44' : '#00000022',
              }}>
                ✦
              </div>
              <div style={{
                fontSize: 16,
                fontFamily: 'Playfair Display, serif',
                fontWeight: 600,
                color: ['#1b2838', '#2a1f1a', '#31090e'].includes(templates[highlightIndex].color) ? '#ffffffcc' : theme.sage,
              }}>
                {templates[highlightIndex].name}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Template name below phone */}
      <div style={{
        position: 'absolute',
        right: 80,
        bottom: 70,
        width: 260,
        textAlign: 'center',
        opacity: interpolate(frame, [2 * fps, 2.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', fontWeight: 600, color: theme.sage }}>
          {templates[highlightIndex].name}
        </div>
        <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: theme.champagne, marginTop: 4 }}>
          {templates[highlightIndex].category}
        </div>
      </div>
    </AbsoluteFill>
  );
};
