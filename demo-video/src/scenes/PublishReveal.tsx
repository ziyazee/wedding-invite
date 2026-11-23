import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

export const PublishReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ivory }}>
      {/* Dim overlay */}
      <div style={{
        position: 'absolute', inset: 0, backgroundColor: '#00000022',
        opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }} />

      {/* Dialog card */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        translate: `-50% ${interpolate(frame, [0, 0.5 * fps], [-45, -50], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}%`,
        width: 620, backgroundColor: '#fff', borderRadius: 20, padding: '36px 40px',
        boxShadow: '0 20px 60px #00000018',
        opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
      }}>
        {/* Checkmark seal */}
        <div style={{
          width: 72, height: 72, borderRadius: 36, backgroundColor: '#4CAF50',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 20px #4CAF5038',
          scale: String(interpolate(frame, [0.2 * fps, 0.7 * fps], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.spring({ damping: 200 }), output: 'perceptual-scale',
          })),
        }}>
          <div style={{
            fontSize: 36, color: '#fff', lineHeight: 1,
            opacity: interpolate(frame, [0.4 * fps, 0.7 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>✓</div>
        </div>

        {/* Heading */}
        <div style={{
          fontSize: 28, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: theme.sage,
          opacity: interpolate(frame, [0.6 * fps, 1 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [0.6 * fps, 1 * fps], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          The invitation is live!
        </div>

        {/* Invitation link row */}
        <div style={{
          width: '100%', backgroundColor: `${theme.sage}06`, borderRadius: 10, padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          opacity: interpolate(frame, [1.2 * fps, 1.7 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [1.2 * fps, 1.7 * fps], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <div style={{ fontSize: 18 }}>🔗</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, marginBottom: 2 }}>Invitation link</div>
            <div style={{ fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage }}>shaadiinvites.in/arjun-bhavana-4821</div>
          </div>
          <div style={{ padding: '7px 16px', borderRadius: 7, backgroundColor: theme.sage, color: '#fff', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Copy</div>
        </div>

        {/* WhatsApp row */}
        <div style={{
          width: '100%', backgroundColor: '#25D366', borderRadius: 10, padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          opacity: interpolate(frame, [2 * fps, 2.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [2 * fps, 2.5 * fps], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
          boxShadow: '0 4px 14px #25D36628',
        }}>
          <div style={{ fontSize: 18 }}>💬</div>
          <div style={{ flex: 1, fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#fff' }}>Send on WhatsApp</div>
          <div style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: '#ffffffcc' }}>+91 98765 43210</div>
        </div>

        {/* Management link row */}
        <div style={{
          width: '100%', backgroundColor: `${theme.sage}06`, borderRadius: 10, padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          opacity: interpolate(frame, [4 * fps, 4.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [4 * fps, 4.5 * fps], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <div style={{ fontSize: 18 }}>🛠️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage }}>Management link</div>
            <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: theme.warmBrown }}>Customer can update names, dates, events — anytime</div>
          </div>
        </div>

        {/* Bottom note */}
        <div style={{
          fontSize: 14, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', color: theme.warmBrown, marginTop: 4,
          opacity: interpolate(frame, [5.5 * fps, 6 * fps], [0, 0.75], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          No more back and forth between store and customer
        </div>
      </div>
    </AbsoluteFill>
  );
};
