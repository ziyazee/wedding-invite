import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

export const PricingFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ivory, justifyContent: 'center', alignItems: 'center' }}>
      {/* Settings page mockup */}
      <div style={{
        width: 700, backgroundColor: '#fff', borderRadius: 16, padding: '32px 40px',
        boxShadow: '0 8px 40px #00000010',
        opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        scale: String(interpolate(frame, [0, 0.4 * fps], [0.95, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })),
      }}>
        <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', letterSpacing: 2, color: theme.champagne, textTransform: 'uppercase', marginBottom: 6 }}>Settings</div>
        <div style={{ fontSize: 24, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: theme.sage, marginBottom: 24 }}>Template Pricing</div>

        {/* Price rows */}
        {[
          ['Majestic', '₹1,800'],
          ['Embroidered Garden', '₹1,500'],
          ['Raabta', '₹1,200'],
          ['Royal Grace', '₹2,000'],
        ].map((row, i) => (
          <div key={row[0]} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 0', borderBottom: `1px solid ${theme.sage}08`,
            opacity: interpolate(frame, [(0.3 + i * 0.12) * fps, (0.6 + i * 0.12) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <div style={{ fontSize: 15, fontFamily: 'Inter, sans-serif', color: theme.darkText }}>{row[0]}</div>
            <div style={{
              padding: '6px 16px', borderRadius: 8, border: `1px solid ${theme.sage}22`,
              fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage,
            }}>{row[1]}</div>
          </div>
        ))}

        {/* Note */}
        <div style={{
          marginTop: 16, fontSize: 13, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, fontStyle: 'italic',
          opacity: interpolate(frame, [0.8 * fps, 1.2 * fps], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          You control the pricing — set margins that work for your business
        </div>
      </div>
    </AbsoluteFill>
  );
};
