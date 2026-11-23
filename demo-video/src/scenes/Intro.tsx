import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.sage, justifyContent: 'center', alignItems: 'center' }}>
      {/* Subtle frame */}
      <div style={{
        position: 'absolute', inset: 44,
        border: `1px solid #ffffff0c`, borderRadius: 8,
        opacity: interpolate(frame, [0.3 * fps, 1 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }} />

      {/* Corner ornaments */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          position: 'absolute', width: 44, height: 44,
          ...(i === 0 ? { top: 36, left: 36 } : i === 1 ? { top: 36, right: 36 } : i === 2 ? { bottom: 36, left: 36 } : { bottom: 36, right: 36 }),
          borderTop: i < 2 ? `1.5px solid ${theme.champagne}40` : 'none',
          borderBottom: i >= 2 ? `1.5px solid ${theme.champagne}40` : 'none',
          borderLeft: i % 2 === 0 ? `1.5px solid ${theme.champagne}40` : 'none',
          borderRight: i % 2 === 1 ? `1.5px solid ${theme.champagne}40` : 'none',
          opacity: interpolate(frame, [0.4 * fps, 1 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }} />
      ))}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, maxWidth: 720 }}>
        {/* Brand name */}
        <div style={{
          fontSize: 58, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#fff',
          opacity: interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [0.2 * fps, 0.9 * fps], [18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          Shaadi Invites
        </div>

        {/* Divider */}
        <div style={{
          width: interpolate(frame, [0.7 * fps, 1.4 * fps], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }),
          height: 1, backgroundColor: theme.champagne,
        }} />

        {/* What it is */}
        <div style={{
          fontSize: 21, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
          color: '#ffffffcc', textAlign: 'center', lineHeight: 1.6,
          opacity: interpolate(frame, [1 * fps, 1.7 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [1 * fps, 1.7 * fps], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          A platform built for wedding invitation stores
        </div>

        {/* The hook */}
        <div style={{
          fontSize: 17, fontFamily: 'Inter, sans-serif', color: '#ffffffaa', textAlign: 'center',
          opacity: interpolate(frame, [2.2 * fps, 2.8 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          Stunning digital invitations — in just a few seconds
        </div>

        {/* Badge */}
        <div style={{
          marginTop: 8, padding: '10px 24px', borderRadius: 22,
          border: `1px solid ${theme.champagne}55`, backgroundColor: '#ffffff08',
          fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 500, color: theme.champagne,
          opacity: interpolate(frame, [3 * fps, 3.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          scale: String(interpolate(frame, [3 * fps, 3.5 * fps], [0.92, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })),
        }}>
          For stores across India
        </div>
      </div>
    </AbsoluteFill>
  );
};
