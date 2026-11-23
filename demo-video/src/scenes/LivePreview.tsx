import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';
import { Sidebar, ProgressBar } from './DashboardShell';

export const LivePreview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dragProgress = interpolate(frame, [3 * fps, 5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const nameY = interpolate(dragProgress, [0, 1], [0, -10]);
  const nameScale = interpolate(dragProgress, [0, 1], [1, 1.12]);

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

        <ProgressBar current={3} />

        <div style={{ fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage, marginBottom: 12 }}>Review</div>

        {/* Wedding details summary */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 10, padding: '14px 16px', marginBottom: 10,
          boxShadow: '0 1px 8px #00000005',
          opacity: interpolate(frame, [0.3 * fps, 0.6 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [0.3 * fps, 0.6 * fps], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage, marginBottom: 8 }}>02 · Wedding details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              ['Celebration', 'Wedding Ceremony'],
              ['Date', '14 February 2025'],
              ['Time', '11:00 AM'],
              ['Venue', 'The Grand Ballroom, Taj Palace'],
              ['Address', 'Mansingh Road, New Delhi'],
            ].map(([label, val], i) => (
              <div key={label} style={{ gridColumn: i >= 3 ? '1 / -1' : undefined }}>
                <div style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: theme.darkText }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Celebrations */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 10, padding: '14px 16px', marginBottom: 10,
          boxShadow: '0 1px 8px #00000005',
          opacity: interpolate(frame, [0.6 * fps, 0.9 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [0.6 * fps, 0.9 * fps], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage, marginBottom: 8 }}>03 · Celebrations</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { title: 'Mehendi', date: 'Feb 12', color: '#C8E0D018' },
              { title: 'Sangeet', date: 'Feb 13', color: '#D0C8E018' },
            ].map(ev => (
              <div key={ev.title} style={{
                flex: 1, padding: '8px 12px', borderRadius: 8, backgroundColor: ev.color,
              }}>
                <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.darkText }}>{ev.title}</div>
                <div style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', color: theme.warmBrown }}>{ev.date} · Taj Palace</div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Maps auto-detected */}
        <div style={{
          backgroundColor: '#fff', borderRadius: 10, padding: '12px 16px', marginBottom: 10,
          boxShadow: '0 1px 8px #00000005',
          opacity: interpolate(frame, [1.2 * fps, 1.6 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          translate: `0px ${interpolate(frame, [1.2 * fps, 1.6 * fps], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <span style={{ fontSize: 14 }}>📍</span>
            <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#4CAF50' }}>Google Maps auto-detected</div>
          </div>
          <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.warmBrown }}>
            The Grand Ballroom, Taj Palace → maps.google.com/...
          </div>
        </div>

        {/* Drag instruction */}
        <div style={{
          backgroundColor: `${theme.sage}08`, borderRadius: 10, padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
          opacity: interpolate(frame, [2 * fps, 2.4 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ fontSize: 18 }}>✋</div>
          <div>
            <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage }}>Drag to reposition · Resize text</div>
            <div style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', color: theme.warmBrown }}>Adjust names and details directly on the preview</div>
          </div>
        </div>

        {/* Continue button */}
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ padding: '10px 22px', borderRadius: 7, backgroundColor: theme.sage, color: '#fff', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Continue →</div>
        </div>
      </div>

      {/* Custom phone preview with drag animation */}
      <div style={{
        position: 'absolute', right: 30, top: 40, width: 260,
        opacity: interpolate(frame, [0.3 * fps, 0.7 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', letterSpacing: 1, color: theme.champagne, textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>Live Preview</div>
        <div style={{ width: 250, height: 500, borderRadius: 30, backgroundColor: '#000', padding: 6, margin: '0 auto', boxShadow: '0 12px 40px #00000018' }}>
          <div style={{
            width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden', backgroundColor: '#dce2cd',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 10,
            position: 'relative',
          }}>
            <div style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', letterSpacing: 2, color: '#354C4344', textTransform: 'uppercase' }}>Together with our families</div>

            {/* Draggable name area */}
            <div style={{
              fontSize: 26, fontFamily: 'Playfair Display, serif', color: theme.sage, textAlign: 'center', lineHeight: 1.3,
              translate: `0px ${nameY}px`,
              scale: String(nameScale),
              padding: '4px 8px', borderRadius: 4,
              border: dragProgress > 0 && dragProgress < 1 ? `1px dashed ${theme.sage}40` : '1px solid transparent',
            }}>
              Arjun
              <br /><span style={{ fontSize: 13, fontStyle: 'italic', color: theme.champagne }}>{'&'}</span><br />
              Bhavana
            </div>

            {/* Drag cursor dot */}
            {dragProgress > 0 && dragProgress < 1 && (
              <div style={{
                position: 'absolute',
                top: `${interpolate(dragProgress, [0, 1], [46, 40])}%`,
                right: 35,
                width: 16, height: 16, borderRadius: 8,
                backgroundColor: theme.sage, border: '2px solid #fff',
                boxShadow: '0 2px 6px #00000025',
                opacity: interpolate(dragProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }} />
            )}

            <div style={{ width: 30, height: 1, backgroundColor: theme.champagne }} />
            <div style={{ fontSize: 10, fontFamily: 'Cormorant Garamond, serif', color: theme.warmBrown, textAlign: 'center', lineHeight: 1.5 }}>
              February 14, 2025<br />The Grand Ballroom<br />Taj Palace, New Delhi
            </div>
            <div style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', color: `${theme.sage}88`, marginTop: 4 }}>+ Mehendi · Sangeet</div>

            <div style={{ position: 'absolute', bottom: 14, fontSize: 8, fontFamily: 'Inter, sans-serif', color: theme.sage, backgroundColor: '#ffffff88', padding: '3px 8px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#4CAF50' }} />Live
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
