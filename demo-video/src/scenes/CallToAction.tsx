import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.sage, justifyContent: 'center', alignItems: 'center' }}>
      {/* Subtle border */}
      <div style={{
        position: 'absolute', inset: 50, border: `1px solid #ffffff10`, borderRadius: 8,
        opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }} />

      {/* Corner ornaments */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute', width: 50, height: 50,
          ...(i === 0 ? { top: 40, left: 40 } : i === 1 ? { top: 40, right: 40 } : i === 2 ? { bottom: 40, left: 40 } : { bottom: 40, right: 40 }),
          borderTop: i < 2 ? `2px solid ${theme.champagne}44` : 'none',
          borderBottom: i >= 2 ? `2px solid ${theme.champagne}44` : 'none',
          borderLeft: i % 2 === 0 ? `2px solid ${theme.champagne}44` : 'none',
          borderRight: i % 2 === 1 ? `2px solid ${theme.champagne}44` : 'none',
          opacity: interpolate(frame, [0.2 * fps, 0.7 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }} />
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, maxWidth: 720 }}>
        {/* Headline */}
        <div style={{
          fontSize: 48, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.2,
          opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [0.2 * fps, 0.8 * fps], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          Onboard your store today
        </div>

        {/* Divider */}
        <div style={{
          width: interpolate(frame, [0.8 * fps, 1.4 * fps], [0, 80], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }),
          height: 1, backgroundColor: theme.champagne,
        }} />

        {/* Culture line */}
        <div style={{
          fontSize: 20, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
          color: '#ffffffcc', textAlign: 'center', lineHeight: 1.5,
          opacity: interpolate(frame, [1.2 * fps, 1.8 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [1.2 * fps, 1.8 * fps], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          We work closely with you — designs crafted around culture, theme, and occasion
        </div>

        {/* New designs note */}
        <div style={{
          fontSize: 15, fontFamily: 'Inter, sans-serif', color: '#ffffff99',
          opacity: interpolate(frame, [2 * fps, 2.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          New templates added every month
        </div>

        {/* Feature pills */}
        <div style={{
          display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center',
          opacity: interpolate(frame, [2.5 * fps, 3 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {['AI-Powered', 'WhatsApp Delivery', 'Multi-Language', 'Customer Self-Service'].map(f => (
            <div key={f} style={{
              padding: '8px 18px', borderRadius: 20, border: `1px solid #ffffff22`,
              fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#ffffffbb',
            }}>{f}</div>
          ))}
        </div>

        {/* CTA button */}
        <div style={{
          marginTop: 20, padding: '16px 44px', borderRadius: 8,
          backgroundColor: theme.champagne, color: theme.sage,
          fontSize: 19, fontFamily: 'Inter, sans-serif', fontWeight: 700,
          boxShadow: '0 4px 20px #D5BD9140',
          opacity: interpolate(frame, [3.2 * fps, 3.8 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          scale: String(interpolate(frame, [3.2 * fps, 3.8 * fps], [0.92, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })),
        }}>
          Get started →
        </div>

        {/* Website */}
        <div style={{
          fontSize: 17, fontFamily: 'Inter, sans-serif', color: '#ffffff77', marginTop: 4,
          opacity: interpolate(frame, [4 * fps, 4.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          shaadiinvites.in
        </div>
      </div>
    </AbsoluteFill>
  );
};
