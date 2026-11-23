import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { theme } from '../theme';

const TypedText: React.FC<{ text: string; startFrame: number; speed?: number }> = ({ text, startFrame, speed = 0.8 }) => {
  const frame = useCurrentFrame();
  const chars = Math.min(text.length, Math.max(0, Math.floor((frame - startFrame) * speed)));
  const showCursor = frame >= startFrame && chars < text.length;
  return <>{text.slice(0, chars)}{showCursor && <span style={{ opacity: frame % 16 < 10 ? 1 : 0, color: theme.sage }}>|</span>}</>;
};

export { TypedText };

export const Sidebar: React.FC<{ activeTab?: string }> = ({ activeTab = 'Templates' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tabs = ['Dashboard', 'Templates', 'Orders', 'Settings'];
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0, width: 206,
      backgroundColor: theme.sage, padding: '24px 14px', display: 'flex', flexDirection: 'column',
      opacity: interpolate(frame, [0, 0.3 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    }}>
      <div style={{ fontSize: 15, fontFamily: 'Playfair Display, serif', color: '#fff', fontWeight: 600, marginBottom: 28, paddingLeft: 8 }}>Shaadi Invites</div>
      {tabs.map(t => (
        <div key={t} style={{
          fontSize: 13, fontFamily: 'Inter, sans-serif', padding: '9px 12px', borderRadius: 7, marginBottom: 2,
          color: t === activeTab ? '#fff' : '#ffffff55',
          backgroundColor: t === activeTab ? '#ffffff18' : 'transparent',
          fontWeight: t === activeTab ? 500 : 400,
        }}>{t}</div>
      ))}
      <div style={{
        marginTop: 'auto', padding: '10px 10px', borderRadius: 8, backgroundColor: '#ffffff0c',
        fontSize: 11, fontFamily: 'Inter, sans-serif', color: '#ffffff88',
      }}>
        <div style={{ fontWeight: 600, color: '#ffffffcc', marginBottom: 2 }}>Elegant Cards</div>
        Mumbai, India
      </div>
    </div>
  );
};

export const PhonePreview: React.FC<{
  groomName?: string; brideName?: string; date?: string; venue?: string;
  showEvents?: boolean; eventNames?: string; templateColor?: string;
}> = ({ groomName = '', brideName = '', date, venue, showEvents, eventNames, templateColor = '#dce2cd' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{
      position: 'absolute', right: 30, top: 40, width: 260,
      opacity: interpolate(frame, [0.3 * fps, 0.7 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    }}>
      <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', letterSpacing: 1, color: theme.champagne, textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>Live Preview</div>
      <div style={{
        width: 250, height: 500, borderRadius: 30, backgroundColor: '#000', padding: 6, margin: '0 auto',
        boxShadow: '0 12px 40px #00000018',
      }}>
        <div style={{
          width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden', backgroundColor: templateColor,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 10,
        }}>
          <div style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', letterSpacing: 2, color: '#354C4344', textTransform: 'uppercase' }}>Together with our families</div>
          <div style={{ fontSize: 26, fontFamily: 'Playfair Display, serif', color: theme.sage, textAlign: 'center', lineHeight: 1.3 }}>
            {groomName || <span style={{ color: '#354C4322' }}>Groom</span>}
            <br /><span style={{ fontSize: 13, fontStyle: 'italic', color: theme.champagne }}>{'&'}</span><br />
            {brideName || <span style={{ color: '#354C4322' }}>Bride</span>}
          </div>
          {date && (<>
            <div style={{ width: 30, height: 1, backgroundColor: theme.champagne }} />
            <div style={{ fontSize: 10, fontFamily: 'Cormorant Garamond, serif', color: theme.warmBrown, textAlign: 'center', lineHeight: 1.5 }}>
              {date}{venue && <><br />{venue}</>}
            </div>
          </>)}
          {showEvents && eventNames && (
            <div style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', color: `${theme.sage}88`, marginTop: 4 }}>{eventNames}</div>
          )}
          <div style={{ position: 'absolute', bottom: 14, fontSize: 8, fontFamily: 'Inter, sans-serif', color: theme.sage, backgroundColor: '#ffffff88', padding: '3px 8px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#4CAF50' }} />Live
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProgressBar: React.FC<{ current: number }> = ({ current }) => {
  const steps = ['The couple', 'Wedding details', 'Celebrations', 'Review', 'Personal touches'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: i < current ? `${theme.sage}cc` : i === current ? theme.sage : '#e0dcd5',
            fontSize: 10, fontFamily: 'Inter, sans-serif', fontWeight: 600,
            color: i <= current ? '#fff' : '#999',
          }}>
            {i < current ? '✓' : i + 1}
          </div>
          <div style={{ fontSize: 9, fontFamily: 'Inter, sans-serif', color: i === current ? theme.sage : '#aaa', fontWeight: i === current ? 600 : 400, marginRight: 8 }}>{s}</div>
          {i < steps.length - 1 && <div style={{ width: 16, height: 1, backgroundColor: '#e0dcd5', marginRight: 4 }} />}
        </div>
      ))}
    </div>
  );
};

export const FormField: React.FC<{ label: string; value?: string; typeStart?: number; wide?: boolean }> = ({ label, value, typeStart, wide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ gridColumn: wide ? '1 / -1' : undefined }}>
      <div style={{ fontSize: 11, fontFamily: 'Inter, sans-serif', color: theme.warmBrown, marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{
        padding: '9px 12px', borderRadius: 7, border: `1px solid ${theme.sage}15`, backgroundColor: '#fff',
        fontSize: 14, fontFamily: 'Inter, sans-serif', color: theme.darkText, minHeight: 18,
      }}>
        {typeStart !== undefined && value ? <TypedText text={value} startFrame={typeStart * fps} /> : (value || <span style={{ color: '#ccc' }}>—</span>)}
      </div>
    </div>
  );
};
