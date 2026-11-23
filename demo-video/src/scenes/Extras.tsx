import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

export const Extras: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ivory }}>
      <div style={{
        position: 'absolute', top: 40, left: '50%', translate: '-50% 0',
        opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', letterSpacing: 2, color: theme.champagne, textTransform: 'uppercase', textAlign: 'center' }}>And there's more</div>
      </div>

      {/* Three feature cards */}
      <div style={{
        position: 'absolute', top: 90, left: 60, right: 60, bottom: 60,
        display: 'flex', gap: 24,
      }}>
        {/* Music */}
        <div style={{
          flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: '28px 24px',
          boxShadow: '0 4px 20px #00000008', display: 'flex', flexDirection: 'column',
          opacity: interpolate(frame, [0.3 * fps, 0.8 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [0.3 * fps, 0.8 * fps], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🎵</div>
          <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: theme.sage, marginBottom: 8 }}>Music</div>
          <div style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, lineHeight: 1.5, marginBottom: 16 }}>
            Browse a curated song library or upload a custom track
          </div>
          {/* Song rows */}
          {['Mere Haath Mein', 'Tum Hi Ho', 'Custom upload ↑'].map((s, i) => (
            <div key={s} style={{
              padding: '8px 12px', borderRadius: 8, marginBottom: 6,
              backgroundColor: i === 0 ? `${theme.sage}10` : 'transparent',
              border: `1px solid ${theme.sage}${i === 0 ? '20' : '08'}`,
              fontSize: 12, fontFamily: 'Inter, sans-serif', color: i === 0 ? theme.sage : theme.warmBrown,
              fontWeight: i === 0 ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: 8,
              opacity: interpolate(frame, [(1.5 + i * 0.2) * fps, (1.9 + i * 0.2) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              {i === 0 && <span>▶</span>}
              {i === 2 && <span>📎</span>}
              {s}
            </div>
          ))}
        </div>

        {/* Languages */}
        <div style={{
          flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: '28px 24px',
          boxShadow: '0 4px 20px #00000008', display: 'flex', flexDirection: 'column',
          opacity: interpolate(frame, [0.6 * fps, 1.1 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [0.6 * fps, 1.1 * fps], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🌐</div>
          <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: theme.sage, marginBottom: 8 }}>Multi-Language</div>
          <div style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, lineHeight: 1.5, marginBottom: 16 }}>
            Switch the entire invitation to another language instantly
          </div>
          {/* Language pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['English', 'Hindi', 'Kannada', 'Malayalam'].map((l, i) => (
              <div key={l} style={{
                padding: '8px 16px', borderRadius: 20,
                backgroundColor: i === 0 ? theme.sage : `${theme.sage}08`,
                color: i === 0 ? '#fff' : theme.sage,
                fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: i === 0 ? 600 : 400,
                border: i === 0 ? 'none' : `1px solid ${theme.sage}20`,
                opacity: interpolate(frame, [(2 + i * 0.15) * fps, (2.4 + i * 0.15) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}>
                {l}
              </div>
            ))}
          </div>
          {/* Translation preview */}
          <div style={{
            marginTop: 16, padding: '10px 14px', borderRadius: 8, backgroundColor: `${theme.sage}06`,
            fontSize: 14, fontFamily: 'Inter, sans-serif', color: theme.sage,
            opacity: interpolate(frame, [3 * fps, 3.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            "हमारे परिवारों के साथ मिलकर..."
          </div>
        </div>

        {/* Multi-invitation */}
        <div style={{
          flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: '28px 24px',
          boxShadow: '0 4px 20px #00000008', display: 'flex', flexDirection: 'column',
          opacity: interpolate(frame, [0.9 * fps, 1.4 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [0.9 * fps, 1.4 * fps], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>📨</div>
          <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: theme.sage, marginBottom: 8 }}>Multiple Invitations</div>
          <div style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, lineHeight: 1.5, marginBottom: 16 }}>
            One couple order, multiple shareable invitations
          </div>
          {/* Invitation cards */}
          {[
            { name: 'Wedding + Reception', events: '2 events', color: '#E8D5C8' },
            { name: 'Mehendi Only', events: '1 event', color: '#C8E0D0' },
            { name: 'Full Celebration', events: '4 events', color: '#D0C8E0' },
          ].map((inv, i) => (
            <div key={inv.name} style={{
              padding: '10px 14px', borderRadius: 8, marginBottom: 8,
              backgroundColor: inv.color + '20',
              boxShadow: '0 1px 8px #00000006',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              opacity: interpolate(frame, [(3.5 + i * 0.3) * fps, (3.9 + i * 0.3) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              <div>
                <div style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.darkText }}>{inv.name}</div>
                <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.warmBrown }}>{inv.events}</div>
              </div>
              <div style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', color: theme.sage, fontWeight: 500 }}>Own link →</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
