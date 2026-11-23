import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';
import { Sidebar, PhonePreview, ProgressBar, FormField } from './DashboardShell';

export const PersonalTouches: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ivory }}>
      <Sidebar activeTab="Templates" />

      {/* Main form area */}
      <div style={{ position: 'absolute', left: 226, top: 24, right: 310, bottom: 24, overflow: 'hidden' }}>
        <div style={{
          marginBottom: 6,
          opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', letterSpacing: 2, color: theme.champagne, textTransform: 'uppercase' }}>New Invitation Order</div>
          <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: theme.sage, marginTop: 2 }}>Embroidered Garden</div>
        </div>

        <ProgressBar current={4} />

        <div style={{ fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage, marginBottom: 14 }}>Personal Touches</div>

        {/* Music section */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 10, padding: '14px 16px', marginBottom: 12,
          boxShadow: '0 1px 8px #00000005',
          opacity: interpolate(frame, [0.3 * fps, 0.6 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [0.3 * fps, 0.6 * fps], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>🎵</span>
            <div style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage }}>Background music</div>
          </div>
          {[
            { name: 'Mere Haath Mein', active: true, icon: '▶' },
            { name: 'Tum Hi Ho', active: false },
            { name: 'Upload custom track', active: false, icon: '📎' },
          ].map((song, i) => (
            <div key={song.name} style={{
              padding: '8px 12px', borderRadius: 7, marginBottom: 4,
              backgroundColor: song.active ? `${theme.sage}0c` : 'transparent',
              border: `1px solid ${theme.sage}${song.active ? '18' : '08'}`,
              fontSize: 12, fontFamily: 'Inter, sans-serif',
              color: song.active ? theme.sage : theme.warmBrown,
              fontWeight: song.active ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: 7,
              opacity: interpolate(frame, [(0.8 + i * 0.2) * fps, (1.1 + i * 0.2) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              {song.icon && <span>{song.icon}</span>}
              {song.name}
            </div>
          ))}
        </div>

        {/* Dress code and gift note */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12,
          opacity: interpolate(frame, [1.5 * fps, 1.9 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [1.5 * fps, 1.9 * fps], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <FormField label="Dress code" value="Elegant traditional attire" />
          <FormField label="A little note" value="We kindly request no boxed gifts" />
        </div>

        {/* Language section */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 10, padding: '14px 16px',
          boxShadow: '0 1px 8px #00000005',
          opacity: interpolate(frame, [2.5 * fps, 2.9 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [2.5 * fps, 2.9 * fps], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>🌐</span>
            <div style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage }}>Language</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            {['English', 'Hindi', 'Kannada', 'Malayalam'].map((lang, i) => (
              <div key={lang} style={{
                padding: '6px 14px', borderRadius: 16,
                backgroundColor: i === 0 ? theme.sage : `${theme.sage}06`,
                color: i === 0 ? '#fff' : theme.sage,
                fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: i === 0 ? 600 : 400,
                border: i === 0 ? 'none' : `1px solid ${theme.sage}18`,
                opacity: interpolate(frame, [(3 + i * 0.12) * fps, (3.3 + i * 0.12) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}>
                {lang}
              </div>
            ))}
          </div>
          {/* Translation preview */}
          <div style={{
            padding: '8px 12px', borderRadius: 7, backgroundColor: `${theme.sage}06`,
            fontSize: 13, fontFamily: 'Inter, sans-serif', color: theme.sage,
            opacity: interpolate(frame, [3.8 * fps, 4.2 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            "हमारे परिवारों के आशीर्वाद से..."
          </div>
        </div>

        {/* Place order button */}
        <div style={{
          marginTop: 14, display: 'flex', justifyContent: 'flex-end',
          opacity: interpolate(frame, [4.5 * fps, 5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ padding: '10px 22px', borderRadius: 7, backgroundColor: theme.sage, color: '#fff', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Place order →</div>
        </div>
      </div>

      {/* Phone preview with full invitation */}
      <PhonePreview
        groomName="Arjun"
        brideName="Bhavana"
        date="February 14, 2025"
        venue="Taj Palace, New Delhi"
        showEvents
        eventNames="+ Mehendi · Sangeet"
      />
    </AbsoluteFill>
  );
};
