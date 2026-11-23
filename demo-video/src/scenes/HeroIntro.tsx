import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

export const HeroIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.sage, justifyContent: 'center', alignItems: 'center' }}>
      {/* Subtle border */}
      <div style={{
        position: 'absolute', inset: 40,
        border: `1px solid #ffffff10`, borderRadius: 8,
        opacity: interpolate(frame, [0, 0.8 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        {/* Brand */}
        <div style={{
          fontSize: 56, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#fff',
          opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [0.2 * fps, 0.8 * fps], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          Shaadi Invites
        </div>

        <div style={{
          width: interpolate(frame, [0.6 * fps, 1.3 * fps], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }),
          height: 1, backgroundColor: theme.champagne,
        }} />

        {/* Question hook */}
        <div style={{
          fontSize: 22, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
          color: '#ffffffcc', textAlign: 'center', maxWidth: 700, lineHeight: 1.5,
          opacity: interpolate(frame, [1 * fps, 1.6 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [1 * fps, 1.6 * fps], [12, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          Stunning digital wedding invitations — in just a few seconds
        </div>

        {/* Under 5 min badge */}
        <div style={{
          marginTop: 12, padding: '10px 28px', borderRadius: 24,
          border: `1px solid ${theme.champagne}66`, backgroundColor: '#ffffff08',
          fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.champagne,
          opacity: interpolate(frame, [2 * fps, 2.6 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          scale: String(interpolate(frame, [2 * fps, 2.6 * fps], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })),
        }}>
          For wedding invitation stores across India
        </div>
      </div>
    </AbsoluteFill>
  );
};
