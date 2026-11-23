import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

const TypedText: React.FC<{ text: string; startFrame: number; charsPerFrame?: number; style?: React.CSSProperties }> = ({ text, startFrame, charsPerFrame = 0.8, style }) => {
  const frame = useCurrentFrame();
  const visibleChars = Math.min(text.length, Math.max(0, Math.floor((frame - startFrame) * charsPerFrame)));
  const showCursor = frame >= startFrame && visibleChars < text.length;
  return (
    <span style={style}>
      {text.slice(0, visibleChars)}
      {showCursor && <span style={{ opacity: frame % 16 < 10 ? 1 : 0, color: theme.sage }}>|</span>}
    </span>
  );
};

const FormField: React.FC<{ label: string; value: string; typeStart: number; fadeStart: number; y?: number }> = ({ label, value, typeStart, fadeStart, y = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      opacity: interpolate(frame, [fadeStart * fps, (fadeStart + 0.3) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      translate: `0px ${interpolate(frame, [fadeStart * fps, (fadeStart + 0.3) * fps], [10, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
    }}>
      <div style={{ fontSize: 12, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, fontWeight: 500 }}>{label}</div>
      <div style={{
        padding: '10px 14px',
        borderRadius: 8,
        border: `1px solid ${theme.sage}22`,
        backgroundColor: '#fff',
        fontSize: 16,
        fontFamily: 'Inter, sans-serif',
        color: theme.darkText,
        minHeight: 20,
      }}>
        <TypedText text={value} startFrame={typeStart * fps} />
      </div>
    </div>
  );
};

const ProgressDot: React.FC<{ label: string; index: number; active: boolean; completed: boolean; fadeStart: number }> = ({ label, index, active, completed, fadeStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
      opacity: interpolate(frame, [fadeStart * fps, (fadeStart + 0.3) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: active ? theme.sage : completed ? `${theme.sage}cc` : '#e5e5e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 600,
        color: active || completed ? '#fff' : '#999',
      }}>
        {completed ? '✓' : index + 1}
      </div>
      <div style={{
        fontSize: 10,
        fontFamily: 'Inter, sans-serif',
        color: active ? theme.sage : '#999',
        fontWeight: active ? 600 : 400,
        whiteSpace: 'nowrap',
      }}>
        {label}
      </div>
    </div>
  );
};

export const FormDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const steps = ['The couple', 'Wedding details', 'Celebrations', 'Review', 'Personal touches'];
  const phase1End = 8 * fps;
  const phase2Start = 8.5 * fps;
  const phase2End = 16 * fps;
  const phase3Start = 16.5 * fps;

  const currentStep = frame < phase2Start ? 0 : frame < phase3Start ? 1 : 2;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.ivory }}>
      {/* Left sidebar mock */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 200,
        backgroundColor: theme.sage,
        display: 'flex',
        flexDirection: 'column',
        padding: '40px 20px',
        gap: 20,
        opacity: interpolate(frame, [0, 0.4 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{ fontSize: 18, fontFamily: 'Playfair Display, serif', color: '#fff', fontWeight: 600, marginBottom: 20 }}>
          Shaadi Invites
        </div>
        {['Dashboard', 'Templates', 'Orders', 'Settings'].map((item, i) => (
          <div key={item} style={{
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            color: i === 1 ? '#fff' : '#ffffff77',
            padding: '8px 12px',
            borderRadius: 8,
            backgroundColor: i === 1 ? '#ffffff18' : 'transparent',
          }}>
            {item}
          </div>
        ))}
      </div>

      {/* Main form area */}
      <div style={{
        position: 'absolute',
        left: 220,
        top: 30,
        right: 320,
        bottom: 30,
        padding: '20px 30px',
      }}>
        {/* Form header */}
        <div style={{
          marginBottom: 8,
          opacity: interpolate(frame, [0.2 * fps, 0.6 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', letterSpacing: 2, color: theme.champagne, textTransform: 'uppercase' }}>
            New Invitation Order
          </div>
          <div style={{ fontSize: 24, fontFamily: 'Playfair Display, serif', fontWeight: 600, color: theme.sage, marginTop: 4 }}>
            Embroidered Garden
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          display: 'flex',
          gap: 22,
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: `1px solid ${theme.sage}11`,
          opacity: interpolate(frame, [0.3 * fps, 0.7 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {steps.map((s, i) => (
            <ProgressDot key={s} label={s} index={i} active={i === currentStep} completed={i < currentStep} fadeStart={0.3 + i * 0.08} />
          ))}
        </div>

        {/* Step title */}
        <div style={{
          fontSize: 18,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          color: theme.sage,
          marginBottom: 20,
        }}>
          {currentStep === 0 && '01 · The couple'}
          {currentStep === 1 && '02 · Wedding details'}
          {currentStep === 2 && '03 · Celebrations'}
        </div>

        {/* Phase 1: The couple */}
        {frame < phase2Start && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}>
            <FormField label="Groom's name" value="Arjun Mehra" typeStart={1} fadeStart={0.5} />
            <FormField label="Bride's name" value="Bhavana Nair" typeStart={2.5} fadeStart={0.7} />
            <FormField label="Groom's family" value="Son of Mr. & Mrs. Rajesh Mehra" typeStart={4} fadeStart={0.9} />
            <FormField label="Bride's family" value="Daughter of Mr. & Mrs. Suresh Nair" typeStart={5.5} fadeStart={1.1} />
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Welcome message" value="With the blessings of our families, we joyfully invite you to celebrate our union." typeStart={6.5} fadeStart={1.3} />
            </div>
          </div>
        )}

        {/* Phase 2: Wedding details */}
        {frame >= phase2Start && frame < phase3Start && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}>
            <FormField label="Wedding celebration" value="Wedding Ceremony" typeStart={9} fadeStart={8.5} />
            <FormField label="Wedding date" value="2025-02-14" typeStart={10} fadeStart={8.7} />
            <FormField label="Ceremony time" value="11:00 AM" typeStart={11} fadeStart={8.9} />
            <FormField label="Venue" value="The Grand Ballroom, Taj Palace" typeStart={12} fadeStart={9.1} />
            <div style={{ gridColumn: '1 / -1' }}>
              <FormField label="Address" value="No. 1, Mansingh Road, New Delhi, 110011" typeStart={13.5} fadeStart={9.3} />
            </div>
          </div>
        )}

        {/* Phase 3: Celebrations */}
        {frame >= phase3Start && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              color: theme.warmBrown,
              opacity: 0.7,
              marginBottom: 4,
            }}>
              The wedding celebration is included from the details above.
            </div>
            {/* Celebration cards */}
            {[
              { title: 'Mehendi Ceremony', color: '#E8C4B8', date: '2025-02-12', venue: 'Poolside, Taj Palace' },
              { title: 'Sangeet Night', color: '#B8D4E8', date: '2025-02-13', venue: 'Banquet Hall, Taj Palace' },
            ].map((event, i) => (
              <div key={event.title} style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: '#fff',
                border: `1px solid ${event.color}66`,
                borderLeft: `4px solid ${event.color}`,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                opacity: interpolate(frame, [(17 + i * 1.5) * fps, (17.6 + i * 1.5) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                translate: `0px ${interpolate(frame, [(17 + i * 1.5) * fps, (17.6 + i * 1.5) * fps], [15, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px`,
              }}>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, marginBottom: 4 }}>Event name</div>
                  <div style={{ fontSize: 15, fontFamily: 'Inter, sans-serif', color: theme.darkText, fontWeight: 500 }}>
                    <TypedText text={event.title} startFrame={(17.5 + i * 1.5) * fps} charsPerFrame={1} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, marginBottom: 4 }}>Date</div>
                  <div style={{ fontSize: 15, fontFamily: 'Inter, sans-serif', color: theme.darkText }}>{event.date}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, marginBottom: 4 }}>Venue</div>
                  <div style={{ fontSize: 15, fontFamily: 'Inter, sans-serif', color: theme.darkText }}>{event.venue}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Continue button */}
        <div style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <div style={{
            padding: '12px 28px',
            borderRadius: 8,
            backgroundColor: theme.sage,
            color: '#fff',
            fontSize: 14,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            opacity: interpolate(frame, [0.8 * fps, 1.2 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            Continue →
          </div>
        </div>
      </div>

      {/* Phone preview */}
      <PhonePreview frame={frame} fps={fps} currentStep={currentStep} />
    </AbsoluteFill>
  );
};

const PhonePreview: React.FC<{ frame: number; fps: number; currentStep: number }> = ({ frame, fps, currentStep }) => {
  return (
    <div style={{
      position: 'absolute',
      right: 40,
      top: 50,
      width: 240,
      height: 480,
      borderRadius: 28,
      backgroundColor: '#000',
      padding: 6,
      boxShadow: '0 15px 50px #00000020',
      opacity: interpolate(frame, [0.5 * fps, 1 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    }}>
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: '#dce2cd',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        gap: 12,
      }}>
        {/* Mock invitation content updating live */}
        <div style={{ fontSize: 10, fontFamily: 'Inter, sans-serif', letterSpacing: 2, color: '#354C4388', textTransform: 'uppercase' }}>
          Together with our families
        </div>
        <div style={{
          fontSize: 28,
          fontFamily: 'Playfair Display, serif',
          color: theme.sage,
          textAlign: 'center',
          lineHeight: 1.3,
        }}>
          {currentStep >= 0 && (
            <TypedText text="Arjun" startFrame={1.5 * fps} charsPerFrame={0.6} style={{}} />
          )}
          <br />
          <span style={{ fontSize: 14, fontStyle: 'italic', color: theme.champagne }}>{'&'}</span>
          <br />
          {currentStep >= 0 && (
            <TypedText text="Bhavana" startFrame={3 * fps} charsPerFrame={0.6} style={{}} />
          )}
        </div>

        {currentStep >= 1 && (
          <>
            <div style={{
              width: 40,
              height: 1,
              backgroundColor: theme.champagne,
              opacity: interpolate(frame, [9 * fps, 9.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }} />
            <div style={{
              fontSize: 11,
              fontFamily: 'Cormorant Garamond, serif',
              color: theme.warmBrown,
              textAlign: 'center',
              lineHeight: 1.5,
              opacity: interpolate(frame, [10 * fps, 10.8 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              February 14, 2025
              <br />
              The Grand Ballroom
              <br />
              Taj Palace, New Delhi
            </div>
          </>
        )}

        {currentStep >= 2 && (
          <div style={{
            fontSize: 10,
            fontFamily: 'Inter, sans-serif',
            color: theme.sage,
            opacity: interpolate(frame, [18 * fps, 19 * fps], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            textAlign: 'center',
          }}>
            + Mehendi · Sangeet
          </div>
        )}

        {/* Live badge */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          fontSize: 9,
          fontFamily: 'Inter, sans-serif',
          color: theme.sage,
          backgroundColor: '#ffffff88',
          padding: '3px 10px',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50' }} />
          Live preview
        </div>
      </div>
    </div>
  );
};
