import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';
import { Sidebar, PhonePreview, ProgressBar, FormField } from './DashboardShell';

export const AIUpload: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phase1 = frame < 3.5 * fps;
  const phase2 = frame >= 3.5 * fps && frame < 6.5 * fps;
  const phase3 = frame >= 6.5 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ivory }}>
      <Sidebar activeTab="Templates" />

      {/* Main form area */}
      <div style={{ position: 'absolute', left: 226, top: 24, right: 310, bottom: 24, overflow: 'hidden' }}>
        {/* Form heading */}
        <div style={{
          marginBottom: 6,
          opacity: interpolate(frame, [0.1 * fps, 0.4 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', letterSpacing: 2, color: theme.champagne, textTransform: 'uppercase' }}>New Invitation Order</div>
          <div style={{ fontSize: 20, fontFamily: 'Playfair Display, serif', fontWeight: 700, color: theme.sage, marginTop: 2 }}>Embroidered Garden</div>
        </div>

        <ProgressBar current={0} />

        <div style={{ fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage, marginBottom: 14 }}>01 · The couple</div>

        {/* Phase 1: Upload card */}
        {phase1 && (
          <div style={{
            border: `2px dashed ${theme.sage}28`, borderRadius: 14, padding: '28px 24px', textAlign: 'center',
            backgroundColor: '#fff',
            opacity: interpolate(frame, [0.4 * fps, 0.8 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📄</div>
            <div style={{ fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage, marginBottom: 4 }}>Upload your invitation</div>
            <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: theme.warmBrown }}>PDF, JPG, PNG, or WebP</div>

            {/* File dropping in */}
            <div style={{
              marginTop: 18, padding: '10px 16px', borderRadius: 8,
              backgroundColor: `${theme.sage}06`, border: `1px solid ${theme.sage}12`,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              opacity: interpolate(frame, [1.5 * fps, 2 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              translate: `0px ${interpolate(frame, [1.5 * fps, 2 * fps], [-16, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
            }}>
              <span style={{ fontSize: 14 }}>📎</span>
              <span style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: theme.darkText }}>arjun-bhavana-card.pdf</span>
              <span style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', color: theme.warmBrown }}>2.3 MB</span>
            </div>
          </div>
        )}

        {/* Phase 2: AI processing */}
        {phase2 && (
          <div style={{
            backgroundColor: '#fff', borderRadius: 14, padding: '32px 24px', textAlign: 'center',
            boxShadow: '0 2px 16px #00000006',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 26, margin: '0 auto 14px',
              backgroundColor: `${theme.sage}0c`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>🤖</div>
            <div style={{ fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: theme.sage, marginBottom: 10 }}>AI is reading your card...</div>
            <div style={{ width: 260, height: 4, backgroundColor: `${theme.sage}12`, borderRadius: 2, margin: '0 auto' }}>
              <div style={{
                height: '100%', borderRadius: 2, backgroundColor: theme.sage,
                width: `${interpolate(frame, [3.5 * fps, 6.3 * fps], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`,
              }} />
            </div>
            <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, marginTop: 8 }}>Extracting names, dates, venues, family details...</div>
          </div>
        )}

        {/* Phase 3: Filled form */}
        {phase3 && (
          <div style={{
            opacity: interpolate(frame, [6.5 * fps, 7 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            scale: String(interpolate(frame, [6.5 * fps, 7 * fps], [0.97, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })),
          }}>
            {/* Success badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#fff' }}>✓</div>
              <div style={{ fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#4CAF50' }}>All details extracted</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: "Groom's name", value: 'Arjun Mehra', delay: 0 },
                { label: "Bride's name", value: 'Bhavana Nair', delay: 0.12 },
                { label: "Groom's family", value: 'Son of Mr. & Mrs. Rajesh Mehra', delay: 0.24 },
                { label: "Bride's family", value: 'Daughter of Mr. & Mrs. Suresh Nair', delay: 0.36 },
              ].map(f => (
                <div key={f.label} style={{
                  opacity: interpolate(frame, [(7 + f.delay) * fps, (7.4 + f.delay) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  translate: `0px ${interpolate(frame, [(7 + f.delay) * fps, (7.4 + f.delay) * fps], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
                }}>
                  <FormField label={f.label} value={f.value} />
                </div>
              ))}
              <div style={{
                gridColumn: '1 / -1',
                opacity: interpolate(frame, [7.5 * fps, 7.9 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                translate: `0px ${interpolate(frame, [7.5 * fps, 7.9 * fps], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
              }}>
                <FormField label="Welcome message" value="With the blessings of our families, we joyfully invite you to celebrate our union." wide />
              </div>
            </div>
          </div>
        )}

        {/* Continue button */}
        <div style={{
          marginTop: 16, display: 'flex', justifyContent: 'flex-end',
          opacity: interpolate(frame, [0.6 * fps, 1 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ padding: '10px 22px', borderRadius: 7, backgroundColor: theme.sage, color: '#fff', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Continue →</div>
        </div>
      </div>

      {/* Phone preview */}
      <PhonePreview
        groomName={phase3 ? 'Arjun' : ''}
        brideName={phase3 ? 'Bhavana' : ''}
        date={phase3 ? 'February 14, 2025' : undefined}
        venue={phase3 ? 'Taj Palace, New Delhi' : undefined}
      />
    </AbsoluteFill>
  );
};
